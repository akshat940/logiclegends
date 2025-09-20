const analyticsService = require('./analytics.service');

async function recordUserEvent(req, res) {
  try {
    const userId = req.user.id;
    const { eventType, metadata } = req.body;
    if (!eventType) return res.status(400).json({ message: 'eventType is required' });

    const event = await analyticsService.recordEvent(userId, eventType, metadata);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUserAnalytics(req, res) {
  try {
    const { userId } = req.params;
    const events = await analyticsService.getUserAnalytics(userId);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAggregateAnalytics(req, res) {
  try {
    const aggregate = await analyticsService.getAggregateAnalytics();
    res.json(aggregate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  recordUserEvent,
  getUserAnalytics,
  getAggregateAnalytics,
};
