const container = document.getElementById('floating-virus-container');

function spawnVirus() {
  const virus = document.createElement('div');
  virus.className = 'floating-virus';

  const size = Math.random() * 30 + 20;
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

// Периодическое появление
setInterval(spawnVirus, 800);
