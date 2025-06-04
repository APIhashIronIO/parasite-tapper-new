const container = document.getElementById('floating-virus-container');

const virusVariants = [
  'assets/virus1.png',
  'assets/virus2.png',
  'assets/virus3.png',
  'assets/virus4.png',
  'assets/virus5.png'
];

function spawnVirus() {
  const virus = document.createElement('div');
  virus.className = 'floating-virus';

  // Случайный спрайт вируса
  const src = virusVariants[Math.floor(Math.random() * virusVariants.length)];
  virus.style.backgroundImage = `url(${src})`;

  const size = Math.random() * 50 + 40; // раньше было 20–50, теперь 40–90 пикс


  virus.style.width = `${size}px`;
  virus.style.height = `${size}px`;

  virus.style.left = `${Math.random() * 100}%`;
  virus.style.bottom = '-50px';
  virus.style.animationDuration = `${10 + Math.random() * 10}s`;

  container.appendChild(virus);

  setTimeout(() => {
    virus.remove();
  }, 15000);
}

setInterval(spawnVirus, 700); // быстрее, плотнее фон
