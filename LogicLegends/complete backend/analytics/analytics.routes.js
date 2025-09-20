const express = require('express');
const analyticsController = require('./analytics.controller');
const authMiddleware = require('../auth/auth.middleware');

const router = express.Router();

router.post('/events', authMiddleware, analyticsController.recordUserEvent);
router.get('/user/:userId', authMiddleware, analyticsController.getUserAnalytics);
router.get('/aggregate', authMiddleware, analyticsController.getAggregateAnalytics);

module.exports = router;
