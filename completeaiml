from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import List, Dict
from pydantic import BaseModel
import mediapipe as mpgit
import cv2
import numpy as np
import hashlib
from sklearn.ensemble import IsolationForest
from xgboost import XGBClassifier
import joblib
import io

app = FastAPI(title="AI/ML Video Analysis & Assessment Backend")

mp_pose = mp.solutions.pose

# Global models storage
pose_anomaly_model = None
injury_risk_model = None


class Landmark(BaseModel):
    x: float
    y: float
    z: float
    visibility: float


class PoseLandmarks(BaseModel):
    landmarks: List[Landmark]  # Expecting 33 landmarks


class PoseBatch(BaseModel):
    poses: List[PoseLandmarks]


class SkillAssessment(BaseModel):
    skill_scores: Dict[str, float]


class InjuryFeatures(BaseModel):
    features: Dict[str, float]


class TrainingThresholds(BaseModel):
    thresholds: Dict[str, float]


class RecommendationResponse(BaseModel):
    recommendations: Dict[str, str]


def extract_pose_from_image(image_bytes: bytes) -> List[Landmark]:
    image = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(image, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image data")
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    with mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5) as pose:
        results = pose.process(img_rgb)
        if not results.pose_landmarks:
            raise ValueError("No pose landmarks detected")
        landmarks = []
        for lm in results.pose_landmarks.landmark:
            landmarks.append(Landmark(x=lm.x, y=lm.y, z=lm.z, visibility=lm.visibility))
        return landmarks


def average_hash(frame: np.ndarray, hash_size: int = 8) -> str:
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (hash_size, hash_size))
    avg = resized.mean()
    diff = resized > avg
    # Convert binary array to hex string for easier comparison
    bits = ''.join(['1' if x else '0' for x in diff.flatten()])
    width = len(bits) // 4
    return f"{int(bits, 2):0{width}x}"


def train_isolation_forest_on_poses(pose_batch: PoseBatch):
    global pose_anomaly_model
    # Flatten landmarks into feature vectors: 33 landmarks * 4 values (x,y,z,visibility)
    data = []
    for pose in pose_batch.poses:
        if len(pose.landmarks) != 33:
            raise ValueError("Each pose must have 33 landmarks")
        features = []
        for lm in pose.landmarks:
            features.extend([lm.x, lm.y, lm.z, lm.visibility])
        data.append(features)
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    model.fit(data)
    pose_anomaly_model = model


def detect_pose_anomalies(pose_batch: PoseBatch) -> List[float]:
    if pose_anomaly_model is None:
        raise HTTPException(status_code=400, detail="Pose anomaly model not trained yet")
    data = []
    for pose in pose_batch.poses:
        if len(pose.landmarks) != 33:
            raise ValueError("Each pose must have 33 landmarks")
        features = []
        for lm in pose.landmarks:
            features.extend([lm.x, lm.y, lm.z, lm.visibility])
        data.append(features)
    scores = pose_anomaly_model.decision_function(data)
    return scores.tolist()


def personalized_training_recommendations(
    skill_assessment: SkillAssessment,
    thresholds: TrainingThresholds,
    injury_features: InjuryFeatures
) -> RecommendationResponse:
    recommendations = {}

    # Identify weaknesses
    weaknesses = []
    for skill, score in skill_assessment.skill_scores.items():
        threshold = thresholds.thresholds.get(skill, 0.5)
        if score < threshold:
            weaknesses.append(skill)
            recommendations[f"improve_{skill}"] = f"Your {skill} score is low ({score:.2f}). Focus on drills to enhance it."

    if not weaknesses:
        recommendations["general"] = "Your skill scores are satisfactory. Maintain your current training regimen."

    # Injury risk prediction
    if injury_risk_model is not None:
        feature_vector = []
        # Sort keys to keep consistent order
        keys = sorted(injury_features.features.keys())
        for k in keys:
            feature_vector.append(injury_features.features[k])
        pred = injury_risk_model.predict(np.array([feature_vector]))
        if pred[0] == 1:
            recommendations["injury_risk"] = "Warning: High injury risk detected. Consider consulting a specialist and adjusting training intensity."
        else:
            recommendations["injury_risk"] = "Low injury risk detected. Continue current training with caution."

    else:
        recommendations["injury_risk"] = "Injury risk model not available."

    return RecommendationResponse(recommendations=recommendations)


@app.post("/analyze-pose/", response_model=PoseLandmarks)
async def analyze_pose(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        landmarks = extract_pose_from_image(contents)
        return PoseLandmarks(landmarks=landmarks)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Pose extraction failed: {e}")


@app.post("/detect-cheat/")
async def detect_cheat(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least two frames are required for cheat detection")
    hashes = []
    frames = []
    for file in files:
        contents = await file.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data in one of the files")
        frames.append(img)
        h = average_hash(img)
        hashes.append(h)

    # Detect replay attack: identical hashes repeated
    unique_hashes = set(hashes)
    replay_detected = len(unique_hashes) < len(hashes)

    # Detect static frame anomaly: if consecutive frames are identical
    static_frame_detected = False
    for i in range(len(hashes)-1):
        if hashes[i] == hashes[i+1]:
            static_frame_detected = True
            break

    return {
        "replay_attack_detected": replay_detected,
        "static_frame_detected": static_frame_detected,
        "hashes": hashes
    }


@app.post("/train-pose-anomaly/")
async def train_pose_anomaly(pose_batch: PoseBatch):
    try:
        train_isolation_forest_on_poses(pose_batch)
        return {"detail": "Pose anomaly model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Training failed: {e}")


@app.post("/detect-pose-anomaly/")
async def detect_pose_anomaly(pose_batch: PoseBatch):
    try:
        scores = detect_pose_anomalies(pose_batch)
        return {"anomaly_scores": scores}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Detection failed: {e}")


@app.post("/recommend-training/", response_model=RecommendationResponse)
async def recommend_training(
    skill_assessment: SkillAssessment,
    thresholds: TrainingThresholds,
    injury_features: InjuryFeatures
):
    try:
        recommendations = personalized_training_recommendations(skill_assessment, thresholds, injury_features)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Recommendation generation failed: {e}")


def train_example_injury_risk_model():
    global injury_risk_model
    # Simulated training data for injury risk classification
    # Features: arbitrary numeric features, labels: 0 (low risk), 1 (high risk)
    X_train = np.random.rand(100, 5)
    y_train = np.random.choice([0, 1], size=100, p=[0.7, 0.3])
    model = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    model.fit(X_train, y_train)
    injury_risk_model = model


@app.on_event("startup")
async def startup_event():
    train_example_injury_risk_model()
