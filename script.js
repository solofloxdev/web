// Avatar canvas (right)
const avatarCanvas = document.getElementById('avatarCanvas');
const avatarCtx = avatarCanvas.getContext('2d');

// Left image canvas
const leftCanvas = document.getElementById('leftCanvas');
const leftCtx = leftCanvas.getContext('2d');
const leftImg = new Image();
leftImg.src = 'LOL.png';
let leftImgLoaded = false;
leftImg.onload = () => { leftImgLoaded = true; };
leftImg.onerror = () => { leftImgLoaded = false; };

let t = 0;

function resizeCanvasToDisplaySize(canvas, ctx) {
  const ratio = window.devicePixelRatio || 1;
  const style = getComputedStyle(canvas);
  const displayWidth = parseInt(style.width, 10) || canvas.width || 120;
  const displayHeight = parseInt(style.height, 10) || canvas.height || displayWidth;
  canvas.style.width = displayWidth + 'px';
  canvas.style.height = displayHeight + 'px';
  canvas.width = displayWidth * ratio;
  canvas.height = displayHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { w: displayWidth, h: displayHeight };
}

function drawAvatar(w, h) {
  const ctx = avatarCtx;
  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const hue = (t * 24) % 360;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, `hsl(${hue}, 70%, 45%)`);
  grad.addColorStop(1, `hsl(${(hue + 60) % 360}, 65%, 55%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + t * 0.5;
    const r = Math.min(w, h) * 0.22 + Math.sin(t + i) * 4;
    const x = w / 2 + Math.cos(a) * r;
    const y = h / 2 + Math.sin(a) * r;
    ctx.fillStyle = `rgba(255,255,255,${0.02 + 0.02 * Math.sin(t + i)})`;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - 4, 0, Math.PI * 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - 10, 0, Math.PI * 2);
  ctx.lineWidth = 14;
  ctx.strokeStyle = `rgba(255,255,255,${0.06 + 0.02 * Math.sin(t)})`;
  ctx.stroke();
}

function drawLeft(w, h) {
  const ctx = leftCtx;
  ctx.clearRect(0, 0, w, h);

  // rounded-rect path for clipping and stroke
  const r = Math.min(16, Math.floor(Math.min(w, h) * 0.06));
  const x = 0 + 4;
  const y = 0 + 4;
  const rw = w - 8;
  const rh = h - 8;

  ctx.save();
  // build rounded rect path
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + rw - r, y);
  ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
  ctx.lineTo(x + rw, y + rh - r);
  ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
  ctx.lineTo(x + r, y + rh);
  ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.clip();

  if (leftImgLoaded) {
    // cover behavior
    const iw = leftImg.width;
    const ih = leftImg.height;
    const scale = Math.max(rw / iw, rh / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = x + (rw - dw) / 2;
    const dy = y + (rh - dh) / 2;
    ctx.drawImage(leftImg, dx, dy, dw, dh);
  } else {
    // placeholder
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fillRect(x, y, rw, rh);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = Math.floor(Math.min(rw, rh) * 0.12) + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LOL', x + rw / 2, y + rh / 2);
  }

  ctx.restore();

  // draw rounded rect stroke outline
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + rw - r, y);
  ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
  ctx.lineTo(x + rw, y + rh - r);
  ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
  ctx.lineTo(x + r, y + rh);
  ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.stroke();
}

function onResize() {
  const a = resizeCanvasToDisplaySize(avatarCanvas, avatarCtx);
  const l = resizeCanvasToDisplaySize(leftCanvas, leftCtx);
  return { a, l };
}

function loop() {
  const { a, l } = onResize();
  drawAvatar(a.w, a.h);
  drawLeft(l.w, l.h);
  t += 0.03;
  requestAnimationFrame(loop);
}

window.addEventListener('resize', onResize);
onResize();
requestAnimationFrame(loop);
