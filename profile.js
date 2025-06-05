document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copy-ref');
  const refDisplay = document.getElementById('ref-link');
  const refCount = document.getElementById('ref-count');

  const myCode = localStorage.getItem('myRefCode');
  refDisplay.textContent = `https://apihashironio.github.io/parasite-tapper-new/?ref=${myCode}`;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(refDisplay.textContent);
    alert('Referral link copied!');
  });

  // счётчик — пока просто считываем
  const count = parseInt(localStorage.getItem('refCount')) || 0;
  refCount.textContent = count;
});
