/* ════════════════════════════════
   FIREWORKS
════════════════════════════════ */
var _fwCanvas, _fwCtx, _fwParts, _fwFrame;

function startFireworks() {
  _fwCanvas = document.getElementById('fireworks-canvas');
  _fwCanvas.style.display = 'block';
  _fwCanvas.width  = window.innerWidth;
  _fwCanvas.height = window.innerHeight;
  _fwCtx   = _fwCanvas.getContext('2d');
  _fwParts = [];
  for (var b = 0; b < 6; b++)
    (function (d) { setTimeout(burst, d); })(b * 300);
  animateFW();
}

function burst() {
  var cx  = Math.random() * _fwCanvas.width;
  var cy  = _fwCanvas.height * 0.2 + Math.random() * _fwCanvas.height * 0.4;
  var col = ['#f43f5e','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#fff'];
  for (var i = 0; i < 90; i++) {
    var ang = Math.PI * 2 * i / 90;
    var spd = 2 + Math.random() * 5;
    _fwParts.push({ x:cx, y:cy, vx:Math.cos(ang)*spd, vy:Math.sin(ang)*spd,
      alpha:1, color:col[Math.floor(Math.random()*col.length)], size:3+Math.random()*4 });
  }
}

function animateFW() {
  _fwCtx.clearRect(0, 0, _fwCanvas.width, _fwCanvas.height);
  _fwParts = _fwParts.filter(function (p) { return p.alpha > 0.02; });
  _fwParts.forEach(function (p) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.98; p.alpha -= 0.016;
    _fwCtx.globalAlpha = p.alpha;
    _fwCtx.fillStyle   = p.color;
    _fwCtx.beginPath();
    _fwCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    _fwCtx.fill();
  });
  _fwCtx.globalAlpha = 1;
  _fwFrame = requestAnimationFrame(animateFW);
}

function stopFireworks() {
  if (_fwFrame)  cancelAnimationFrame(_fwFrame);
  if (_fwCanvas) _fwCanvas.style.display = 'none';
  _fwParts = [];
}
