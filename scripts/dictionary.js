
function buildLevelList() {
  const wrap = document.getElementById('levelList');
  wrap.innerHTML = '';
  LEVELS.forEach(lvl => {
    const row = document.createElement('div');
    row.className = 'level-row' + (lvl.id === selectedLevel ? ' active' : '');
    row.style.setProperty('--lvl-color', lvl.color);
    row.innerHTML = `<div class="dot"></div><div class="name">${lvl.label}</div>`;
    row.onclick = () => { burstAt(row); selectedLevel = lvl.id; buildLevelList(); syncLevelColor(); };
    wrap.appendChild(row);
  });
}

// the chosen level's color becomes the wizard's accent for every
// remaining screen — title, toggles, progress dots, Next/Play buttons
function syncLevelColor() {
  const lvl = LEVELS.find(l => l.id === selectedLevel);
  document.documentElement.style.setProperty('--wiz-color', lvl.color);
  document.querySelectorAll('.screen').forEach(s => { if (s.id !== 'screenMenu') s.style.setProperty('--wiz-color', lvl.color); });
}
buildLevelList();
syncLevelColor();

// ═══ dictionary loading & parsing ═══
// Format: "## Category name" starts a category, plain lines are words,
// "word | hint" attaches an optional hint, "//" lines are comments.
function slugifyCat(label, i) {
  const base = label.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-').replace(/^-+|-+$/g, '');
  return (base || 'cat') + '-' + i;
}
function parseDictionary(text) {
  const lines = text.split(/\r?\n/);
  const categories = []; const words = {};
  let currentId = null;
  lines.forEach(raw => {
    const line = raw.trim();
    if (!line || line.startsWith('//')) return;
    if (line.startsWith('## ')) {
      const label = line.slice(3).trim();
      const id = slugifyCat(label, categories.length);
      categories.push({ id, label }); words[id] = []; currentId = id;
      return;
    }
    if (!currentId) return;
    const parts = line.split('|');
    const word = parts[0].trim();
    if (!word) return;
    const hint = parts[1] ? parts[1].trim() : undefined;
    words[currentId].push(hint ? { word, hint } : { word });
  });
  return { categories, words };
}

function applyLoadedDictionary(parsed) {
  CATEGORIES = parsed.categories;
  WORDS = parsed.words;
  selectedTopics = CATEGORIES.map(c => c.id);
  buildTopicPills();
  const hint = document.getElementById('topicsHint');
  hint.textContent = CATEGORIES.length === 0
    ? 'This dictionary is currently empty — add categories and words to its .txt file to play this level.'
    : '';
}
