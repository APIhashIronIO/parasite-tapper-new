window.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabs = document.querySelectorAll('.tab');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.tab;

      tabs.forEach(tab => {
        const isActive = tab.id === `tab-${target}`;
        tab.classList.toggle('active', isActive);
        tab.classList.toggle('hidden', !isActive);
      });

      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Включаем первую вкладку по умолчанию
  const first = navButtons[0];
  if (first) first.click();
});
