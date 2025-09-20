const athleteService = require('./athlete.service');

async function getProfile(req, res) {
  try {
    const athlete = await athleteService.getAthleteByUserId(req.user.id);
    res.json(athlete);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const updateData = req.body;
    const athlete = await athleteService.updateAthlete(req.user.id, updateData);
    res.json(athlete);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
