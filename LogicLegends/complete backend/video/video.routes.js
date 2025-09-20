const express = require('express');
const videoController = require('./video.controller');
const authMiddleware = require('../auth/auth.middleware');

const router = express.Router();

router.post('/upload', authMiddleware, videoController.uploadVideo);
router.get('/:id/url', authMiddleware, videoController.getUrl);

module.exports = router;
