const Athlete = require('./athlete.model');

async function getAthleteByUserId(userId) {
  const athlete = await Athlete.findOne({ userId });
  if (!athlete) throw new Error('Athlete profile not found');
  return athlete;
}

async function updateAthlete(userId, updateData) {
  const athlete = await Athlete.findOneAndUpdate({ userId }, updateData, { new: true });
  if (!athlete) throw new Error('Athlete profile not found');
  return athlete;
}

async function createAthlete(data) {
  const existing = await Athlete.findOne({ userId: data.userId });
  if (existing) throw new Error('Athlete profile already exists');
  const athlete = new Athlete(data);
  await athlete.save();
  return athlete;
}

module.exports = {
  getAthleteByUserId,
  updateAthlete,
  createAthlete,
};
