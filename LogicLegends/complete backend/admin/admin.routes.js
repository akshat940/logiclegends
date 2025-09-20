const express = require('express');
const adminController = require('./admin.controller');
const authMiddleware = require('../auth/auth.middleware');

const router = express.Router();

router.post('/login', adminController.loginAdmin);
router.get('/users', authMiddleware, adminController.listUsers);
router.post('/users/:id/ban', authMiddleware, adminController.banUser);

module.exports = router;
