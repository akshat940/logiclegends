const express = require('express');
const athleteController = require('./athlete.controller');
const authMiddleware = require('../auth/auth.middleware');

const router = express.Router();

router.get('/profile', authMiddleware, athleteController.getProfile);
router.put('/profile', authMiddleware, athleteController.updateProfile);

module.exports = router;
