document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('nickname');
  const saveBtn = document.getElementById('save-nickname');
  const totalClicks = document.getElementById('total-clicks');
  const totalEarned = document.getElementById('total-earned');

  // Никнейм
  nameInput.value = localStorage.getItem('nickname') || '';
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('nickname', nameInput.value.trim());
    alert('Nickname saved!');
  });

  // Статистика
  totalClicks.textContent = localStorage.getItem('totalClicks') || 0;
  totalEarned.textContent = localStorage.getItem('totalEarned') || 0;
});
