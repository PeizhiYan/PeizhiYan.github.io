/* ── Board geometry ── */
var CELL = 30, PAD = 30, S = 480, SR = 13, LINES = 15;
var COLS = 'ABCDEFGHJKLMNOP'; /* 15 chars, skip I */

/* ── Canvas game state ── */
var _insightOn = false;
var _over      = false;
var _lastMove  = null;
var _hover     = null;
var _history   = []; /* [[i,j], ...] alternating human, AI moves */
var _thinking  = false;

/* ════════════════════════════════
   RENDERING
════════════════════════════════ */

function render() {
  var canvas = document.getElementById('game-canvas');
  var dpr    = window.devicePixelRatio || 1;
  var ctx    = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawBg(ctx);
  drawGrid(ctx);
  if (_insightOn) drawInsight(ctx);
  drawStones(ctx);
  if (_hover && !_over && current === 1) drawGhost(ctx, _hover[0], _hover[1]);
}

function drawBg(ctx) {
  /* Warm wood base */
  var base = ctx.createLinearGradient(0, 0, 0, S);
  base.addColorStop(0,   '#dba84a');
  base.addColorStop(0.4, '#c8922e');
  base.addColorStop(1,   '#b07820');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  /* Diagonal sheen */
  var sheen = ctx.createLinearGradient(0, 0, S * 0.7, S);
  sheen.addColorStop(0,   'rgba(255,225,140,0.10)');
  sheen.addColorStop(0.4, 'rgba(0,0,0,0.04)');
  sheen.addColorStop(1,   'rgba(255,225,140,0.07)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, S, S);

  /* Top-left light source */
  var lt = ctx.createRadialGradient(S*0.08, S*0.08, 0, S*0.35, S*0.35, S*0.7);
  lt.addColorStop(0, 'rgba(255,235,160,0.14)');
  lt.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lt;
  ctx.fillRect(0, 0, S, S);

  /* Edge vignette */
  var vig = ctx.createRadialGradient(S/2, S/2, S*0.22, S/2, S/2, S*0.78);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, S, S);
}

function drawGrid(ctx) {
  var end = PAD + (LINES - 1) * CELL;

  /* Grid lines */
  ctx.strokeStyle = 'rgba(0,0,0,0.46)';
  ctx.lineWidth   = 0.75;
  for (var k = 0; k < LINES; k++) {
    var p = PAD + k * CELL;
    ctx.beginPath(); ctx.moveTo(PAD, p); ctx.lineTo(end, p); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p, PAD); ctx.lineTo(p, end); ctx.stroke();
  }

  /* Outer border (thicker) */
  ctx.lineWidth   = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.58)';
  ctx.strokeRect(PAD, PAD, (LINES - 1) * CELL, (LINES - 1) * CELL);

  /* Star points */
  var stars = [[3,3],[3,11],[7,7],[11,3],[11,11]];
  ctx.fillStyle = 'rgba(0,0,0,0.60)';
  for (var s = 0; s < stars.length; s++) {
    ctx.beginPath();
    ctx.arc(PAD + stars[s][1]*CELL, PAD + stars[s][0]*CELL, 3.6, 0, Math.PI*2);
    ctx.fill();
  }

  /* Coordinate labels */
  ctx.fillStyle    = 'rgba(0,0,0,0.36)';
  ctx.font         = '9px Outfit, sans-serif';
  ctx.textBaseline = 'middle';
  for (var k = 0; k < LINES; k++) {
    var p = PAD + k * CELL;
    ctx.textAlign = 'center';
    ctx.fillText(COLS[k], p, PAD - 13);
    ctx.textAlign = 'right';
    ctx.fillText(15 - k, PAD - 7, p);
  }
}

function drawInsight(ctx) {
  if (!value_human) return;
  var maxV = 0;
  for (var i = 0; i < LINES; i++)
    for (var j = 0; j < LINES; j++)
      if (value_human[i][j] > maxV) maxV = value_human[i][j];
  if (maxV <= 0) return;

  /* First pass — wide soft aura */
  for (var i = 0; i < LINES; i++) {
    for (var j = 0; j < LINES; j++) {
      if (!board || board[i][j] !== 0) continue;
      var v = value_human[i][j];
      if (v <= 0) continue;
      var t  = v / maxV;
      var px = PAD + j * CELL, py = PAD + i * CELL;
      var r, g, b;
      if (t < 0.5) {
        var u = t * 2;
        r = Math.round(60  + 195 * u);
        g = Math.round(110 + 100 * u);
        b = Math.round(230 - 230 * u);
      } else {
        var u = (t - 0.5) * 2;
        r = 255; g = Math.round(210 - 180 * u); b = 0;
      }
      var auraR = CELL * (0.9 + 0.7 * t);
      var aura  = ctx.createRadialGradient(px, py, 0, px, py, auraR);
      aura.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',' + (0.18 + 0.22*t).toFixed(2) + ')');
      aura.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.08 + 0.10*t).toFixed(2) + ')');
      aura.addColorStop(1,   'rgba(' + r + ',' + g + ',' + b + ',0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(px, py, auraR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Second pass — sharp core dot at high-value intersections */
  for (var i = 0; i < LINES; i++) {
    for (var j = 0; j < LINES; j++) {
      if (!board || board[i][j] !== 0) continue;
      var v = value_human[i][j];
      if (v <= 0) continue;
      var t  = v / maxV;
      if (t < 0.25) continue; /* only show core for meaningful cells */
      var px = PAD + j * CELL, py = PAD + i * CELL;
      var r, g, b;
      if (t < 0.5) {
        var u = t * 2;
        r = Math.round(60  + 195 * u);
        g = Math.round(110 + 100 * u);
        b = Math.round(230 - 230 * u);
      } else {
        var u = (t - 0.5) * 2;
        r = 255; g = Math.round(210 - 180 * u); b = 0;
      }
      var coreR = CELL * 0.22 * t;
      var core  = ctx.createRadialGradient(px, py, 0, px, py, coreR);
      core.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (0.85 + 0.15*t).toFixed(2) + ')');
      core.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(px, py, coreR, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawStones(ctx) {
  if (!board) return;
  for (var i = 0; i < LINES; i++)
    for (var j = 0; j < LINES; j++)
      if (board[i][j] !== 0) {
        var isLast = _lastMove && _lastMove[0]===i && _lastMove[1]===j;
        paintStone(ctx, PAD+j*CELL, PAD+i*CELL, SR, board[i][j]===1, isLast);
      }
}

function drawGhost(ctx, i, j) {
  ctx.globalAlpha = 0.38;
  paintStone(ctx, PAD+j*CELL, PAD+i*CELL, SR, true, false);
  ctx.globalAlpha = 1;
}

function paintStone(ctx, px, py, r, isBlack, isLast) {
  var hx = px - r * 0.30;
  var hy = py - r * 0.30;

  /* Drop shadow */
  ctx.save();
  ctx.shadowColor    = 'rgba(0,0,0,0.44)';
  ctx.shadowBlur     = 10;
  ctx.shadowOffsetX  = 2.5;
  ctx.shadowOffsetY  = 3.5;

  /* Stone body — radial gradient offset for 3D look */
  var body = ctx.createRadialGradient(hx, hy, r*0.02, px+r*0.08, py+r*0.12, r*1.08);
  if (isBlack) {
    body.addColorStop(0,    '#727272');
    body.addColorStop(0.38, '#2e2e2e');
    body.addColorStop(1,    '#000000');
  } else {
    body.addColorStop(0,    '#ffffff');
    body.addColorStop(0.45, '#f0f0f0');
    body.addColorStop(0.82, '#d8d8d8');
    body.addColorStop(1,    '#b8b8b8');
  }
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI*2);
  ctx.fillStyle = body;
  ctx.fill();
  ctx.restore(); /* clear shadow before specular */

  /* Specular highlight */
  var spec = ctx.createRadialGradient(hx, hy, 0, hx, hy, r*0.72);
  spec.addColorStop(0, 'rgba(255,255,255,' + (isBlack ? 0.52 : 0.76) + ')');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI*2);
  ctx.fillStyle = spec;
  ctx.fill();

  /* White stone outline */
  if (!isBlack) {
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(0,0,0,0.14)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();
  }

  /* Last-move red marker */
  if (isLast) {
    ctx.beginPath();
    ctx.arc(px, py, r * 0.21, 0, Math.PI*2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  }
}

/* ── Status bar ── */
function setStatus(dotClass, msg) {
  document.getElementById('status-dot').className  = 'stone-dot ' + dotClass;
  document.getElementById('status-text').textContent = msg;
}

/* ── Board scaling ── */
function scaleBoard() {
  var wrapper = document.querySelector('.board-wrapper');
  var inner   = document.querySelector('.board-inner');
  var avail   = wrapper.clientWidth - 32;
  var s       = Math.min(1, avail / S);
  inner.style.transform    = 'scale(' + s + ')';
  inner.style.marginBottom = '-' + Math.round(S * (1 - s)) + 'px';
  inner.style.marginLeft   = Math.round((avail - S*s) / 2) + 'px';
}
window.addEventListener('resize', scaleBoard);

/* ── Undo button state ── */
function updateUndoButton() {
  document.getElementById('undo-btn').disabled = _thinking || _history.length === 0;
}

/* ── AI Insight toggle ── */
function toggleInsight() {
  _insightOn = !_insightOn;
  render();
  updateInsightStats();
  var btn = document.getElementById('insight-btn');
  if (_insightOn) { btn.classList.remove('secondary'); btn.classList.add('active-insight'); }
  else            { btn.classList.remove('active-insight'); btn.classList.add('secondary'); }
}

/* ── Board-value readout (shown while AI Insight is on) ── */
function updateInsightStats() {
  var el = document.getElementById('insight-stats');
  if (!_insightOn || !board_ai) { el.classList.remove('show'); return; }
  var aiV  = boardValue(board_ai);
  var youV = boardValue(board);
  document.getElementById('insight-stats-text').textContent =
    'Board value: AI: ' + aiV.toLocaleString() +
    '  |  You: ' + youV.toLocaleString();
  el.classList.add('show');
}

/* ════════════════════════════════
   GAME LOGIC OVERRIDES
   (DOMContentLoaded fires before
   body onload — overrides are
   in place when start() runs)
════════════════════════════════ */
window.addEventListener('DOMContentLoaded', function () {

  /* Override print() */
  window.print = function (msg) {
    if (msg === 'You win!')  { setStatus('black', 'You win! '); showPopup(true);  return; }
    if (msg === 'You lose!') { setStatus('white', 'You lose!');  showPopup(false); return; }
    setStatus('none', msg);
  };

  /* Override insight_show_hide() — toggleInsight() handles everything */
  window.insight_show_hide = function () {};

  /* Set canvas physical resolution for crisp rendering on HiDPI screens */
  (function () {
    var canvas = document.getElementById('game-canvas');
    var dpr    = window.devicePixelRatio || 1;
    canvas.width  = S * dpr;
    canvas.height = S * dpr;
  })();

  /* Override start() */
  window.start = function () {
    board = []; board_ai = []; value = []; value_human = [];
    current   = 1;
    _over     = false;
    _lastMove = null;
    _hover    = null;
    _history  = [];
    _thinking = false;
    _insightOn = false;
    var btn = document.getElementById('insight-btn');
    btn.classList.remove('active-insight'); btn.classList.add('secondary');
    updateUndoButton();

    for (var i = 0; i < LINES; i++) {
      board[i] = []; board_ai[i] = []; value[i] = []; value_human[i] = [];
      for (var j = 0; j < LINES; j++)
        board[i][j] = board_ai[i][j] = value[i][j] = value_human[i][j] = 0;
    }
    computeValue();
    render();
    updateInsightStats();
    setStatus('black', 'Your turn — place a black stone');
    document.getElementById('start').textContent = 'Re-start';
  };

  /* Override clk() */
  window.clk = function (i, j) {
    if (_over || current !== 1 || _thinking) return;
    if (board[i][j] !== 0) return;

    board[i][j]    =  1;
    board_ai[i][j] = -1;
    current        = -1;
    _lastMove      = [i, j];
    _history.push([i, j]);
    render();
    updateUndoButton();
    updateInsightStats();

    /* Check human win */
    var fw = count(conv2d(board, filter1a), 5) + count(conv2d(board, filter2a), 5)
           + count(conv2d(board, filter3a), 5) + count(conv2d(board, filter4a), 5);
    if (fw > 0) { _over = true; setStatus('black', 'You win!'); showPopup(true); return; }

    setStatus('white', 'AI is thinking…');
    _thinking = true;
    updateUndoButton();

    setTimeout(function () {
      computeValue();

      /* Find highest-value empty cell */
      var maxVal = -Infinity, ai_i = 7, ai_j = 7;
      for (var a = 0; a < LINES; a++)
        for (var b = 0; b < LINES; b++)
          if (value[a][b] > maxVal) { maxVal = value[a][b]; ai_i = a; ai_j = b; }

      board[ai_i][ai_j]    = -1;
      board_ai[ai_i][ai_j] =  1;
      current              =  1;
      _lastMove            = [ai_i, ai_j];
      _history.push([ai_i, ai_j]);
      _thinking            = false;
      updateUndoButton();

      /* Check AI win */
      var fa = count(conv2d(board_ai, filter1a), 5) + count(conv2d(board_ai, filter2a), 5)
             + count(conv2d(board_ai, filter3a), 5) + count(conv2d(board_ai, filter4a), 5);
      if (fa > 0) {
        _over = true;
        computeValue(); render(); updateInsightStats();
        setStatus('white', 'You lose!'); showPopup(false); return;
      }

      computeValue();
      render();
      updateInsightStats();
      setStatus('black', 'Your turn — place a black stone');
    }, 20);
  };

  /* Undo the last full turn (AI's move + the human move before it) */
  window.undo = function () {
    if (_thinking || _history.length === 0) return;

    if (_over) { _over = false; closePopup(); }

    var pairs = _history.length >= 2 ? 2 : 1;
    for (var p = 0; p < pairs; p++) {
      var mv = _history.pop();
      board[mv[0]][mv[1]]    = 0;
      board_ai[mv[0]][mv[1]] = 0;
    }

    current   = 1;
    _lastMove = _history.length ? _history[_history.length - 1] : null;
    computeValue();
    render();
    updateInsightStats();
    setStatus('black', 'Your turn — place a black stone');
    updateUndoButton();
  };

  /* Canvas click → grid */
  var canvas = document.getElementById('game-canvas');
  canvas.addEventListener('click', function (e) {
    var rect = canvas.getBoundingClientRect();
    var cx = (e.clientX - rect.left) * (S / rect.width);
    var cy = (e.clientY - rect.top)  * (S / rect.height);
    var j  = Math.round((cx - PAD) / CELL);
    var i  = Math.round((cy - PAD) / CELL);
    if (i >= 0 && i < LINES && j >= 0 && j < LINES) clk(i, j);
  });

  /* Hover ghost stone */
  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var cx = (e.clientX - rect.left) * (S / rect.width);
    var cy = (e.clientY - rect.top)  * (S / rect.height);
    var j  = Math.round((cx - PAD) / CELL);
    var i  = Math.round((cy - PAD) / CELL);
    var nh = (i>=0 && i<LINES && j>=0 && j<LINES && board && board[i][j]===0) ? [i,j] : null;
    var changed = (!_hover && nh) || (_hover && !nh) ||
                  (_hover && nh && (_hover[0]!==nh[0] || _hover[1]!==nh[1]));
    _hover = nh;
    if (changed) render();
  });

  canvas.addEventListener('mouseleave', function () {
    if (_hover) { _hover = null; render(); }
  });
});

/* ════════════════════════════════
   POPUP
════════════════════════════════ */
function showPopup(isWin) {
  document.getElementById('popup-emoji').textContent    = isWin ? '🎉' : '😔';
  document.getElementById('popup-title').textContent    = isWin ? 'You Win!'  : 'You Lose!';
  document.getElementById('popup-subtitle').textContent = isWin
    ? 'Congratulations — you beat the AI!'
    : 'The AI wins this round. Try again!';
  document.getElementById('popup-title').style.color = isWin ? '#22c55e' : '#f43f5e';
  document.getElementById('popup-backdrop').classList.add('show');
  if (isWin) startFireworks();
}

function closePopup() {
  document.getElementById('popup-backdrop').classList.remove('show');
  stopFireworks();
}
