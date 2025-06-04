let virusCount = parseInt(localStorage.getItem('virusCount')) || 0;
let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {};
let upgradeCosts = JSON.parse(localStorage.getItem('upgradeCosts')) || {};

const counter = document.getElementById('virus-count');
const infectButton = document.getElementById('infect-button');
const mutations = document.querySelectorAll('.mutation');

// Базовые цены по умолчанию (если upgradeCosts нет)
const basePrices = {
  speed: 100,
  shield: 500,
  stealth: 1500,
  autoclick: 200,
};

// Обновление UI и сохранение
function updateUI() {
  counter.textContent = virusCount;
  localStorage.setItem('virusCount', virusCount);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
  localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
  updateLevelsUI();

  mutations.forEach(mutation => {
    const id = mutation.dataset.id;
    const cost = upgradeCosts[id] || basePrices[id];
    const level = upgrades[id] || 0;

    const costElement = mutation.querySelector('p');
    if (level >= 50) {
      costElement.textContent = 'MAX LEVEL';
      mutation.classList.add('disabled');
    } else {
      costElement.textContent = `COST: ${cost}`;
      mutation.classList.remove('disabled');
    }
  });
}

// Показ уровней (x3, x7...)
function updateLevelsUI() {
  const levelElements = document.querySelectorAll('.level');
  levelElements.forEach(el => {
    const id = el.dataset.id;
    el.textContent = `x${upgrades[id] || 0}`;
  });
}

// Кнопка INFECT
infectButton.addEventListener('click', () => {
  const bonus = upgrades.speed || 0;
  virusCount += 1 + bonus;
  updateUI();
  playSound();
});

// Звук
function playSound() {
  const audio = new Audio('assets/click.mp3');
  audio.play();
}

// Спам-защита
let clickTimestamps = [];

mutations.forEach(mutation => {
  mutation.addEventListener('click', () => {
    const now = Date.now();
    clickTimestamps = clickTimestamps.filter(t => now - t < 3000);
    clickTimestamps.push(now);

    if (clickTimestamps.length > 5) {
      showToast('🕒 Not spam! Wait 3 seconds.', 'error');
      return;
    }

    const id = mutation.dataset.id;
    const level = upgrades[id] || 0;
    let cost = upgradeCosts[id];

    if (level >= 50) {
      showToast('Max level reached!', 'error');
      return;
    }

    // если цены ещё нет — установи базовую
    if (!cost) {
      cost = basePrices[id];
      upgradeCosts[id] = cost;
    }

    if (virusCount >= cost) {
      virusCount -= cost;
      upgrades[id] = level + 1;

      // увеличиваем цену только этого улучшения
      upgradeCosts[id] = Math.floor(cost * 1.2);

      updateUI();
      showToast(`${mutation.querySelector('strong').childNodes[0].textContent.trim()} upgraded to x${level + 1}!`, 'success');
    } else {
      showToast('Not enough viruses!', 'error');
    }
  });
});

// Автокликер — +N вирусов/сек
setInterval(() => {
  const auto = upgrades.autoclick || 0;
  if (auto > 0) {
    virusCount += auto;
    updateUI();
  }
}, 1000);

// Всплывающее сообщение
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Старт
updateUI();
