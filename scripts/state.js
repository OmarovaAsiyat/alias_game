const LEVEL_COLORS = ['var(--lvl-elementary)','var(--lvl-preint)','var(--lvl-intermediate)','var(--lvl-intplus)','var(--lvl-upperint)'];

// ═══ LEVELS ═══
// Each level's word list lives in its own .txt file under dictionaries/ —
// see README.md for the file format. Add a new level by adding a row here
// and dropping a matching .txt file next to this page.
const LEVELS = [
  { id: 'elementary',        label: 'Elementary',         color: 'var(--lvl-elementary)',  file: 'dictionaries/elementary.txt' },
  { id: 'preint',            label: 'Pre-Intermediate',   color: 'var(--lvl-preint)',       file: 'dictionaries/pre-intermediate.txt' },
  { id: 'intermediate',      label: 'Intermediate',       color: 'var(--lvl-intermediate)', file: 'dictionaries/intermediate.txt' },
  { id: 'intplus',           label: 'Intermediate Plus',  color: 'var(--lvl-intplus)',      file: 'dictionaries/intermediate-plus.txt' },
  { id: 'upperint',          label: 'Upper-Intermediate', color: 'var(--lvl-upperint)',     file: 'dictionaries/upper-intermediate.txt' },
];
let selectedLevel = 'preint';

// filled in once the selected level's dictionary has loaded
let CATEGORIES = [];               // [{ id, label }]
let WORDS = {};                     // { [catId]: [{ word, hint? }] }
let dictionariesLoaded = {};        // cache: levelId -> { categories, words }
let levelLoadError = null;

// ═══ TOPICS (Vocabulary Bank) — built from the loaded dictionary ═══
let selectedTopics = []; // filled once a level's dictionary loads

// ═══ steppers ═══
let timerVal = 60, roundsVal = 3;

// ═══ TEAMS ═══
let teams = [{ name: 'Team A' }, { name: 'Team B' }];

// ═══ GAME STATE (multi-team, multi-round) ═══
let penaltyOn = document.getElementById('penaltyToggle').checked;
document.getElementById('penaltyToggle').addEventListener('change', e => { penaltyOn = e.target.checked; });

let gameTimeLeft = 60;
let gameTimerInterval = null;
let timeIsUp = false;
let isPaused = false;

let scores = [];            // one running total per team
let currentTeamIdx = 0;
let currentRound = 1;
let wordPool = [];           // { word, cat, hint? }, shuffled
let usedWords = new Set();   // words already seen this game
let turnWords = [];          // words shown during the turn in progress: { word, cat, result }
let currentWordObj = null;
