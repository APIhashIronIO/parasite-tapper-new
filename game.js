let virusCount = parseInt(localStorage.getItem('virusCount')) || 0;
let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {};

const counter = document.getElementById('virus-count');
const infectButton = document.getElementById('infect-button');
const mutations = document.querySelectorAll('.mutation');

function updateUI() {
  counter.textContent = virusCount;
  localStorage.setItem('virusCount', virusCount);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function playSound() {
  const audio = new Audio('assets/click.mp3');
  audio.play();
}

infectButton.addEventListener('click', () => {
  virusCount += 1 + (upgrades.speed || 0);
  updateUI();
  playSound();
});

mutations.forEach(mutation => {
  mutation.addEventListener('click', () => {
    const cost = parseInt(mutation.dataset.cost);
    const id = mutation.dataset.id;

    if (virusCount >= cost) {
      virusCount -= cost;
      upgrades[id] = (upgrades[id] || 0) + 1;
      updateUI();
      alert(`${id} upgraded!`);
    } else {
      alert('Not enough viruses!');
    }
  });
});

updateUI();
