const aiService = require('./ai.service');

async function submitJob(req, res) {
  try {
    const { videoId, parameters } = req.body;
    if (!videoId) return res.status(400).json({ message: 'videoId is required' });
    const job = await aiService.submitAIJob(videoId, parameters || {});
    res.status(202).json({ jobId: job._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getJobStatus(req, res) {
  try {
    const jobId = req.params.id;
    const job = await aiService.getJobStatus(jobId);
    res.json({
      status: job.status,
      result: job.result,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

module.exports = {
  submitJob,
  getJobStatus,
};
