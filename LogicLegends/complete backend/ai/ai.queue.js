const amqp = require('amqplib');
const config = require('../config');

let channel;

async function connectQueue() {
  if (channel) return channel;

  const connection = await amqp.connect(config.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('ai_jobs', { durable: true });

  return channel;
}

async function enqueueAIJob(jobData) {
  const ch = await connectQueue();
  const msgBuffer = Buffer.from(JSON.stringify(jobData));
  ch.sendToQueue('ai_jobs', msgBuffer, { persistent: true });
}

module.exports = {
  enqueueAIJob,
};
