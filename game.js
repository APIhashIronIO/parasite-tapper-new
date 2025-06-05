const tg = window.Telegram.WebApp;
tg.expand();

let virusCount = parseInt(localStorage.getItem('virusCount')) || 0;
const rankLevels = [
  { name: 'Новичок', image: 'assets/rank1.png', threshold: 0 },
  { name: 'Зараза', image: 'assets/rank2.png', threshold: 1000 },
  { name: 'Эпидемия', image: 'assets/rank3.png', threshold: 5000 },
  { name: 'Пандемия', image: 'assets/rank4.png', threshold: 10000 },
  { name: 'Мутант', image: 'assets/rank5.png', threshold: 25000 },
  { name: 'Угроза', image: 'assets/rank6.png', threshold: 50000 },
  { name: 'Чума', image: 'assets/rank7.png', threshold: 100000 },
  { name: 'Киберпаразит', image: 'assets/rank8.png', threshold: 200000 },
  { name: 'Глобальный Вирус', image: 'assets/rank9.png', threshold: 400000 }
];

let currentRankIndex = 0;
const savedRank = localStorage.getItem('savedRankIndex');
if (savedRank !== null) {
  currentRankIndex = parseInt(savedRank);
}

let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {};
let upgradeCosts = JSON.parse(localStorage.getItem('upgradeCosts')) || {};
let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || {};

const counter = document.getElementById('virus-count');
const infectButton = document.getElementById('infect-button');
const boss = document.getElementById('boss-virus');
const mutations = document.querySelectorAll('.mutation');

// === UI ===
function updateUI() {
  counter.textContent = virusCount.toLocaleString();
  localStorage.setItem('virusCount', virusCount);
  localStorage.setItem('upgrades', JSON.stringify(upgrades));
  localStorage.setItem('upgradeCosts', JSON.stringify(upgradeCosts));
  localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
  updateLevelsUI();
  updateAchievementProgress();
  updateRankIfNeeded();

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

function updateLevelsUI() {
  document.querySelectorAll('.level').forEach(el => {
    const id = el.dataset.id;
    el.textContent = `x${upgrades[id] || 0}`;
  });
}

function playSound() {
  const audio = new Audio('assets/click.mp3');
  audio.play();
}

function spawnMiniViruses() {
  const boss = document.getElementById('boss-virus');
  const rect = boss.getBoundingClientRect();
  const baseX = rect.left + rect.width / 2;
  const baseY = rect.top + rect.height / 2;

  const amount = Math.floor(Math.random() * 3 + 2);
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

    document.body.appendChild(virus);
    setTimeout(() => virus.remove(), 1200);
  }
}

function updateRankIfNeeded() {
  const saved = parseInt(localStorage.getItem('savedRankIndex')) || 0;

  for (let i = saved + 1; i < rankLevels.length; i++) {
    if (virusCount >= rankLevels[i].threshold) {
      currentRankIndex = i;
      localStorage.setItem('savedRankIndex', currentRankIndex);
      updateRankDisplay();
      showRankPopup();
      return;
    }
  }

  currentRankIndex = saved;
  updateRankDisplay();
}

function updateRankDisplay() {
  const rank = rankLevels[currentRankIndex];
  document.getElementById('rank-image').src = rank.image;
  document.getElementById('rank-name').textContent = rank.name;
}

function showRankPopup() {
  const rank = rankLevels[currentRankIndex];
  document.getElementById('rank-popup-img').src = rank.image;
  document.getElementById('rank-popup-name').textContent = 'Новый ранг: ' + rank.name;
  const popup = document.getElementById('rank-popup');
  popup.classList.remove('hidden');

  const okBtn = document.getElementById('rank-popup-ok');
  okBtn.onclick = () => {
    popup.classList.add('hidden');
  };
}

// === Клики ===
function infect() {
  const bonus = upgrades.speed || 0;
  virusCount += 1 + bonus;
  updateUI();
  playSound();
  spawnMiniViruses();
}

infectButton.addEventListener('click', infect);
boss.addEventListener('click', infect);

// === Прокачка ===
let clickTimestamps = [];
const basePrices = {
  speed: 100,
  shield: 500,
  stealth: 1500,
  autoclick: 200,
};

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
    let cost = upgradeCosts[id] || basePrices[id];

    if (level >= 50) return showToast('Max level reached!', 'error');
    if (virusCount < cost) return showToast('Not enough viruses!', 'error');

    virusCount -= cost;
    upgrades[id] = level + 1;
    upgradeCosts[id] = Math.floor(cost * 1.2);
    triggerInfectionEffect();
    updateUI();
    showToast(`${mutation.querySelector('strong').childNodes[0].textContent.trim()} upgraded to x${level + 1}!`, 'success');
  });
});

// === Автокликер ===
setInterval(() => {
  const auto = upgrades.autoclick || 0;
  if (auto > 0) {
    virusCount += auto;
    updateUI();
  }
}, 1000);

// === Достижения ===
function unlockAchievement(id, message) {
  const el = document.getElementById(id);
  if (el && !unlockedAchievements[id]) {
    el.classList.remove('locked');
    el.classList.add('unlocked');
    unlockedAchievements[id] = true;
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

// === Эффект заражения ===
function triggerInfectionEffect() {
  const layer = document.getElementById('infection-layer');
  layer.className = 'infection-effect';
  setTimeout(() => {
    layer.className = '';
  }, 2000);
}

// === Toast ===
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

// === INIT ===
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.tap-virus')?.classList.add('mutating');
    document.querySelector('.infect-border').style.display = 'block';
  }, 2000);
  restoreAchievements();
  updateUI();
});
