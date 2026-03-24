/* ═══════════════════════════════════════════════════════
   PathFinder — Career DNA Engine
   app.js  — All application logic
   Author: Sreenivas Eerla (EERLASREENIVAS)
   GitHub: https://github.com/EERLASREENIVAS/pathfinder
═══════════════════════════════════════════════════════ */

// ── Global State ──────────────────────────────────────
const S = {
  step:        0,
  answers:     {},
  results:     [],
  mainIdx:     0,
  chatHistory: [],
};

// ── Theme Colors per path ─────────────────────────────
const PC = ['#6C47B8', '#1D9E75', '#D95C2D']; // path colors
const PL = ['#EDE8FA', '#E0F7F0', '#FDF0EB']; // path light bg

// ══════════════════════════════════════════════════════
// QUESTIONS DATA
// ══════════════════════════════════════════════════════
const QUESTIONS = [
  {
    id: 'degree',
    type: 'text',
    label: 'What are you studying or studied?',
    placeholder: 'e.g. B.Com, BCA, B.Sc CS, BA English',
  },
  {
    id: 'college_tier',
    type: 'select',
    label: 'Type of college',
    options: [
      'Tier 3 — local/private college',
      'Tier 2 — state university',
      'Tier 1 — NIT/IIT/top college',
    ],
  },
  {
    id: 'percentage',
    type: 'text',
    label: 'Academic percentage / CGPA',
    placeholder: 'e.g. 68% or 7.2 CGPA',
  },
  {
    id: 'interests',
    type: 'multiselect',
    label: 'What do you enjoy doing?',
    options: [
      'Talking to people', 'Working with numbers', 'Building things',
      'Writing / storytelling', 'Solving problems', 'Teaching others',
      'Using computers', 'Art & design', 'Organizing / planning',
    ],
  },
  {
    id: 'strengths',
    type: 'multiselect',
    label: 'What are you good at?',
    options: [
      'Communication', 'MS Excel / data', 'Coding / tech',
      'Sales / convincing', 'Writing', 'Quick learning',
      'Managing tasks', 'Creativity', 'Mathematics',
    ],
  },
  {
    id: 'location',
    type: 'text',
    label: 'Your city and state',
    placeholder: 'e.g. Raipur, Chhattisgarh',
  },
  {
    id: 'income_bracket',
    type: 'select',
    label: 'Family monthly income (approximate)',
    options: [
      'Below ₹15,000', '₹15,000–₹40,000',
      '₹40,000–₹80,000', 'Above ₹80,000',
    ],
  },
  {
    id: 'hours',
    type: 'select',
    label: 'Study hours available per day',
    options: ['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours'],
  },
  {
    id: 'languages',
    type: 'multiselect',
    label: 'Languages you\'re comfortable in',
    options: ['Hindi', 'English', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Kannada', 'Gujarati', 'Other'],
  },
  {
    id: 'constraints',
    type: 'multiselect',
    label: 'Any constraints on your career choices?',
    options: [
      'Must stay in home city', 'Cannot travel frequently',
      'Need income within 3 months', 'Prefer work from home',
      'Family pressure for govt job', 'No constraints',
    ],
  },
];

// ══════════════════════════════════════════════════════
// SKILL RESOURCE DATABASE
// ══════════════════════════════════════════════════════
const SKILL_MAP = {
  'excel': {
    w: [
      { n: 'Microsoft Office Free', u: 'https://www.microsoft.com/en-in/microsoft-365/free-office-online-for-the-web', i: '📊' },
      { n: 'Google Sheets',         u: 'https://sheets.google.com', i: '📊' },
      { n: 'Internshala Training',  u: 'https://trainings.internshala.com/excel-training', i: '🎓' },
    ],
    y: [
      { n: 'Learnit Anytime',       u: 'https://www.youtube.com/@LearnitAnytime' },
      { n: 'ExcelIsFun',            u: 'https://www.youtube.com/@excelisfun' },
      { n: 'MyOnlineTrainingHub',   u: 'https://www.youtube.com/@MyOnlineTrainingHub' },
    ],
  },
  'communication': {
    w: [
      { n: 'Learnex (Hindi/English)', u: 'https://www.learnex.in', i: '💬' },
      { n: 'Toastmasters',            u: 'https://www.toastmasters.org', i: '🎤' },
      { n: 'Internshala Soft Skills', u: 'https://trainings.internshala.com', i: '🎓' },
    ],
    y: [
      { n: 'Learnex English',  u: 'https://www.youtube.com/@learnexmumbai' },
      { n: 'Josh Talks Hindi', u: 'https://www.youtube.com/@JoshTalks' },
      { n: 'TED Talks India',  u: 'https://www.youtube.com/@TEDxTalks' },
    ],
  },
  'python': {
    w: [
      { n: 'Python.org (free docs)', u: 'https://www.python.org/doc', i: '🐍' },
      { n: 'freeCodeCamp',           u: 'https://www.freecodecamp.org', i: '💻' },
      { n: 'Replit (practice)',      u: 'https://replit.com', i: '⚡' },
    ],
    y: [
      { n: 'Apna College Python', u: 'https://www.youtube.com/watch?v=ERCMXc8x7mc' },
      { n: 'CodeWithHarry',       u: 'https://www.youtube.com/@CodeWithHarry' },
      { n: 'Tech With Tim',       u: 'https://www.youtube.com/@TechWithTim' },
    ],
  },
  'coding': {
    w: [
      { n: 'freeCodeCamp',   u: 'https://www.freecodecamp.org', i: '💻' },
      { n: 'HackerRank',     u: 'https://www.hackerrank.com', i: '🏆' },
      { n: 'GeeksForGeeks',  u: 'https://www.geeksforgeeks.org', i: '📘' },
    ],
    y: [
      { n: 'CodeWithHarry',  u: 'https://www.youtube.com/@CodeWithHarry' },
      { n: 'Apna College',   u: 'https://www.youtube.com/@ApnaCollegeOfficial' },
      { n: 'Traversy Media', u: 'https://www.youtube.com/@TraversyMedia' },
    ],
  },
  'digital marketing': {
    w: [
      { n: 'Google Digital Garage', u: 'https://learndigital.withgoogle.com/digitalgarage', i: '🔍' },
      { n: 'Meta Blueprint (free)', u: 'https://www.facebook.com/business/learn', i: '📘' },
      { n: 'HubSpot Academy',       u: 'https://academy.hubspot.com', i: '🎓' },
    ],
    y: [
      { n: 'Neil Patel',      u: 'https://www.youtube.com/@neilpatel' },
      { n: 'Digital Deepak',  u: 'https://www.youtube.com/@DigitalDeepak' },
      { n: 'Ahrefs',          u: 'https://www.youtube.com/@AhrefsCom' },
    ],
  },
  'marketing': {
    w: [
      { n: 'Google Digital Garage', u: 'https://learndigital.withgoogle.com/digitalgarage', i: '🔍' },
      { n: 'HubSpot Academy',       u: 'https://academy.hubspot.com', i: '🎓' },
      { n: 'Coursera Marketing',    u: 'https://www.coursera.org/courses?query=marketing', i: '📘' },
    ],
    y: [
      { n: 'Neil Patel',     u: 'https://www.youtube.com/@neilpatel' },
      { n: 'Digital Deepak', u: 'https://www.youtube.com/@DigitalDeepak' },
      { n: 'Marketing 91',   u: 'https://www.youtube.com/@Marketing91' },
    ],
  },
  'sales': {
    w: [
      { n: 'HubSpot Sales (free)', u: 'https://academy.hubspot.com/courses/inbound-sales', i: '💼' },
      { n: 'Internshala Sales',    u: 'https://trainings.internshala.com', i: '🎓' },
      { n: 'LinkedIn Learning',    u: 'https://www.linkedin.com/learning', i: '🔗' },
    ],
    y: [
      { n: 'Sales Insights Lab', u: 'https://www.youtube.com/@salesinsightslab' },
      { n: 'Victor Antonio',     u: 'https://www.youtube.com/@VictorAntonio' },
      { n: 'Josh Talks',         u: 'https://www.youtube.com/@JoshTalks' },
    ],
  },
  'accounting': {
    w: [
      { n: 'ICAI Study Material',   u: 'https://www.icai.org', i: '📊' },
      { n: 'Coursera Accounting',   u: 'https://www.coursera.org/courses?query=accounting', i: '🎓' },
      { n: 'Tally Official Learn',  u: 'https://tallysolutions.com/india/learn-tally', i: '📘' },
    ],
    y: [
      { n: 'CA Raja Classes',  u: 'https://www.youtube.com/@CArajaclasses' },
      { n: 'Commerce Wallah',  u: 'https://www.youtube.com/@CommerceWallah' },
      { n: 'CA Guru Ji',       u: 'https://www.youtube.com/@CAGuruJi' },
    ],
  },
  'tally': {
    w: [
      { n: 'Tally Official Learn',   u: 'https://tallysolutions.com/india/learn-tally', i: '📊' },
      { n: 'Internshala Tally',      u: 'https://trainings.internshala.com/tally-training', i: '🎓' },
      { n: 'NIIT Digital',           u: 'https://www.niit.com', i: '📘' },
    ],
    y: [
      { n: 'Tally Tutorial Hindi', u: 'https://www.youtube.com/results?search_query=tally+tutorial+hindi' },
      { n: 'Commerce Wallah',      u: 'https://www.youtube.com/@CommerceWallah' },
      { n: 'CA Guru Ji',           u: 'https://www.youtube.com/@CAGuruJi' },
    ],
  },
  'data': {
    w: [
      { n: 'Kaggle Learn (free)',       u: 'https://www.kaggle.com/learn', i: '📊' },
      { n: 'Google Data Analytics',     u: 'https://grow.google/certificates/data-analytics', i: '🔍' },
      { n: 'NPTEL Data Science',        u: 'https://nptel.ac.in', i: '📘' },
    ],
    y: [
      { n: 'Ken Jee',     u: 'https://www.youtube.com/@KenJee_ds' },
      { n: 'StatQuest',   u: 'https://www.youtube.com/@statquest' },
      { n: 'Apna College', u: 'https://www.youtube.com/@ApnaCollegeOfficial' },
    ],
  },
  'hr': {
    w: [
      { n: 'SHRM Free Resources', u: 'https://www.shrm.org', i: '👥' },
      { n: 'Coursera HR',         u: 'https://www.coursera.org/courses?query=human+resources', i: '🎓' },
      { n: 'LinkedIn Learning',   u: 'https://www.linkedin.com/learning', i: '🔗' },
    ],
    y: [
      { n: 'HR Management Hindi', u: 'https://www.youtube.com/results?search_query=HR+management+hindi' },
      { n: 'Commerce Wallah',     u: 'https://www.youtube.com/@CommerceWallah' },
      { n: 'Josh Talks',          u: 'https://www.youtube.com/@JoshTalks' },
    ],
  },
  'writing': {
    w: [
      { n: 'Grammarly Blog',    u: 'https://www.grammarly.com/blog', i: '✍' },
      { n: 'Hemingway App',     u: 'https://hemingwayapp.com', i: '📝' },
      { n: 'Coursera Writing',  u: 'https://www.coursera.org/courses?query=writing', i: '🎓' },
    ],
    y: [
      { n: 'English Writing Skills', u: 'https://www.youtube.com/results?search_query=english+writing+skills' },
      { n: 'Content Writing Hindi',  u: 'https://www.youtube.com/results?search_query=content+writing+hindi' },
      { n: 'Brian Tracy',            u: 'https://www.youtube.com/@BrianTracySuccessChannel' },
    ],
  },
  'graphic design': {
    w: [
      { n: 'Canva (free)',          u: 'https://www.canva.com', i: '🎨' },
      { n: 'Adobe Express (free)',  u: 'https://www.adobe.com/express', i: '🎨' },
      { n: 'Coursera Design',       u: 'https://www.coursera.org/courses?query=graphic+design', i: '🎓' },
    ],
    y: [
      { n: 'Canva Tutorials',      u: 'https://www.youtube.com/@canva' },
      { n: 'Will Paterson Design', u: 'https://www.youtube.com/@WillPatersonDesign' },
      { n: 'Satori Graphics',      u: 'https://www.youtube.com/@SatoriGraphics' },
    ],
  },
};

const DEFAULT_RES = {
  w: [
    { n: 'Coursera (free audit)', u: 'https://www.coursera.org', i: '🎓' },
    { n: 'SWAYAM (Govt free)',    u: 'https://swayam.gov.in', i: '🇮🇳' },
    { n: 'NPTEL',                 u: 'https://nptel.ac.in', i: '📘' },
  ],
  y: [
    { n: 'Apna College',  u: 'https://www.youtube.com/@ApnaCollegeOfficial' },
    { n: 'Learnex English', u: 'https://www.youtube.com/@learnexmumbai' },
    { n: 'Khan Academy',  u: 'https://www.youtube.com/@khanacademy' },
  ],
};

function getRes(skill) {
  const lc = skill.toLowerCase();
  for (const key of Object.keys(SKILL_MAP)) {
    if (lc.includes(key)) return SKILL_MAP[key];
  }
  return DEFAULT_RES;
}

// ══════════════════════════════════════════════════════
// SCREEN MANAGER
// ══════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'block';
  el.classList.add('active');
  window.scrollTo(0, 0);
}

// ══════════════════════════════════════════════════════
// QUIZ ENGINE
// ══════════════════════════════════════════════════════
function renderQuestion() {
  const q = QUESTIONS[S.step];

  document.getElementById('q-label').textContent    = `QUESTION ${S.step + 1}`;
  document.getElementById('q-text').textContent     = q.label;
  document.getElementById('q-counter').textContent  = `${S.step + 1} / ${QUESTIONS.length}`;
  document.getElementById('q-progress').style.width = `${Math.round((S.step / QUESTIONS.length) * 100 + 10)}%`;
  document.getElementById('q-back').style.display   = S.step > 0 ? '' : 'none';
  document.getElementById('q-error').style.display  = 'none';

  const wrap = document.getElementById('q-input');
  wrap.innerHTML = '';

  if (q.type === 'text') {
    const inp = document.createElement('input');
    inp.type        = 'text';
    inp.placeholder = q.placeholder || '';
    inp.value       = S.answers[q.id] || '';
    inp.onkeydown   = e => { if (e.key === 'Enter') quizNext(); };
    wrap.appendChild(inp);
    setTimeout(() => inp.focus(), 100);

  } else if (q.type === 'select') {
    q.options.forEach(o => {
      const b = document.createElement('button');
      b.className  = 'sel-opt' + (S.answers[q.id] === o ? ' selected' : '');
      b.textContent = (S.answers[q.id] === o ? '✓ ' : '') + o;
      b.onclick = () => {
        S.answers[q.id] = o;
        wrap.querySelectorAll('.sel-opt').forEach(x => {
          x.className   = 'sel-opt';
          x.textContent = x.textContent.replace('✓ ', '');
        });
        b.className   = 'sel-opt selected';
        b.textContent = '✓ ' + o;
      };
      wrap.appendChild(b);
    });

  } else if (q.type === 'multiselect') {
    const div = document.createElement('div');
    div.className = 'ms-wrap';
    const val = S.answers[q.id] || [];

    q.options.forEach(o => {
      const b = document.createElement('button');
      b.className   = 'ms-opt' + (val.includes(o) ? ' selected' : '');
      b.textContent = (val.includes(o) ? '✓ ' : '') + o;
      b.onclick = () => {
        let arr = S.answers[q.id] || [];
        if (arr.includes(o)) {
          arr = arr.filter(x => x !== o);
          b.className   = 'ms-opt';
          b.textContent = o;
        } else {
          arr = [...arr, o];
          b.className   = 'ms-opt selected';
          b.textContent = '✓ ' + o;
        }
        S.answers[q.id] = arr;
      };
      div.appendChild(b);
    });
    wrap.appendChild(div);
  }
}

function isValid() {
  const q = QUESTIONS[S.step];
  const v = S.answers[q.id];
  if (q.type === 'multiselect') return v && v.length > 0;
  if (q.type === 'text') {
    const el = document.querySelector('#q-input input');
    return el && el.value.trim().length > 0;
  }
  return !!v;
}

function quizNext() {
  const q = QUESTIONS[S.step];
  if (q.type === 'text') {
    const el = document.querySelector('#q-input input');
    if (el) S.answers[q.id] = el.value.trim();
  }
  if (!isValid()) {
    const e = document.getElementById('q-error');
    e.style.display = 'block';
    e.textContent   = 'Please answer this question to continue.';
    return;
  }
  if (S.step < QUESTIONS.length - 1) {
    S.step++;
    renderQuestion();
  } else {
    submitQuiz();
  }
}

function quizBack() {
  if (S.step > 0) { S.step--; renderQuestion(); }
}

// ══════════════════════════════════════════════════════
// ANTHROPIC API CALL
// ══════════════════════════════════════════════════════
async function callAPI(system, userMsg, maxTokens = 1200) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages:   [{ role: 'user', content: userMsg }],
    }),
  });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message || 'API error');
  return d.content?.map(c => c.text || '').join('') || '';
}

// ══════════════════════════════════════════════════════
// QUIZ SUBMISSION → AI RESULTS
// ══════════════════════════════════════════════════════
async function submitQuiz() {
  showScreen('loading');
  const a = S.answers;

  const profile = [
    `- Education: ${a.degree || ''}, ${a.college_tier || ''}, ${a.percentage || ''}`,
    `- Interests: ${(a.interests || []).join(', ')}`,
    `- Strengths: ${(a.strengths || []).join(', ')}`,
    `- Location: ${a.location || ''}`,
    `- Family income: ${a.income_bracket || ''}`,
    `- Study hours: ${a.hours || ''}`,
    `- Languages: ${(a.languages || []).join(', ')}`,
    `- Career constraints: ${(a.constraints || []).join(', ')}`,
  ].join('\n');

  const system = `You are PathFinder, a career advisor for first-generation college students in India.
Generate exactly 3 career path recommendations as a valid JSON array.
Each object must have:
  career_title (string),
  day_to_day (string, 2 sentences, simple language),
  starting_salary (string, ₹/month range e.g. "₹18,000–₹25,000/month"),
  skills_to_learn (array of exactly 5 strings, priority order),
  free_resources (array of 3 strings — platform names),
  timeline_weeks (number),
  confidence_score (number 0–100).
Rules: no MBA, no expensive certifications, prioritise remote-friendly paths, simple language.
Output ONLY a valid JSON array — no markdown, no preamble, no explanation.`;

  try {
    const text    = await callAPI(system, `Student Profile:\n${profile}`);
    S.results     = JSON.parse(text.replace(/```json|```/g, '').trim());
    S.mainIdx     = 0;
    S.chatHistory = [];
    buildResults();
    showScreen('results');
  } catch (e) {
    showScreen('quiz');
    const err = document.getElementById('q-error');
    err.style.display = 'block';
    err.textContent   = 'API error: ' + e.message + '. Please try again.';
  }
}

// ══════════════════════════════════════════════════════
// BUILD RESULTS — master controller
// ══════════════════════════════════════════════════════
function buildResults() {
  buildPills();
  buildScoreGrid();
  buildMainTab();
  buildRoadmapTab();
  buildSkillsTab();
  buildResumeTab();
  buildChatTab();
  switchTabById('main');
}

// ── Path selector pills ───────────────────────────────
function buildPills() {
  const el = document.getElementById('path-pills');
  el.innerHTML = '';
  S.results.forEach((p, i) => {
    const b = document.createElement('button');
    b.className = 'path-pill';
    if (i === S.mainIdx) {
      b.style.borderColor = PC[i];
      b.style.background  = PC[i];
      b.style.color       = '#fff';
    }
    b.textContent = `Path ${i + 1}: ${p.career_title.length > 16 ? p.career_title.slice(0, 14) + '…' : p.career_title}`;
    b.onclick = () => { S.mainIdx = i; buildResults(); };
    el.appendChild(b);
  });
}

// ── Score overview cards ──────────────────────────────
function buildScoreGrid() {
  const el = document.getElementById('score-grid');
  el.innerHTML = '';
  S.results.forEach((p, i) => {
    const d = document.createElement('div');
    d.className = 'score-card';
    if (i === S.mainIdx) {
      d.style.borderColor = PC[i];
      d.style.background  = PL[i];
    }
    d.innerHTML = `
      <span style="background:${PL[i]};color:${PC[i]};border-radius:99px;font-size:10px;font-weight:700;padding:2px 9px;">PATH ${i + 1}</span>
      <div style="font-size:12px;font-weight:700;color:var(--dark);margin:5px 0 2px;line-height:1.3;">${p.career_title}</div>
      <div class="score-bar-wrap">
        <div class="score-bar-bg">
          <div class="score-bar-fill" style="background:${PC[i]};width:0;" data-w="${p.confidence_score}%"></div>
        </div>
        <span style="font-size:11px;font-weight:700;color:${PC[i]};min-width:30px;">${p.confidence_score}%</span>
      </div>`;
    d.onclick = () => { S.mainIdx = i; buildResults(); };
    el.appendChild(d);
  });
  // Animate bars after paint
  setTimeout(() => {
    document.querySelectorAll('.score-bar-fill').forEach(b => {
      b.style.width = b.dataset.w;
    });
  }, 120);
}

// ══════════════════════════════════════════════════════
// MAIN PATH TAB
// ══════════════════════════════════════════════════════
function buildMainTab() {
  const p = S.results[S.mainIdx];
  const c = PC[S.mainIdx];
  const l = PL[S.mainIdx];

  const milestones = [
    { w: 0,                                   l: 'Start today',              i: '🚀', d: 'Begin your PathFinder journey' },
    { w: Math.round(p.timeline_weeks * 0.20), l: `Learn ${p.skills_to_learn?.[0] || 'Skill 1'}`, i: '📚', d: 'Focus on #1 priority skill' },
    { w: Math.round(p.timeline_weeks * 0.45), l: `Learn ${p.skills_to_learn?.[1] || 'Skill 2'}`, i: '🛠️', d: 'Expand your toolkit' },
    { w: Math.round(p.timeline_weeks * 0.65), l: 'First internship / project',                    i: '💼', d: 'Apply on Internshala' },
    { w: Math.round(p.timeline_weeks * 0.85), l: 'Build portfolio',                               i: '🎯', d: 'Document your work' },
    { w: p.timeline_weeks,                    l: 'First Job Offer 🎉',                            i: '🏆', d: `Target: ${p.starting_salary}` },
  ];

  const jobs = [
    { n: 'Internshala',   u: 'https://internshala.com',          c: '#D95C2D', d: 'Internships' },
    { n: 'Naukri.com',    u: 'https://naukri.com',               c: '#D32F2F', d: 'Full-time jobs' },
    { n: 'LinkedIn',      u: 'https://linkedin.com/jobs',         c: '#0077B5', d: 'Network + jobs' },
    { n: 'Shine.com',     u: 'https://shine.com',                 c: '#1D9E75', d: 'Fresher jobs' },
    { n: 'Govt NCS',      u: 'https://www.ncs.gov.in',           c: '#C47F17', d: 'Govt portal' },
    { n: 'Freshersworld', u: 'https://freshersworld.com',         c: '#6C47B8', d: 'Campus jobs' },
  ];

  const msHTML = milestones.map((m, i) => `
    <div class="milestone-row">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div class="ms-icon" style="background:${i === milestones.length - 1 ? c : l};border-color:${c};">${m.i}</div>
        ${i < milestones.length - 1 ? `<div class="ms-line" style="background:${c}33;"></div>` : ''}
      </div>
      <div style="padding-bottom:13px;">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:1px;">
          <span style="font-size:13px;font-weight:700;color:var(--dark);">${m.l}</span>
          <span style="font-size:9px;background:${l};color:${c};border-radius:99px;padding:2px 7px;font-weight:600;">Wk ${m.w}</span>
        </div>
        <div style="font-size:11px;color:var(--muted);">${m.d}</div>
      </div>
    </div>`).join('');

  const skillsHTML = (p.skills_to_learn || []).map((s, i) => `
    <div style="display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:12px;background:${i === 0 ? l : '#FAFAFE'};border:1px solid ${i === 0 ? c : 'var(--border)'};margin-bottom:8px;">
      <span style="width:26px;height:26px;border-radius:99px;background:${i === 0 ? c : '#E8E4F0'};color:${i === 0 ? '#fff' : 'var(--muted)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${i + 1}</span>
      <span style="font-size:13px;font-weight:${i === 0 ? 700 : 400};color:var(--dark);flex:1;">${s}</span>
      ${i === 0 ? `<span style="font-size:9px;color:${c};font-weight:800;letter-spacing:0.5px;">PRIORITY</span>` : ''}
    </div>`).join('');

  const jobsHTML = jobs.map(j => `
    <a href="${j.u}" target="_blank" rel="noopener noreferrer" class="job-card" style="border:1.5px solid ${j.c}22;background:${j.c}0A;">
      <div style="width:32px;height:32px;border-radius:8px;background:${j.c};display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800;flex-shrink:0;">${j.n[0]}</div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--dark);">${j.n}</div>
        <div style="font-size:10px;color:var(--muted);">${j.d}</div>
      </div>
    </a>`).join('');

  document.getElementById('tab-main').innerHTML = `
    <div style="border-radius:18px;border:1.5px solid ${c};overflow:hidden;margin-bottom:14px;">
      <div class="hero-banner" style="background:linear-gradient(135deg,${c} 0%,${c}CC 100%);">
        <div style="font-size:10px;color:rgba(255,255,255,0.7);font-weight:700;letter-spacing:1px;margin-bottom:5px;">⭐ YOUR MAIN PATH — RECOMMENDED</div>
        <div style="font-size:22px;font-weight:800;color:#fff;font-family:var(--serif);line-height:1.2;margin-bottom:6px;">${p.career_title}</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.6;">${p.day_to_day}</div>
        <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
          <div class="stat-chip"><div class="stat-chip-label">SALARY</div><div class="stat-chip-value">${p.starting_salary}</div></div>
          <div class="stat-chip"><div class="stat-chip-label">TIMELINE</div><div class="stat-chip-value">${p.timeline_weeks} weeks</div></div>
          <div class="stat-chip"><div class="stat-chip-label">FIT SCORE</div><div class="stat-chip-value">${p.confidence_score}%</div></div>
        </div>
      </div>
      <div style="padding:18px 18px 20px;">
        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin-bottom:12px;">WEEK-BY-WEEK MILESTONES</div>
        ${msHTML}
        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin:14px 0 10px;">SKILLS IN ORDER OF PRIORITY</div>
        ${skillsHTML}
        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin:14px 0 10px;">APPLY FOR JOBS &amp; INTERNSHIPS</div>
        <div class="job-grid">${jobsHTML}</div>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════════════
// ROADMAP TAB — animated SVG skill journey
// ══════════════════════════════════════════════════════
function buildRoadmapTab() {
  const el = document.getElementById('tab-roadmap');
  el.innerHTML = '';

  S.results.forEach((p, idx) => {
    const c      = PC[idx];
    const l      = PL[idx];
    const skills = p.skills_to_learn || [];
    const W = 500, H = 200;

    const pts = skills.map((_, i) => ({
      x: 50 + (i / Math.max(skills.length - 1, 1)) * (W - 100),
      y: i % 2 === 0 ? 70 : 140,
    }));

    let d = pts.length > 0 ? `M ${pts[0].x} ${pts[0].y}` : '';
    for (let i = 1; i < pts.length; i++) {
      const pp = pts[i - 1], cp = pts[i];
      const mx = (pp.x + cp.x) / 2;
      d += ` C ${mx} ${pp.y},${mx} ${cp.y},${cp.x} ${cp.y}`;
    }

    const nodes = pts.map((pt, i) => `
      <circle cx="${pt.x}" cy="${pt.y}" r="18" fill="${c}" stroke="${c}" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y}" text-anchor="middle" dominant-baseline="central"
        font-size="11" font-weight="700" fill="white" font-family="Sora,sans-serif">${i + 1}</text>
      <text x="${pt.x}" y="${i % 2 === 0 ? pt.y + 34 : pt.y - 26}" text-anchor="middle"
        font-size="9" fill="${c}" font-weight="700" font-family="Sora,sans-serif">
        Wk ${Math.ceil(p.timeline_weeks / skills.length * i) + 1}–${Math.ceil(p.timeline_weeks / skills.length * (i + 1))}
      </text>
      <text x="${pt.x}" y="${i % 2 === 0 ? pt.y + 46 : pt.y - 38}" text-anchor="middle"
        font-size="9" fill="var(--dark)" font-family="Sora,sans-serif">${skills[i] || ''}</text>`).join('');

    const div = document.createElement('div');
    div.style.marginBottom = '22px';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:7px;margin-bottom:9px;">
        <span style="background:${l};color:${c};border-radius:99px;font-size:10px;font-weight:700;padding:2px 9px;">PATH ${idx + 1}</span>
        <span style="font-size:14px;font-weight:700;color:var(--dark);font-family:var(--serif);">${p.career_title}</span>
        ${idx === S.mainIdx ? `<span style="font-size:10px;color:var(--purple);font-weight:700;">⭐ Main</span>` : ''}
      </div>
      <div style="background:#fafafe;border-radius:16px;padding:16px 12px 12px;border:1px solid var(--border);overflow-x:auto;">
        <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;min-width:${W}px;">
          ${pts.length > 1 ? `<path d="${d}" fill="none" stroke="#E0DCF0" stroke-width="3" stroke-linecap="round"/>` : ''}
          ${pts.length > 1 ? `<path d="${d}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` : ''}
          ${nodes}
        </svg>
      </div>`;
    el.appendChild(div);
  });
}

// ══════════════════════════════════════════════════════
// SKILLS TAB — expandable cards with live links
// ══════════════════════════════════════════════════════
function buildSkillsTab() {
  const el = document.getElementById('tab-skills');
  el.innerHTML = '';
  const p  = S.results[S.mainIdx];
  const c  = PC[S.mainIdx];
  const l  = PL[S.mainIdx];

  (p.skills_to_learn || []).forEach((s, i) => {
    const res  = getRes(s);
    const isF  = i === 0;
    const card = document.createElement('div');
    card.className = 'skill-card';
    if (isF) card.style.borderColor = c;

    const bodyId = `skill-body-${i}`;

    card.innerHTML = `
      <div class="skill-header" style="background:${isF ? l : '#fff'};" onclick="toggleSkill('${bodyId}', this)">
        <span style="width:27px;height:27px;border-radius:99px;background:${isF ? c : '#E8E4F0'};color:${isF ? '#fff' : 'var(--muted)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${i + 1}</span>
        <span style="font-size:13px;font-weight:${isF ? 700 : 500};color:var(--dark);flex:1;">${s}</span>
        ${isF ? `<span style="font-size:9px;color:${c};font-weight:800;background:${l};padding:3px 8px;border-radius:99px;">PRIORITY</span>` : ''}
        <span style="color:var(--muted);font-size:12px;">▼</span>
      </div>
      <div class="skill-body ${isF ? 'open' : ''}" id="${bodyId}">
        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin:11px 0 8px;">🌐 WEBSITES TO LEARN</div>
        ${res.w.map(w => `
          <a href="${w.u}" target="_blank" rel="noopener noreferrer" class="res-link web-link">
            <span style="font-size:14px;">${w.i}</span>
            <span style="font-size:13px;color:var(--dark);flex:1;">${w.n}</span>
            <span style="font-size:11px;color:${c};font-weight:700;">Open →</span>
          </a>`).join('')}
        <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin:11px 0 8px;">▶ TOP YOUTUBE CHANNELS</div>
        ${res.y.map(y => `
          <a href="${y.u}" target="_blank" rel="noopener noreferrer" class="res-link yt-link">
            <span style="font-size:14px;color:#FF0000;">▶</span>
            <span style="font-size:13px;color:var(--dark);flex:1;">${y.n}</span>
            <span style="font-size:11px;color:#FF4444;font-weight:700;">Watch →</span>
          </a>`).join('')}
        ${isF ? `<a href="${res.w[0].u}" target="_blank" rel="noopener noreferrer"
          style="display:block;margin-top:11px;padding:11px;border-radius:12px;background:${c};color:#fff;text-align:center;font-size:13px;font-weight:700;">
          🚀 Start Learning Now — ${res.w[0].n}
        </a>` : ''}
      </div>`;
    el.appendChild(card);
  });
}

function toggleSkill(id, hdr) {
  const body = document.getElementById(id);
  const open = body.classList.contains('open');
  body.classList.toggle('open');
  const arrow = hdr.querySelector('span:last-child');
  if (arrow) arrow.textContent = open ? '▼' : '▲';
}

// ══════════════════════════════════════════════════════
// RESUME TAB
// ══════════════════════════════════════════════════════
function buildResumeTab() {
  const p = S.results[S.mainIdx];
  const c = PC[S.mainIdx];
  const l = PL[S.mainIdx];

  document.getElementById('tab-resume').innerHTML = `
    <div style="background:#fff;border-radius:18px;border:1.5px solid var(--border);padding:18px 18px 22px;">
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin-bottom:3px;">AI RESUME BUILDER</div>
      <div style="font-size:17px;font-weight:800;font-family:var(--serif);color:var(--dark);margin-bottom:3px;">Build your resume for</div>
      <div style="font-size:13px;color:${c};font-weight:700;margin-bottom:16px;">${p.career_title}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;">
        ${rInp('Full Name',                  'res-name',    'e.g. Priya Sharma',           'text',  'grid-column:1/-1')}
        ${rInp('Phone',                      'res-phone',   '98765 43210',                 'tel',   '')}
        ${rInp('Email',                      'res-email',   'priya@gmail.com',             'email', '')}
        ${rInp('LinkedIn / GitHub (optional)','res-linkedin','linkedin.com/in/priya',      'text',  'grid-column:1/-1')}
      </div>
      <div style="height:1px;background:var(--border);margin:10px 0 14px;"></div>
      <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin-bottom:10px;">EXPERIENCE (write 1 line each)</div>
      ${rTa('Experience / Internship 1', 'res-exp1',  'e.g. 2-month internship at CA firm doing data entry')}
      ${rTa('Experience 2 (optional)',   'res-exp2',  'e.g. Helped manage social media for a shop')}
      <div style="height:1px;background:var(--border);margin:10px 0 14px;"></div>
      <div style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.8px;margin-bottom:10px;">PROJECTS &amp; ACHIEVEMENTS</div>
      ${rTa('Project 1',          'res-proj1',   'e.g. Built a budget tracker in Excel for 50 shopkeepers')}
      ${rTa('Project 2 (optional)','res-proj2',  'e.g. Created WhatsApp newsletter with 200+ subscribers')}
      ${rInp('Achievement', 'res-achieve', 'e.g. Won state-level quiz, or 90% attendance', 'text', '')}
      <button onclick="generateResume()" id="res-gen-btn"
        style="width:100%;margin-top:10px;padding:13px;border-radius:13px;background:${c};color:#fff;font-size:14px;font-weight:700;font-family:var(--font);">
        ✨ Generate AI Resume
      </button>
    </div>
    <div id="resume-output" style="display:none;margin-top:14px;"></div>`;
}

function rInp(label, id, ph, type, extraStyle) {
  return `<div style="margin-bottom:11px;${extraStyle ? extraStyle + ';' : ''}">
    <label style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.5px;display:block;margin-bottom:4px;">${label}</label>
    <input id="${id}" type="${type}" placeholder="${ph}" style="width:100%;">
  </div>`;
}

function rTa(label, id, ph) {
  return `<div style="margin-bottom:11px;">
    <label style="font-size:10px;font-weight:700;color:var(--muted);letter-spacing:0.5px;display:block;margin-bottom:4px;">${label}</label>
    <textarea id="${id}" placeholder="${ph}" rows="2" style="width:100%;resize:vertical;"></textarea>
  </div>`;
}

function gv(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

async function generateResume() {
  const p   = S.results[S.mainIdx];
  const btn = document.getElementById('res-gen-btn');
  btn.textContent    = '✨ Generating…';
  btn.style.opacity  = '0.7';
  btn.disabled       = true;

  const system = `You are a professional resume writer for Indian freshers.
Generate an ATS-friendly resume as JSON ONLY with these keys:
  summary (string, 2 sentences),
  skills (array of 6 strings),
  experience (array of {title, company, duration, bullets: [3 strings]}),
  education (string),
  projects (array of {title, description}, max 2),
  achievements (string).
If no experience is provided, create one realistic mock entry based on the projects/skills.
No preamble, no markdown. Valid JSON only.`;

  const a = S.answers;
  const prompt = `Name:${gv('res-name') || 'Student'}, Career:${p.career_title},
Degree:${a.degree} ${a.college_tier} ${a.percentage}, Location:${a.location},
Strengths:${(a.strengths || []).join(',')}, Skills:${(p.skills_to_learn || []).join(',')},
Exp1:${gv('res-exp1')}, Exp2:${gv('res-exp2')},
Proj1:${gv('res-proj1')}, Proj2:${gv('res-proj2')},
Achievement:${gv('res-achieve')}`;

  try {
    const text = await callAPI(system, prompt, 900);
    const r    = JSON.parse(text.replace(/```json|```/g, '').trim());
    showResume(r, gv('res-name') || 'Your Name');
  } catch (e) {
    alert('Resume generation failed: ' + e.message);
  } finally {
    btn.textContent   = '✨ Generate AI Resume';
    btn.style.opacity = '1';
    btn.disabled      = false;
  }
}

function showResume(r, name) {
  const p   = S.results[S.mainIdx];
  const c   = PC[S.mainIdx];
  const l   = PL[S.mainIdx];
  const a   = S.answers;
  const out = document.getElementById('resume-output');
  out.style.display = 'block';

  const skillsHTML = (r.skills || []).map(s =>
    `<span style="background:${l};color:${c};border-radius:99px;font-size:11px;font-weight:600;padding:3px 10px;">${s}</span>`
  ).join(' ');

  const expHTML = (r.experience || []).map(e => `
    <div style="margin-bottom:11px;">
      <div style="display:flex;justify-content:space-between;">
        <b style="font-size:13px;">${e.title}</b>
        <span style="font-size:11px;color:var(--muted);">${e.duration}</span>
      </div>
      <div style="font-size:12px;color:${c};margin-bottom:3px;">${e.company}</div>
      <ul style="padding-left:16px;margin:0;">
        ${(e.bullets || []).map(b => `<li style="font-size:12px;color:#333;margin-bottom:2px;">${b}</li>`).join('')}
      </ul>
    </div>`).join('');

  const projHTML = (r.projects || []).map(pr => `
    <div style="margin-bottom:7px;">
      <b style="font-size:13px;">${pr.title}:</b>
      <span style="font-size:12px;color:#444;"> ${pr.description}</span>
    </div>`).join('');

  out.innerHTML = `
    <div id="resume-content" class="resume-preview">
      <div style="border-bottom:2px solid ${c};padding-bottom:12px;margin-bottom:14px;">
        <div style="font-size:22px;font-weight:700;font-family:var(--serif);color:var(--dark);">${name}</div>
        <div style="font-size:13px;color:${c};font-weight:600;margin-top:2px;">${p.career_title}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:5px;display:flex;gap:12px;flex-wrap:wrap;">
          ${gv('res-phone')   ? `<span>📞 ${gv('res-phone')}</span>`   : ''}
          ${gv('res-email')   ? `<span>✉ ${gv('res-email')}</span>`    : ''}
          ${gv('res-linkedin')? `<span>🔗 ${gv('res-linkedin')}</span>`: ''}
          <span>📍 ${a.location}</span>
        </div>
      </div>
      <div>
        <div class="resume-section-title" style="color:${c};border-color:${c}44;">PROFESSIONAL SUMMARY</div>
        <p style="font-size:13px;color:#333;">${r.summary}</p>
      </div>
      <div style="margin-top:12px;">
        <div class="resume-section-title" style="color:${c};border-color:${c}44;">KEY SKILLS</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">${skillsHTML}</div>
      </div>
      ${expHTML ? `<div style="margin-top:12px;"><div class="resume-section-title" style="color:${c};border-color:${c}44;">EXPERIENCE</div>${expHTML}</div>` : ''}
      <div style="margin-top:12px;">
        <div class="resume-section-title" style="color:${c};border-color:${c}44;">EDUCATION</div>
        <div style="font-size:13px;color:var(--dark);">${r.education || a.degree + ' — ' + a.percentage}</div>
        <div style="font-size:12px;color:var(--muted);">${a.college_tier}</div>
      </div>
      ${projHTML ? `<div style="margin-top:12px;"><div class="resume-section-title" style="color:${c};border-color:${c}44;">PROJECTS</div>${projHTML}</div>` : ''}
      ${r.achievements ? `<div style="margin-top:12px;"><div class="resume-section-title" style="color:${c};border-color:${c}44;">ACHIEVEMENTS</div><p style="font-size:13px;color:#333;">${r.achievements}</p></div>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:11px;">
      <button onclick="copyResume()" id="copy-btn"
        style="padding:11px;border-radius:12px;border:1.5px solid ${c};background:${l};color:${c};font-size:13px;font-weight:700;font-family:var(--font);">
        📋 Copy Text
      </button>
      <a href="https://www.overleaf.com/latex/templates/tagged/cv" target="_blank" rel="noopener noreferrer"
        style="padding:11px;border-radius:12px;background:var(--teal);color:#fff;font-size:13px;font-weight:700;text-align:center;display:block;">
        📄 Overleaf
      </a>
      <a href="https://internshala.com" target="_blank" rel="noopener noreferrer"
        style="padding:11px;border-radius:12px;background:var(--coral);color:#fff;font-size:13px;font-weight:700;text-align:center;display:block;">
        🔗 Internshala
      </a>
      <a href="https://naukri.com" target="_blank" rel="noopener noreferrer"
        style="padding:11px;border-radius:12px;background:#D32F2F;color:#fff;font-size:13px;font-weight:700;text-align:center;display:block;">
        💼 Naukri
      </a>
    </div>`;
}

function copyResume() {
  const el = document.getElementById('resume-content');
  if (el) {
    navigator.clipboard.writeText(el.innerText).then(() => {
      const b = document.getElementById('copy-btn');
      b.textContent = '✓ Copied!';
      setTimeout(() => { b.textContent = '📋 Copy Text'; }, 2000);
    });
  }
}

// ══════════════════════════════════════════════════════
// CHAT TAB — AI Advisor
// ══════════════════════════════════════════════════════
function buildChatTab() {
  document.getElementById('tab-chat').innerHTML = `
    <div class="chat-wrap">
      <div style="padding:11px 14px;border-bottom:1px solid var(--border);background:var(--purpleL);display:flex;align-items:center;gap:9px;">
        <div style="width:32px;height:32px;border-radius:99px;background:var(--purple);display:flex;align-items:center;justify-content:center;font-size:14px;">🤖</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--dark);">PathFinder AI Advisor</div>
          <div style="font-size:10px;color:var(--purple);">● Online — ask me anything</div>
        </div>
      </div>
      <div class="chat-msgs" id="chat-msgs">
        <div class="bubble bot">Hi! I'm your PathFinder AI advisor 👋 Ask me anything about your career paths, how to get started, salary, or skills!</div>
      </div>
      <div style="padding:5px 9px;display:flex;gap:5px;flex-wrap:wrap;border-top:1px solid var(--border);">
        <button onclick="fillChat('How do I start with the first skill?')"    style="font-size:11px;padding:4px 9px;border-radius:99px;border:1px solid var(--border);background:#fafafe;color:var(--purple);font-weight:500;font-family:var(--font);">Start with skill 1?</button>
        <button onclick="fillChat('What salary can I expect in 1 year?')"     style="font-size:11px;padding:4px 9px;border-radius:99px;border:1px solid var(--border);background:#fafafe;color:var(--purple);font-weight:500;font-family:var(--font);">Salary in 1 year?</button>
        <button onclick="fillChat('Which companies hire for this role?')"      style="font-size:11px;padding:4px 9px;border-radius:99px;border:1px solid var(--border);background:#fafafe;color:var(--purple);font-weight:500;font-family:var(--font);">Companies hiring?</button>
        <button onclick="fillChat('Can I do this job from home?')"             style="font-size:11px;padding:4px 9px;border-radius:99px;border:1px solid var(--border);background:#fafafe;color:var(--purple);font-weight:500;font-family:var(--font);">Work from home?</button>
      </div>
      <div style="padding:9px 10px;border-top:1px solid var(--border);display:flex;gap:7px;">
        <input id="chat-input" placeholder="Ask anything…" onkeydown="if(event.key==='Enter') sendChat()" style="flex:1;border-radius:11px;"/>
        <button onclick="sendChat()" style="padding:9px 14px;border-radius:11px;background:var(--purple);color:#fff;font-weight:700;font-size:13px;font-family:var(--font);">↑</button>
      </div>
    </div>`;
}

function fillChat(t) {
  document.getElementById('chat-input').value = t;
}

async function sendChat() {
  const inp  = document.getElementById('chat-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';

  addBubble(text, 'user');
  S.chatHistory.push({ role: 'user', content: text });
  const typing = addBubble('…', 'bot');

  const p       = S.results[S.mainIdx];
  const a       = S.answers;
  const pathSum = S.results.map((r, i) =>
    `Path ${i + 1}: ${r.career_title} (fit:${r.confidence_score}%, salary:${r.starting_salary}, skills:${r.skills_to_learn.join(', ')})`
  ).join('\n');

  const system = `You are PathFinder AI, a friendly career advisor for first-generation college students in India.
Profile: Degree:${a.degree}, ${a.college_tier}, ${a.percentage}, Location:${a.location}, Income:${a.income_bracket}, Hours:${a.hours}.
Paths:\n${pathSum}
Main path: ${p.career_title}.
Be warm, practical, mention free resources (YouTube, SWAYAM, NPTEL, Internshala). Keep replies concise.`;

  const msgs = S.chatHistory.map(m => ({ role: m.role, content: m.content }));

  try {
    const res   = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 500, system, messages: msgs }),
    });
    const d     = await res.json();
    const reply = d.content?.map(c => c.text || '').join('') || 'Sorry, try again!';
    typing.textContent = reply;
    S.chatHistory.push({ role: 'assistant', content: reply });
  } catch {
    typing.textContent = 'Connection error. Please try again!';
  }

  document.getElementById('chat-msgs').scrollTop = 99999;
}

function addBubble(text, role) {
  const msgs = document.getElementById('chat-msgs');
  const d    = document.createElement('div');
  d.className   = 'bubble ' + role;
  d.textContent = text;
  msgs.appendChild(d);
  msgs.scrollTop = 99999;
  return d;
}

// ══════════════════════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════════════════════
function switchTab(name, btn) {
  ['main', 'roadmap', 'skills', 'resume', 'chat'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('#main-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function switchTabById(name) {
  const TABS = ['main', 'roadmap', 'skills', 'resume', 'chat'];
  TABS.forEach(t => {
    document.getElementById('tab-' + t).style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('#main-tabs .tab-btn').forEach((b, i) => {
    b.classList.toggle('active', TABS[i] === name);
  });
}

// ══════════════════════════════════════════════════════
// RESET
// ══════════════════════════════════════════════════════
function resetApp() {
  S.step        = 0;
  S.answers     = {};
  S.results     = [];
  S.mainIdx     = 0;
  S.chatHistory = [];
  showScreen('splash');
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
window.onload = () => {
  showScreen('splash');
  renderQuestion();
};
