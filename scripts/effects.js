
function buildRays(container) {
  const RAY_COUNT = 10;
  for (let i = 0; i < RAY_COUNT; i++) {
    const ray = document.createElement('div');
    ray.className = 'ray';
    const angle = (360 / RAY_COUNT) * i;
    ray.style.setProperty('--ang', angle + 'deg');
    ray.style.setProperty('--ray-color', LEVEL_COLORS[i % LEVEL_COLORS.length]);
    container.appendChild(ray);
  }
}
['raysMenu','raysLevel','raysSettings','raysTeams','raysEnd'].forEach(id => buildRays(document.getElementById(id)));

function burst(el) { el.classList.remove('burst'); void el.offsetWidth; el.classList.add('burst'); }

// generic "тык" burst for any button — builds a one-off rays wrapper
// positioned right over whatever was clicked, so every button gets the
// same tactile feedback without needing a hand-placed <div class="rays">
function burstAt(el) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const wrap = document.createElement('div');
  wrap.className = 'rays';
  wrap.style.position = 'fixed';
  wrap.style.left = (rect.left + rect.width / 2) + 'px';
  wrap.style.top = (rect.top + rect.height / 2) + 'px';
  wrap.style.right = 'auto';
  wrap.style.bottom = 'auto';
  wrap.style.width = '0px';
  wrap.style.height = '0px';
  wrap.style.zIndex = '2000';
  buildRays(wrap);
  document.body.appendChild(wrap);
  wrap.classList.add('burst');
  setTimeout(() => wrap.remove(), 650);
}
