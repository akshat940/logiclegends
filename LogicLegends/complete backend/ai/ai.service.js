const aiQueue = require('./ai.queue');
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, required: true },
  parameters: { type: Object },
  status: { type: String, enum: ['queued', 'processing', 'completed', 'failed'], default: 'queued' },
  result: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AIJob = mongoose.model('AIJob', jobSchema);

async function submitAIJob(videoId, parameters) {
  const job = new AIJob({ videoId, parameters });
  await job.save();
  await aiQueue.enqueueAIJob({ jobId: job._id.toString(), videoId, parameters });
  return job;
}

async function getJobStatus(jobId) {
  const job = await AIJob.findById(jobId);
  if (!job) throw new Error('Job not found');
  return job;
}

module.exports = {
  submitAIJob,
  getJobStatus,
};
