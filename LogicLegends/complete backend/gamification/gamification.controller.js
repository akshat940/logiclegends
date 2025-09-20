const gamificationService = require('./gamification.service');

async function awardPointsHandler(req, res) {
  try {
    const userId = req.user.id;
    const { points } = req.body;
    if (typeof points !== 'number') return res.status(400).json({ message: 'Points must be a number' });

    const userPoints = await gamificationService.awardPoints(userId, points);
    res.json(userPoints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPointsHandler(req, res) {
  try {
    const userId = req.user.id;
    const userPoints = await gamificationService.getUserPoints(userId);
    res.json(userPoints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function redeemRewardHandler(req, res) {
  try {
    const userId = req.user.id;
    const { rewardId } = req.body;
    if (!rewardId) return res.status(400).json({ message: 'rewardId is required' });

    const result = await gamificationService.redeemReward(userId, rewardId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  awardPointsHandler,
  getPointsHandler,
  redeemRewardHandler,
};
