
// ═══ RESULTS SCREEN (per turn) ═══
function goToResults() {
  const team = teams[currentTeamIdx];
  document.getElementById('resultsTeamName').textContent = team.name;

  let delta = 0;
  turnWords.forEach(w => {
    if (w.result === 'correct') delta += 1;
    if (w.result === 'skip' && penaltyOn) delta -= 1;
  });
  scores[currentTeamIdx] = (scores[currentTeamIdx] || 0) + delta;

  renderRoundSummary();
  renderResultsList();

  const isLast = (currentRound === roundsVal && currentTeamIdx === teams.length - 1);
  document.getElementById('resultsNextBtn').textContent = isLast ? 'See Final Scores' : 'Next Team';

  showScreen('screenResults');
}

function renderRoundSummary() {
  const correct = turnWords.filter(w => w.result === 'correct').length;
  const skipped = turnWords.filter(w => w.result === 'skip').length;
  const penalty = penaltyOn ? skipped : 0;
  const roundScore = correct - penalty;
  const el = document.getElementById('roundScoreSummary');
  el.innerHTML = `
    <div class="team-count-row" style="flex-wrap:wrap;gap:10px">
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <div><div class="mode-label">Correct</div><div style="font-family:'DM Serif Display',serif;font-size:26px;color:var(--wiz-color)">${correct}</div></div>
        <div><div class="mode-label">Skipped</div><div style="font-family:'DM Serif Display',serif;font-size:26px;color:var(--muted)">${skipped}</div></div>
        ${penaltyOn ? `<div><div class="mode-label">Penalty</div><div style="font-family:'DM Serif Display',serif;font-size:26px;color:#ff6b35">−${penalty}</div></div>` : ''}
      </div>
      <div>
        <div class="mode-label">Round score</div>
        <div style="font-family:'DM Serif Display',serif;font-size:32px">${roundScore > 0 ? '+' : ''}${roundScore}</div>
      </div>
    </div>`;
}

function renderResultsList() {
  const list = document.getElementById('resultsList');
  list.innerHTML = '';
  turnWords.forEach((w, i) => {
    const item = document.createElement('div');
    item.className = `result-item ${w.result}`;
    let badge = w.result === 'correct'
      ? `<span class="badge badge-correct">✓ correct</span>`
      : `<span class="badge badge-skip">✕ skip</span>${penaltyOn ? ' <span class="penalty-tag">−1</span>' : ''}`;
    item.innerHTML = `
      <div>
        <div class="result-word">${w.word}</div>
        <div class="result-word-cat">${w.cat}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px">${badge}</div>`;
    item.onclick = () => toggleResult(i);
    list.appendChild(item);
  });
}

function toggleResult(idx) {
  const w = turnWords[idx];
  if (w.result === 'correct') {
    scores[currentTeamIdx] -= 1;
    if (penaltyOn) scores[currentTeamIdx] -= 1;
    w.result = 'skip';
  } else {
    if (penaltyOn) scores[currentTeamIdx] += 1;
    scores[currentTeamIdx] += 1;
    w.result = 'correct';
  }
  renderRoundSummary();
  renderResultsList();
}

function handleResultsNext(btn) {
  ensureAudio();
  playConfirmBlip();
  btn.classList.remove('press'); void btn.offsetWidth; btn.classList.add('press');
  setTimeout(() => btn.classList.remove('press'), 150);
  setTimeout(nextTurn, 560);
}

function nextTurn() {
  const isLast = (currentRound === roundsVal && currentTeamIdx === teams.length - 1);
  if (isLast) { showEndScreen(); return; }
  currentTeamIdx++;
  if (currentTeamIdx >= teams.length) { currentTeamIdx = 0; currentRound++; }
  goToTurnScreen();
}
