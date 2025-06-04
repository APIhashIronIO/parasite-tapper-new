const tg = window.Telegram.WebApp;
tg.expand(); // делает WebApp во весь экран

let virusCount = parseInt(localStorage.getItem('virusCount')) || 0;
let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {};
let upgradeCosts = JSON.parse(localStorage.getItem('upgradeCosts')) || {};
let unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || {};

const counter = document.getElementById('virus-count');
const infectButton = document.getElementById('infect-button');
const mutations = document.querySelectorAll('.mutation');

// Базовые цены по умолчанию
const basePrices = {
  speed: 100,
  shield: 500,
  stealth: 1500,
  autoclick: 200,
};

// Обновление интерфейса
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

// Обновление отображения уровней
function updateLevelsUI() {
  const levelElements = document.querySelectorAll('.level');
  levelElements.forEach(el => {
    const id = el.dataset.id;
    el.textContent = `x${upgrades[id] || 0}`;
  });
}

// Воспроизведение звука
function playSound() {
  const audio = new Audio('assets/click.mp3');
  audio.play();
}

// Клик по кнопке INFECT
infectButton.addEventListener('click', () => {
  const bonus = upgrades.speed || 0;
  virusCount += 1 + bonus;
  updateUI();
  playSound();
});

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

    if (!cost) {
      cost = basePrices[id];
      upgradeCosts[id] = cost;
    }

    if (virusCount >= cost) {
      virusCount -= cost;
      upgrades[id] = level + 1;
      upgradeCosts[id] = Math.floor(cost * 1.2);
      updateUI();
      showToast(`${mutation.querySelector('strong').childNodes[0].textContent.trim()} upgraded to x${level + 1}!`, 'success');
    } else {
      showToast('Not enough viruses!', 'error');
    }
  });
});

// Автокликер
setInterval(() => {
  const auto = upgrades.autoclick || 0;
  if (auto > 0) {
    virusCount += auto;
    updateUI();
  }
}, 1000);

// === 🎖 A C H I E V E M E N T S ===

// Кнопка открытия
document.getElementById('achievements-button').addEventListener('click', () => {
  document.getElementById('achievements-panel').classList.toggle('hidden');
});

// Закрыть
function closeAchievements() {
  document.getElementById('achievements-panel').classList.add('hidden');
}

// Разблокировка достижения
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

// Проверка условий
function updateAchievementProgress() {
  if ((upgrades.autoclick || 0) >= 10) {
    unlockAchievement('ach-auto-click', 'Auto Clicker x10!');
  }
}

// Восстановление разблокированных достижений при запуске
function restoreAchievements() {
  Object.keys(unlockedAchievements).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('locked');
      el.classList.add('unlocked');
    }
  });
}

// Toast — уведомления
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

// === Пуск ===
restoreAchievements();
updateUI();
