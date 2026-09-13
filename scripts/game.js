
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function buildWordPool() {
  wordPool = [];
  selectedTopics.forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    (WORDS[catId] || []).forEach(w => wordPool.push({ ...w, cat: cat ? cat.label : '' }));
  });
  shuffleArray(wordPool);
}

function getNextWord() {
  const available = wordPool.filter(w => !usedWords.has(w.word));
  if (available.length === 0) {
    // everyone's been through the pool at least once — reset, but keep
    // this turn's own words out of rotation so we don't repeat instantly
    usedWords = new Set(turnWords.map(w => w.word));
    const fresh = wordPool.filter(w => !usedWords.has(w.word));
    return fresh[0] || wordPool[0];
  }
  return available[0];
}

// called from the Teams screen's Play button
function startGame() {
  scores = teams.map(() => 0);
  currentTeamIdx = 0;
  currentRound = 1;
  usedWords = new Set();
  buildWordPool();
  goToTurnScreen();
}

function goToTurnScreen() {
  const team = teams[currentTeamIdx];
  document.getElementById('turnRoundLabel').textContent = `Round ${currentRound} of ${roundsVal}`;
  document.getElementById('turnTeamName').textContent = team.name;
  showScreen('screenTurn');
}

function beginTurn() {
  turnWords = [];
  gameTimeLeft = timerVal;
  timeIsUp = false;
  loadNextWord();
  updateTimerUI();
  if (gameTimerInterval) clearInterval(gameTimerInterval);
  gameTimerInterval = setInterval(() => {
    if (isPaused) return;
    gameTimeLeft--;
    updateTimerUI();
    if (gameTimeLeft <= 0) {
      clearInterval(gameTimerInterval);
      timeIsUp = true;
    }
  }, 1000);
}

function loadNextWord() {
  if (wordPool.length === 0) {
    document.getElementById('wordCat').textContent = '';
    document.getElementById('wordMain').textContent = 'No words in this category yet';
    currentWordObj = null;
    return;
  }
  currentWordObj = getNextWord();
  usedWords.add(currentWordObj.word);
  document.getElementById('wordCat').textContent = formatTopicLabel(currentWordObj.cat);
  document.getElementById('wordMain').textContent = currentWordObj.word;
}

// pixel-style digital countdown, MM:SS, always the Got-it-style pill —
// no more measuring/animating an SVG outline
function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}
function updateTimerUI() {
  document.getElementById('gameTimer').textContent = formatTime(gameTimeLeft);
}

function pressBtn(id) {
  const btn = document.getElementById(id);
  btn.classList.add('press');
  setTimeout(() => btn.classList.remove('press'), 150);
}

function handleGot() {
  if (!currentWordObj) return;
  playCoinSound();
  pressBtn('btnGot');
  turnWords.push({ word: currentWordObj.word, cat: currentWordObj.cat, result: 'correct' });
  if (timeIsUp) { goToResults(); } else { loadNextWord(); }
}

function handleSkip() {
  if (!currentWordObj) return;
  pressBtn('btnSkip');
  if (penaltyOn) {
    playHitSound();
  } else {
    playNeutralTick();
  }
  turnWords.push({ word: currentWordObj.word, cat: currentWordObj.cat, result: 'skip' });
  if (timeIsUp) { goToResults(); } else { loadNextWord(); }
}
