const express = require('express');
const aiController = require('./ai.controller');
const authMiddleware = require('../auth/auth.middleware');

const router = express.Router();

router.post('/jobs', authMiddleware, aiController.submitJob);
router.get('/jobs/:id/status', authMiddleware, aiController.getJobStatus);

module.exports = router;
