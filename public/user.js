const socket = io();

const grid = document.getElementById('number-grid');
const popup = document.getElementById('winner-popup');
const overlay = document.getElementById('overlay');
const choice = document.getElementById('your-choice');
const countdown = document.getElementById('countdown');
let selectedNumber = null;

// Countdown Timer
let timeLeft = 10;
const interval = setInterval(() => {
  if (timeLeft > 0) {
    countdown.textContent = `⏳ Time left to choose: ${timeLeft}s`;
    timeLeft--;
  } else {
    countdown.textContent = '⏰ Time is up!';
    clearInterval(interval);
  }
}, 1000);

for (let i = 1; i <= 10; i++) {
  const btn = document.createElement('button');
  btn.textContent = i;
  btn.className = 'number-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800';
  btn.onclick = () => {
    if (selectedNumber !== null) return;
    selectedNumber = i;
    socket.emit('selectNumber', i);
    highlightSelected(i);
  };
  grid.appendChild(btn);
}

function highlightSelected(number) {
  const buttons = document.querySelectorAll('.number-btn');
  buttons.forEach((btn) => {
    if (parseInt(btn.textContent) === number) {
      btn.classList.remove('bg-blue-600');
      btn.classList.add('bg-yellow-500', 'text-black');
    } else {
      btn.disabled = true;
      btn.classList.add('opacity-50');
    }
  });
}

socket.on('yourNumber', (num) => {
  choice.textContent = `You selected: ${num}`;
});

socket.on('winnerAnnounced', (winner) => {
  popup.textContent = `🎉 Winning Number is ${winner}!`;
  popup.classList.remove('hidden');
  overlay.classList.remove('hidden');
  setTimeout(() => {
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
  }, 5000);
});
