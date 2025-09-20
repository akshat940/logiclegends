const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config');

const s3Client = new S3Client({
  region: 'us-east-1', // set your region accordingly
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadVideo(buffer, key, mimeType) {
  const params = {
    Bucket: config.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return key;
}

async function getVideoUrl(key) {
  const command = new GetObjectCommand({
    Bucket: config.AWS_S3_BUCKET_NAME,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiry
  return url;
}

module.exports = {
  uploadVideo,
  getVideoUrl,
};
