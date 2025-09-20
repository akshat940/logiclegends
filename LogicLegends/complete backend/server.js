const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config');

const server = http.createServer(app);

const io = new Server(server, {
  cors: config.SOCKET_IO_OPTIONS,
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Example event listener for real-time updates
  socket.on('subscribeToAthlete', (athleteId) => {
    socket.join(`athlete_${athleteId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});

module.exports = server;
