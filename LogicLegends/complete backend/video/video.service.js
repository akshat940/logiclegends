const Video = require('./video.model');
const videoS3 = require('./video.s3');

async function uploadVideoFile(fileBuffer, fileName, mimeType, userId) {
  const key = `videos/${userId}/${Date.now()}_${fileName}`;
  await videoS3.uploadVideo(fileBuffer, key, mimeType);

  const videoDoc = new Video({
    key,
    userId,
    uploadedAt: new Date(),
  });
  await videoDoc.save();

  return videoDoc;
}

async function getVideoById(id) {
  return Video.findById(id);
}

async function getVideoUrl(key) {
  return videoS3.getVideoUrl(key);
}

module.exports = {
  uploadVideoFile,
  getVideoById,
  getVideoUrl,
};
