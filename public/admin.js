const socket = io();
const statsDiv = document.getElementById('stats');
const winnerInput = document.getElementById('winnerInput');
const announceBtn = document.getElementById('announceBtn');

announceBtn.onclick = () => {
  const number = parseInt(winnerInput.value);
  if (number >= 1 && number <= 10) {
    socket.emit('announceWinner', number);
  }
};

socket.on('updateStats', (stats) => {
  statsDiv.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const count = stats[i] || 0;
    const div = document.createElement('div');
    div.textContent = `Number ${i}: ${count} selections`;
    div.className = 'mb-1';
    statsDiv.appendChild(div);
  }
});
