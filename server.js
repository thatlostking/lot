const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store the number selections from users
const userSelections = {};
const numberStats = {};

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Listen for new connections
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Handle number selection from a client
  socket.on('selectNumber', (number) => {
    console.log(`Received number selection from user: ${number}`);

    // Update number selection stats
    if (userSelections[socket.id]) {
      const prev = userSelections[socket.id];
      numberStats[prev]--;
      if (numberStats[prev] <= 0) delete numberStats[prev];
    }
    
    // Store the selected number for the user
    userSelections[socket.id] = number;

    // Update stats for the selected number
    numberStats[number] = (numberStats[number] || 0) + 1;

    // Emit selected number back to the client
    socket.emit('yourNumber', number);

    // Emit updated stats to all clients
    io.emit('updateStats', numberStats);
  });

  // Listen for the winner and broadcast it to all clients
  socket.on('announceWinner', () => {
    const winningNumber = Math.floor(Math.random() * 10) + 1;  // Example winner logic
    io.emit('winnerAnnounced', winningNumber);  // Announce the winner to all clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up user selection if needed
    if (userSelections[socket.id]) {
      const number = userSelections[socket.id];
      numberStats[number]--;
      if (numberStats[number] <= 0) delete numberStats[number];
      delete userSelections[socket.id];
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
