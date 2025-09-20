const multer = require('multer');
const videoService = require('./video.service');

const upload = multer();

async function uploadVideo(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No video file uploaded' });
    const { buffer, originalname, mimetype } = req.file;
    const userId = req.user.id;

    const videoDoc = await videoService.uploadVideoFile(buffer, originalname, mimetype, userId);
    res.status(201).json({ videoId: videoDoc._id, key: videoDoc.key });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUrl(req, res) {
  try {
    const videoId = req.params.id;
    const videoDoc = await videoService.getVideoById(videoId);
    if (!videoDoc) return res.status(404).json({ message: 'Video not found' });

    const url = await videoService.getVideoUrl(videoDoc.key);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  uploadVideo: [upload.single('video'), uploadVideo],
  getUrl,
};
