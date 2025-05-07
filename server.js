const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let userSelections = {}; // { socketId: number }
let numberStats = {}; // { number: count }
let winningNumber = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('updateStats', numberStats);

  socket.on('selectNumber', (number) => {
    if (userSelections[socket.id]) {
      const prev = userSelections[socket.id];
      numberStats[prev]--;
      if (numberStats[prev] <= 0) delete numberStats[prev];
    }
    userSelections[socket.id] = number;
    numberStats[number] = (numberStats[number] || 0) + 1;
    socket.emit('yourNumber', number);
    io.emit('updateStats', numberStats);
  });

  socket.on('announceWinner', (number) => {
    winningNumber = number;
    io.emit('winnerAnnounced', winningNumber);
  });

  socket.on('disconnect', () => {
    const number = userSelections[socket.id];
    if (numberStats[number]) {
      numberStats[number]--;
      if (numberStats[number] <= 0) delete numberStats[number];
    }
    delete userSelections[socket.id];
    io.emit('updateStats', numberStats);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
