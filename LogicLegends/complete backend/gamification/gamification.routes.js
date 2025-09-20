const express = require('express');
const gamificationController = require('./gamification.controller');
const authMiddleware = require('../auth/auth.middleware');

const router = express.Router();

router.post('/points', authMiddleware, gamificationController.awardPointsHandler);
router.get('/points', authMiddleware, gamificationController.getPointsHandler);
router.post('/redeem', authMiddleware, gamificationController.redeemRewardHandler);

module.exports = router;
