
// ═══ screen nav ═══
// Every transition waits for the burst animation (≈550ms) to fully play
// before the screen changes, so the "тык" effect is never cut off or
// covered by the button/next screen.
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.body.classList.toggle('in-game', id === 'screenGame');
  window.scrollTo(0, 0);
}

function handleStart() {
  ensureAudio();
  playStartJingle();
  const btn = document.getElementById('ctaBtn');
  btn.classList.remove('press'); void btn.offsetWidth; btn.classList.add('press');
  setTimeout(() => btn.classList.remove('press'), 400);
  burst(document.getElementById('raysMenu'));
  setTimeout(() => showScreen('screenLevel'), 560);
}

function handleNext(targetId, btnEl, raysId) {
  ensureAudio();
  playConfirmBlip();
  btnEl.classList.remove('press'); void btnEl.offsetWidth; btnEl.classList.add('press');
  setTimeout(() => btnEl.classList.remove('press'), 150);
  setTimeout(() => showScreen(targetId), 560);
}

function handlePlay() {
  ensureAudio();
  playConfirmBlip();
  const btn = document.getElementById('btnPlay');
  btn.classList.remove('press'); void btn.offsetWidth; btn.classList.add('press');
  setTimeout(() => btn.classList.remove('press'), 150);
  setTimeout(startGame, 560);
}

// called when the person taps "Next" on the level screen — fetches (or
// reuses a cached copy of) the selected level's dictionary before moving on
function handleLevelNext() {
  const btn = document.getElementById('btnLevelNext');
  const loadingRow = document.getElementById('levelLoadingRow');
  const errorNote = document.getElementById('levelErrorNote');
  errorNote.style.display = 'none';

  if (dictionariesLoaded[selectedLevel]) {
    applyLoadedDictionary(dictionariesLoaded[selectedLevel]);
    handleNext('screenTopics', btn, 'raysLevel');
    return;
  }

  loadingRow.style.display = 'flex';
  btn.disabled = true;
  const lvl = LEVELS.find(l => l.id === selectedLevel);
  fetch(lvl.file, { cache: 'no-store' })
    .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
    .then(text => {
      const parsed = parseDictionary(text);
      dictionariesLoaded[selectedLevel] = parsed;
      loadingRow.style.display = 'none';
      btn.disabled = false;
      applyLoadedDictionary(parsed);
      handleNext('screenTopics', btn, 'raysLevel');
    })
    .catch(err => {
      loadingRow.style.display = 'none';
      btn.disabled = false;
      errorNote.style.display = 'block';
      errorNote.textContent = `Couldn't load the dictionary (${lvl.file}): ${err.message}. If you opened this file directly from disk, try a local server or GitHub Pages instead.`;
    });
}

function handleTopicsNext(btn) {
  if (selectedTopics.length === 0) return;
  handleNext('screenSettings', btn, 'raysTopics');
}

function buildTopicPills() {
  const wrap = document.getElementById('topicPills');
  wrap.innerHTML = '';
  CATEGORIES.forEach(topic => {
    const btn = document.createElement('button');
    btn.className = 'pill' + (selectedTopics.includes(topic.id) ? ' active' : '');
    btn.textContent = formatTopicLabel(topic.label);
    btn.onclick = () => {
      burstAt(btn);
      if (selectedTopics.includes(topic.id)) {
        if (selectedTopics.length > 1) selectedTopics = selectedTopics.filter(id => id !== topic.id);
      } else {
        selectedTopics.push(topic.id);
      }
      buildTopicPills();
    };
    wrap.appendChild(btn);
  });
}
function selectAllTopics() {
  if (CATEGORIES.length === 0) return;
  selectedTopics = CATEGORIES.map(t => t.id);
  buildTopicPills();
}
function clearAllTopics() {
  selectedTopics = [];
  buildTopicPills();
}

// "Words From Other Languages — File 6B"  ->  "6B | Words From Other Languages"
// (categories without a "File X" suffix are shown unchanged)
function formatTopicLabel(label) {
  const m = label.match(/^(.*?)\s*—\s*File\s+(\d+[A-Za-z]?)\s*$/i);
  return m ? `${m[2]} | ${m[1].trim()}` : label;
}
buildTopicPills();
function adjTimer(d) { timerVal = Math.min(180, Math.max(20, timerVal + d)); document.getElementById('timerVal').textContent = formatTime(timerVal); }
function adjRounds(d) { roundsVal = Math.min(10, Math.max(1, roundsVal + d)); document.getElementById('roundsVal').textContent = roundsVal; }
function buildTeamsList() {
  const list = document.getElementById('teamsList');
  list.innerHTML = '';
  teams.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'team-row';
    row.innerHTML = `<div class="team-dot"></div>`;
    row.querySelector('.team-dot').style.background = LEVEL_COLORS[i % LEVEL_COLORS.length];
    const input = document.createElement('input');
    input.className = 'team-input';
    input.value = t.name;
    input.oninput = () => { teams[i].name = input.value; };
    row.appendChild(input);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'team-remove-btn';
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.disabled = teams.length <= 2;
    removeBtn.onclick = () => { burstAt(removeBtn); removeTeamAt(i); };
    row.appendChild(removeBtn);
    list.appendChild(row);
  });
  document.getElementById('btnAddTeam').disabled = teams.length >= 6;
}
function nextTeamLetter() {
  const used = new Set(
    teams.map(t => (t.name.match(/^Team ([A-Z])$/) || [])[1]).filter(Boolean)
  );
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    if (!used.has(letter)) return letter;
  }
  return String.fromCharCode(65 + teams.length);
}
function addTeam() {
  if (teams.length < 6) { teams.push({ name: `Team ${nextTeamLetter()}` }); buildTeamsList(); }
}
function removeTeamAt(i) {
  if (teams.length <= 2) return;
  teams.splice(i, 1);
  buildTeamsList();
}
buildTeamsList();
