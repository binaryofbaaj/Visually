/* AlgoVista - Core Application */
window.AlgoVista = { algorithms: {}, categories: {} };

function registerAlgorithm(algo) {
  window.AlgoVista.algorithms[algo.id] = algo;
  if (!window.AlgoVista.categories[algo.category]) {
    window.AlgoVista.categories[algo.category] = { icon: algo.catIcon, algos: [] };
  }
  window.AlgoVista.categories[algo.category].algos.push(algo);
}

/* ===== STATE ===== */
let currentAlgo = null, steps = [], currentStep = -1, playing = false, playTimer = null, autoPlayTimer = null, currentLang = 'cpp';
const canvas = document.getElementById('viz-canvas');
const ctx = canvas.getContext('2d');

/* ===== THEME ===== */
function initTheme() {
  const saved = localStorage.getItem('algovista-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('algovista-theme', next);
  updateThemeIcon(next);
  if (currentAlgo && steps.length) renderStep();
}
function updateThemeIcon(theme) {
  const icon = theme === 'dark' ? '🌙' : '☀️';
  document.getElementById('theme-toggle').textContent = icon;
}

/* ===== SIDEBAR ===== */
function buildSidebar() {
  const nav = document.getElementById('sidebar-nav');
  let html = '<div class="nav-category"><div class="nav-category-title">Home</div>';
  html += '<div class="nav-item active" data-route="home" data-tooltip="All Algorithms" onclick="navigate(\'home\')"><span class="nav-icon">🏠</span><span>All Algorithms</span></div></div>';
  const cats = window.AlgoVista.categories;
  for (const cat in cats) {
    html += `<div class="nav-category"><div class="nav-category-title">${cats[cat].icon} ${cat}</div>`;
    cats[cat].algos.forEach(a => {
      html += `<div class="nav-item" data-route="${a.id}" data-tooltip="${a.name}" onclick="navigate('${a.id}')"><span class="nav-icon">${a.icon||'📌'}</span><span>${a.name}</span></div>`;
    });
    html += '</div>';
  }
  nav.innerHTML = html;
}

/* ===== HOME VIEW ===== */
function buildHome() {
  const view = document.getElementById('home-view');
  let html = `<div class="home-hero"><h1>Algorithm Visualizer</h1><p>Explore 20 interactive algorithm visualizations with step-by-step animations and source code in C++, Java & Python</p>
    <div class="home-stats"><div class="stat-item"><div class="stat-value">20</div><div class="stat-label">Algorithms</div></div>
    <div class="stat-item"><div class="stat-value">7</div><div class="stat-label">Categories</div></div>
    <div class="stat-item"><div class="stat-value">3</div><div class="stat-label">Languages</div></div></div></div>`;
  const cats = window.AlgoVista.categories;
  for (const cat in cats) {
    const algos = cats[cat].algos;
    html += `<div class="category-section"><div class="category-header"><span class="cat-icon">${cats[cat].icon}</span><h2>${cat}</h2><span class="cat-count">${algos.length}</span></div><div class="algo-cards-grid">`;
    algos.forEach(a => {
      const tags = (a.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
      html += `<div class="algo-card" onclick="navigate('${a.id}')"><div class="algo-card-icon">${a.icon||'📌'}</div><h3>${a.name}</h3><p>${a.shortDesc||a.description||''}</p><div class="algo-card-tags">${tags}</div></div>`;
    });
    html += '</div></div>';
  }
  view.innerHTML = html;
}

/* ===== SEARCH ===== */
document.getElementById('search-input').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('.nav-item[data-route]').forEach(el => {
    if (el.dataset.route === 'home') return;
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.algo-card').forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

/* ===== NAVIGATION ===== */
function navigate(id) {
  stopPlaying();
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.route === id));
  const homeView = document.getElementById('home-view');
  const algoView = document.getElementById('algo-view');
  const bc = document.getElementById('breadcrumb');
  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');

  if (id === 'home') {
    homeView.style.display = '';
    algoView.classList.remove('active');
    bc.innerHTML = '<span class="current">Home</span>';
    currentAlgo = null;
    window.location.hash = '';
    return;
  }
  const algo = window.AlgoVista.algorithms[id];
  if (!algo) return;
  currentAlgo = algo;
  homeView.style.display = 'none';
  algoView.classList.add('active');
  bc.innerHTML = `<span onclick="navigate('home')" style="cursor:pointer">Home</span><span class="sep">›</span><span class="current">${algo.name}</span>`;
  document.getElementById('algo-title').textContent = algo.name;
  document.getElementById('algo-desc').textContent = algo.description || '';
  // How it works
  const howEl = document.getElementById('algo-how');
  if (algo.howItWorks && algo.howItWorks.length) {
    const stepsHtml = algo.howItWorks.map((s, i) => `<div class="how-step"><span class="how-num">${i+1}.</span><span>${s}</span></div>`).join('');
    howEl.innerHTML = `<div class="how-label" onclick="this.nextElementSibling.classList.toggle('open')">▸ How it works</div><div class="how-steps">${stepsHtml}</div>`;
  } else { howEl.innerHTML = ''; }
  const badges = document.getElementById('complexity-badges');
  badges.innerHTML = algo.timeComplexity ? `<span class="badge time">⏱ ${algo.timeComplexity}</span><span class="badge space">💾 ${algo.spaceComplexity||'O(1)'}</span>` : '';
  buildInputPanel(algo);
  buildCodePanel();
  steps = []; currentStep = -1;
  document.getElementById('step-desc').textContent = 'Configure input and press ▶ Play or Step →';
  document.getElementById('step-counter').textContent = '';
  resizeCanvas();
  if (algo.init) algo.init(ctx, canvas);
  window.location.hash = id;
}

/* ===== INPUT PANEL ===== */
function buildInputPanel(algo) {
  const panel = document.getElementById('input-panel');
  let html = '';
  (algo.inputs || []).forEach(inp => {
    if (inp.type === 'select') {
      const opts = inp.options.map(o => `<option value="${o.value}" ${o.value===inp.default?'selected':''}>${o.label}</option>`).join('');
      html += `<div class="input-group"><label>${inp.label}</label><select id="inp-${inp.id}">${opts}</select></div>`;
    } else {
      html += `<div class="input-group"><label>${inp.label}</label><input type="${inp.type||'text'}" id="inp-${inp.id}" value="${inp.default||''}" placeholder="${inp.placeholder||''}"></div>`;
    }
  });
  html += '<button class="btn btn-primary" onclick="runAlgorithm()">▶ Run</button>';
  html += '<button class="btn btn-secondary" onclick="generateRandom()">🎲 Random</button>';
  html += '<button class="btn btn-secondary" onclick="resetViz()">↺ Reset</button>';
  panel.innerHTML = html;
}
function getInputValues() {
  const vals = {};
  if (!currentAlgo) return vals;
  (currentAlgo.inputs || []).forEach(inp => {
    const el = document.getElementById('inp-' + inp.id);
    if (el) vals[inp.id] = el.value;
  });
  return vals;
}
function generateRandom() {
  if (currentAlgo && currentAlgo.randomize) {
    currentAlgo.randomize();
    runAlgorithm();
  }
}

/* ===== RUN & ANIMATION ===== */
function runAlgorithm() {
  if (!currentAlgo) return;
  stopPlaying();
  const vals = getInputValues();
  try {
    steps = currentAlgo.generateSteps(vals);
  } catch(e) {
    showToast('Invalid input: ' + e.message, 'error');
    return;
  }
  if (!steps || !steps.length) { showToast('No steps generated', 'error'); return; }
  currentStep = 0;
  renderStep();
  autoPlayTimer = setTimeout(() => startPlaying(), 300);
}
function renderStep() {
  if (!currentAlgo || !steps.length) return;
  const step = steps[currentStep];
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const theme = document.documentElement.getAttribute('data-theme');
  currentAlgo.render(ctx, canvas, step, theme);
  document.getElementById('step-desc').textContent = step.description || '';
  document.getElementById('step-counter').textContent = `Step ${currentStep + 1} / ${steps.length}`;
  highlightCodeLine(step.codeLine);
}
function stepForward() {
  if (currentStep < steps.length - 1) { currentStep++; renderStep(); }
  else stopPlaying();
}
function stepBackward() { if (currentStep > 0) { currentStep--; renderStep(); } }
function goFirst() { if (steps.length) { currentStep = 0; renderStep(); } }
function goLast() { if (steps.length) { currentStep = steps.length - 1; renderStep(); } }
function togglePlay() {
  if (steps.length === 0) { runAlgorithm(); if (!steps.length) return; }
  if (playing) { stopPlaying(); } else { startPlaying(); }
}
function startPlaying() {
  playing = true;
  document.getElementById('btn-play').textContent = '⏸';
  const speed = getSpeed();
  playTimer = setInterval(() => {
    if (currentStep < steps.length - 1) { currentStep++; renderStep(); }
    else stopPlaying();
  }, 1000 / speed);
}
function stopPlaying() {
  playing = false;
  document.getElementById('btn-play').textContent = '▶';
  if (playTimer) { clearInterval(playTimer); playTimer = null; }
  if (autoPlayTimer) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
}
function getSpeed() {
  const v = parseInt(document.getElementById('speed-slider').value);
  return v * 0.5;
}
function resetViz() {
  stopPlaying(); steps = []; currentStep = -1;
  resizeCanvas(); ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('step-desc').textContent = 'Configure input and press ▶ Play or Step →';
  document.getElementById('step-counter').textContent = '';
}

/* ===== CANVAS ===== */
function resizeCanvas() {
  const container = document.getElementById('canvas-container');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/* ===== CODE PANEL ===== */
function buildCodePanel() {
  currentLang = 'cpp';
  document.querySelectorAll('.code-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === 'cpp'));
  renderCode();
}
function renderCode() {
  if (!currentAlgo) return;
  const src = currentAlgo.sourceCode && currentAlgo.sourceCode[currentLang];
  const container = document.getElementById('code-content');
  if (!src) { container.innerHTML = '<div style="padding:16px;color:var(--text-muted)">No source code available</div>'; return; }
  const lines = src.split('\n');
  container.innerHTML = lines.map((line, i) =>
    `<div class="code-line" data-line="${i}"><span class="code-line-num">${i + 1}</span><span class="code-line-text">${highlightSyntax(line, currentLang)}</span></div>`
  ).join('');
}
function highlightCodeLine(lineNum) {
  document.querySelectorAll('.code-line').forEach(el => el.classList.remove('active'));
  if (lineNum !== undefined && lineNum !== null) {
    const el = document.querySelector(`.code-line[data-line="${lineNum}"]`);
    if (el) { el.classList.add('active'); el.scrollIntoView({ block: 'nearest' }); }
  }
}
function highlightSyntax(line, lang) {
  // Escape HTML
  let s = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Store tokens with unique markers
  const tokens = [];
  function store(match, cls) {
    const idx = tokens.length;
    tokens.push('<span class="syn-' + cls + '">' + match + '</span>');
    return '%%TOK' + idx + '%%';
  }
  // Comments (highest priority - remove from further processing)
  if (lang==='python') s = s.replace(/(#.*)$/, function(m){ return store(m,'cmt'); });
  else s = s.replace(/(\/\/.*)$/, function(m){ return store(m,'cmt'); });
  // Strings
  s = s.replace(/("(?:[^"\\]|\\.)*")/g, function(m){ return store(m,'str'); });
  s = s.replace(/('(?:[^'\\]|\\.)*')/g, function(m){ return store(m,'str'); });
  // Keywords
  const kwPat = lang==='python'
    ? /\b(def|class|if|elif|else|for|while|return|import|from|in|not|and|or|True|False|None|break|continue|pass|lambda|yield|try|except|finally|raise|with|as|is|global|nonlocal|assert|del|print|range|len|self|append|pop|int|float|str|list|dict|set|tuple)\b/g
    : /\b(int|void|char|bool|float|double|long|string|return|if|else|for|while|do|switch|case|break|continue|class|public|private|static|new|null|nullptr|true|false|this|const|auto|struct|typedef|include|using|namespace|std|vector|queue|stack|priority_queue|map|set|pair|cout|cin|endl|printf|scanf|System|out|println|import|throws|extends|implements)\b/g;
  s = s.replace(kwPat, function(m){ return store(m,'kw'); });
  // Numbers
  s = s.replace(/\b(\d+)\b/g, function(m){ return store(m,'num'); });
  // Restore all tokens
  for (let i = 0; i < tokens.length; i++) {
    s = s.replace('%%TOK' + i + '%%', tokens[i]);
  }
  return s;
}

/* ===== CODE TABS ===== */
document.getElementById('code-tabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.code-tab');
  if (tab && tab.dataset.lang) {
    currentLang = tab.dataset.lang;
    document.querySelectorAll('.code-tab').forEach(t => t.classList.toggle('active', t === tab));
    renderCode();
  }
});
document.getElementById('code-copy').addEventListener('click', function() {
  if (!currentAlgo || !currentAlgo.sourceCode) return;
  const src = currentAlgo.sourceCode[currentLang] || '';
  navigator.clipboard.writeText(src).then(() => showToast('Code copied!', 'success')).catch(() => showToast('Copy failed', 'error'));
});

/* ===== TOAST ===== */
function showToast(msg, type) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast ' + (type||'');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
}

/* ===== CONTROLS ===== */
document.getElementById('btn-play').addEventListener('click', togglePlay);
document.getElementById('btn-next').addEventListener('click', stepForward);
document.getElementById('btn-prev').addEventListener('click', stepBackward);
document.getElementById('btn-first').addEventListener('click', goFirst);
document.getElementById('btn-last').addEventListener('click', goLast);
document.getElementById('speed-slider').addEventListener('input', function() {
  const sp = getSpeed();
  document.getElementById('speed-value').textContent = sp + 'x';
  if (playing) { stopPlaying(); startPlaying(); }
});
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active');
});
document.getElementById('sidebar-overlay').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
});
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

/* ===== SIDEBAR COLLAPSE ===== */
document.getElementById('sidebar-collapse').addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.add('collapsed');
  document.querySelector('.main-content').style.marginLeft = 'var(--sidebar-collapsed-width)';
  // resize canvas after sidebar transition
  setTimeout(() => { if (currentAlgo && steps.length) renderStep(); }, 350);
});

/* ===== PANEL RESIZER (drag to resize code panel) ===== */
(function() {
  const resizer = document.getElementById('panel-resizer');
  const codePanel = document.getElementById('code-panel');
  if (!resizer || !codePanel) return;
  let isResizing = false, startX = 0, startW = 0;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startW = codePanel.offsetWidth;
    resizer.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const dx = startX - e.clientX;
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    codePanel.style.width = newW + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    resizer.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // re-render canvas after resize
    if (currentAlgo && steps.length) renderStep();
  });
})();

window.addEventListener('resize', () => { if (currentAlgo && steps.length) renderStep(); });

/* ===== DRAWING HELPERS ===== */
function getColors(theme) {
  const dark = theme === 'dark';
  return {
    text: dark ? '#f0f4f8' : '#1e293b',
    textMuted: dark ? '#64748b' : '#94a3b8',
    bg: dark ? '#0d1117' : '#ffffff',
    bar: dark ? '#334155' : '#cbd5e1',
    compare: '#f59e0b',
    swap: '#ef4444',
    sorted: '#10b981',
    active: '#00d4ff',
    found: '#10b981',
    visited: '#7b2ff7',
    current: '#00d4ff',
    highlight: '#ff2d55',
    node: dark ? '#1e293b' : '#e2e8f0',
    nodeBorder: dark ? '#475569' : '#94a3b8',
    edge: dark ? '#475569' : '#94a3b8',
    accent1: '#00d4ff',
    accent2: '#7b2ff7',
    accent3: '#ff2d55',
  };
}
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}
function drawArrow(ctx, x1, y1, x2, y2, color, headLen) {
  headLen = headLen || 10;
  const angle = Math.atan2(y2-y1,x2-x1);
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(x2,y2);
  ctx.lineTo(x2-headLen*Math.cos(angle-Math.PI/6),y2-headLen*Math.sin(angle-Math.PI/6));
  ctx.lineTo(x2-headLen*Math.cos(angle+Math.PI/6),y2-headLen*Math.sin(angle+Math.PI/6));
  ctx.closePath(); ctx.fill();
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.getElementById('speed-value').textContent = getSpeed() + 'x';
  // Set up expand button (already in HTML)
  const expandBtn = document.getElementById('sidebar-expand');
  expandBtn.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('collapsed');
    document.querySelector('.main-content').style.marginLeft = '';
    setTimeout(() => { if (currentAlgo && steps.length) renderStep(); }, 350);
  });
  // wait for all algorithm scripts to load
  setTimeout(() => {
    buildSidebar();
    buildHome();
    // Card mouse-follow glow effect
    document.addEventListener('mousemove', (e) => {
      document.querySelectorAll('.algo-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100) + '%';
        const y = ((e.clientY - rect.top) / rect.height * 100) + '%';
        card.style.setProperty('--mouse-x', x);
        card.style.setProperty('--mouse-y', y);
      });
    });
    // handle hash routing
    const hash = window.location.hash.replace('#','');
    if (hash && window.AlgoVista.algorithms[hash]) navigate(hash);
  }, 50);
});
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#','');
  if (hash) navigate(hash); else navigate('home');
});
