const mongoose = require('mongoose');

const userPointsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  points: { type: Number, default: 0 },
});

const rewardSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  description: String,
});

const UserPoints = mongoose.model('UserPoints', userPointsSchema);
const Reward = mongoose.model('Reward', rewardSchema);

async function awardPoints(userId, points) {
  let userPoints = await UserPoints.findOne({ userId });
  if (!userPoints) {
    userPoints = new UserPoints({ userId, points });
  } else {
    userPoints.points += points;
  }
  await userPoints.save();
  return userPoints;
}

async function getUserPoints(userId) {
  let userPoints = await UserPoints.findOne({ userId });
  if (!userPoints) {
    userPoints = new UserPoints({ userId, points: 0 });
    await userPoints.save();
  }
  return userPoints;
}

async function redeemReward(userId, rewardId) {
  const reward = await Reward.findById(rewardId);
  if (!reward) throw new Error('Reward not found');

  const userPoints = await getUserPoints(userId);
  if (userPoints.points < reward.cost) throw new Error('Insufficient points');

  userPoints.points -= reward.cost;
  await userPoints.save();

  // You can add logic to assign reward to user here

  return { userPoints, reward };
}

module.exports = {
  awardPoints,
  getUserPoints,
  redeemReward,
};
