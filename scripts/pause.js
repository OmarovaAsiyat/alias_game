
// ═══ PAUSE MENU — theme + sound now live here instead of the onboarding
// corner toggle, plus a Quit that needs a second tap to confirm ═══
function openPause() {
  isPaused = true;
  resetQuitArm();
  document.getElementById('pauseOverlay').classList.add('show');
}
function closePause() {
  isPaused = false;
  resetQuitArm();
  document.getElementById('pauseOverlay').classList.remove('show');
}

let quitArmed = false;
let quitArmTimeout = null;
function resetQuitArm() {
  quitArmed = false;
  if (quitArmTimeout) clearTimeout(quitArmTimeout);
  const btn = document.getElementById('quitBtn');
  if (btn) btn.textContent = 'Quit';
}
function handleQuit() {
  const btn = document.getElementById('quitBtn');
  if (!quitArmed) {
    quitArmed = true;
    btn.textContent = 'Tap again to quit';
    quitArmTimeout = setTimeout(() => { quitArmed = false; btn.textContent = 'Quit'; }, 2500);
    return;
  }
  clearTimeout(quitArmTimeout);
  quitArmed = false;
  btn.textContent = 'Quit';
  if (gameTimerInterval) clearInterval(gameTimerInterval);
  isPaused = false;
  document.getElementById('pauseOverlay').classList.remove('show');
  showScreen('screenMenu');
}
