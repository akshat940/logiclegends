const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./auth/auth.routes');
const athleteRoutes = require('./athlete/athlete.routes');
const videoRoutes = require('./video/video.routes');
const aiRoutes = require('./ai/ai.routes');
const analyticsRoutes = require('./analytics/analytics.routes');
const gamificationRoutes = require('./gamification/gamification.routes');
const adminRoutes = require('./admin/admin.routes');

const securityMiddleware = require('./security/security.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(securityMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('AI-Powered Sports Talent Ecosystem Backend');
});

module.exports = app;
