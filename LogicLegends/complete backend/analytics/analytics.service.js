const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  metadata: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

async function recordEvent(userId, eventType, metadata) {
  const event = new AnalyticsEvent({ userId, eventType, metadata });
  await event.save();
  return event;
}

async function getUserAnalytics(userId) {
  return AnalyticsEvent.find({ userId }).sort({ timestamp: -1 });
}

async function getAggregateAnalytics() {
  // Example aggregation: count events by type
  return AnalyticsEvent.aggregate([
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
      },
    },
  ]);
}

module.exports = {
  recordEvent,
  getUserAnalytics,
  getAggregateAnalytics,
};
