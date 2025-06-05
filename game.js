const tg = window.Telegram.WebApp;
tg.expand(); // на весь экран

let virusCount = parseInt(localStorage.getItem('virusCount')) || 0;
const rankLevels = [
  { name: 'Новичок', image: 'assets/rank1.png', threshold: 0 },
  { name: 'Зараза', image: 'assets/rank2.png', threshold: 10000 },
  { name: 'Эпидемия', image: 'assets/rank3.png', threshold: 30000 },
  { name: 'Пандемия', image: 'assets/rank4.png', threshold: 80000 },
  { name: 'Мутант', image: 'assets/rank5.png', threshold: 200000 },
  { name: 'Угроза', image: 'assets/rank6.png', threshold: 500000 },
  { name: 'Чума', image: 'assets/rank7.png', threshold: 1000000 },
  { name: 'Киберпаразит', image: 'assets/rank8.png', threshold: 2000000 },
  { name: 'Глобальный Вирус', image: 'assets/rank9.png', threshold: 5000000 }
];

let currentRankIndex = 0;


function updateRankDisplay() {
  const currentRank = ranks.slice().reverse().find(r => virusCount >= r.threshold);
  if (currentRank) {
    document.getElementById('rank-icon').src = currentRank.image;
    document.getElementById('rank-name').textContent = currentRank.name;
  }
}

let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {};
let upgradeCosts = JSON.parse(localStorage.getItem('upgradeCosts')) || {};
let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || {};

const counter = document.getElementById('virus-count');
const infectButton = document.getElementById('infect-button');
const mutations = document.querySelectorAll('.mutation');

// === Базовые цены ===
const basePrices = {
  speed: 100,
  shield: 500,
  stealth: 1500,
  autoclick: 200,
};

// === Обновление UI ===
function updateUI() {
  counter.textContent = virusCount;
  localStorage.setItem('virusCount', virusCount);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
  localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
  localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  updateLevelsUI();
  updateAchievementProgress();

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

// === Уровни прокачки ===
function updateLevelsUI() {
  const levelElements = document.querySelectorAll('.level');
  levelElements.forEach(el => {
    const id = el.dataset.id;
    el.textContent = `x${upgrades[id] || 0}`;
  });
}

// === Звук клика ===
function playSound() {
  const audio = new Audio('assets/click.mp3');
  audio.play();
}

// === Размножение вирусов (анимация) ===
function spawnMiniViruses() {
  const parent = document.querySelector('.virus-area');
  const baseX = parent.offsetWidth / 2;
  const baseY = parent.offsetHeight / 2;

  const amount = Math.floor(Math.random() * 3 + 1);

  for (let i = 0; i < amount; i++) {
    const virus = document.createElement('div');
    virus.classList.add('spawned-virus');

    const variants = [
      'assets/virus1.png',
      'assets/virus2.png',
      'assets/virus3.png',
      'assets/virus4.png',
      'assets/virus5.png'
    ];
    virus.style.backgroundImage = `url(${variants[Math.floor(Math.random() * variants.length)]})`;

    virus.style.left = `${baseX}px`;
    virus.style.top = `${baseY}px`;

    virus.style.setProperty('--x', Math.random().toFixed(2));
    virus.style.setProperty('--y', Math.random().toFixed(2));

    parent.appendChild(virus);
    setTimeout(() => virus.remove(), 1200);
  }
}

// === Клик по кнопке INFECT ===
infectButton.addEventListener('click', () => {
  const bonus = upgrades.speed || 0;
  virusCount += 1 + bonus;
  updateUI();
  updateVirusCountDisplay();
  playSound();
  spawnMiniViruses();
});

// === Анти-спам и апгрейды ===
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

    if (!cost) {
      cost = basePrices[id];
      upgradeCosts[id] = cost;
    }

    if (virusCount >= cost) {
      virusCount -= cost;
      upgrades[id] = level + 1;
      upgradeCosts[id] = Math.floor(cost * 1.2);
      updateUI();
      triggerInfectionEffect();
      showToast(`${mutation.querySelector('strong').childNodes[0].textContent.trim()} upgraded to x${level + 1}!`, 'success');
    } else {
      showToast('Not enough viruses!', 'error');
    }
  });
});

// === Автокликер ===
setInterval(() => {
  const auto = upgrades.autoclick || 0;
  if (auto > 0) {
    virusCount += auto;
    updateUI();
    updateVirusCountDisplay();
  }
}, 1000);

// === Достижения ===
function unlockAchievement(id, message) {
  const el = document.getElementById(id);
  if (el && !unlockedAchievements[id]) {
    el.classList.remove('locked');
    el.classList.add('unlocked');
    unlockedAchievements[id] = true;
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    showToast(`🏆 Achievement Unlocked: ${message}`, 'success');
  }
}

function updateAchievementProgress() {
  if ((upgrades.autoclick || 0) >= 10) {
    unlockAchievement('ach-auto-click', 'Auto Clicker x10!');
  }
}

function restoreAchievements() {
  Object.keys(unlockedAchievements).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('locked');
      el.classList.add('unlocked');
    }
  });
}

// === Toast уведомления ===
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

// === Визуальный эффект при мутации ===
function triggerInfectionEffect() {
  const layer = document.getElementById('infection-layer');
  layer.className = 'infection-effect';
  setTimeout(() => {
    layer.className = '';
  }, 2000);
}

// === Старт ===
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const virus = document.querySelector('.tap-virus');
    virus.classList.add('mutating');
    const border = document.querySelector('.infect-border');
    border.style.display = 'block';
  }, 2000);
  restoreAchievements();
  updateUI();
  updateRankDisplay();
});

function updateVirusCountDisplay() {
  virusCountDisplay.textContent = virusCount.toLocaleString();

  // Обновление ранга
  let newRankIndex = currentRankIndex;
  for (let i = rankLevels.length - 1; i >= 0; i--) {
    if (virusCount >= rankLevels[i].threshold) {
      newRankIndex = i;
      break;
    }
  }

  if (newRankIndex !== currentRankIndex) {
    currentRankIndex = newRankIndex;
    updateRankDisplay();
    showRankPopup();
  }
}

function updateRankDisplay() {
  const rank = rankLevels[currentRankIndex];
  document.getElementById('rank-image').src = rank.image;
  document.getElementById('rank-name').textContent = rank.name;
}

function showRankPopup() {
  const rank = rankLevels[currentRankIndex];
  const popup = document.getElementById('rank-popup');
  document.getElementById('rank-popup-img').src = rank.image;
  document.getElementById('rank-popup-name').textContent = 'Новый ранг: ' + rank.name;
  popup.classList.remove('hidden');

  setTimeout(() => {
    popup.classList.add('hidden');
  }, 3000);
}

