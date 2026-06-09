const fs = require('fs');
const src = fs.readFileSync('dual-tri-mode.html', 'utf8');

// ---- 1. CSS (both <style> blocks) ----
const css = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

// ---- 2. Panels ----
const vyveStart = src.indexOf('<div class="kb-panel kb-ws-vyve" data-workspace="vyve">');
const bizText = src.indexOf('BUSINESS WORKSPACE');
const bizComment = src.lastIndexOf('<!--', bizText);
let vyvePanel = src.slice(vyveStart, bizComment).trim()
  .replace('class="kb-panel kb-ws-vyve" data-workspace="vyve"', 'class="kb-panel kb-ws-vyve active" data-workspace="vyve"');

const trumanStart = src.indexOf('<div class="kb-panel kb-ws-truman" data-workspace="truman">');
const trumanMainClose = src.indexOf('</main>', trumanStart);
let trumanPanel = src.slice(trumanStart, trumanMainClose).trim()
  .replace('class="kb-panel kb-ws-truman" data-workspace="truman"', 'class="kb-panel kb-ws-truman active" data-workspace="truman"');

// ---- 3. JS chunks by marker ----
function chunk(marker) {
  const s = src.indexOf(marker);
  if (s < 0) return '';
  let e1 = src.indexOf('// ===', s + marker.length);
  let e2 = src.indexOf('</script>', s + marker.length);
  const e = Math.min(e1 < 0 ? Infinity : e1, e2 < 0 ? Infinity : e2);
  return src.slice(s, e === Infinity ? undefined : e).trim();
}
const jsLightbox = chunk('// === LIGHTBOX ===');
const jsAction   = chunk('// === KB-WS-ACTION buttons');
const jsGoto     = chunk('// === Action button: goto-album');
const jsTabs     = chunk('// === VYVE: category tabs');
const jsAccord   = chunk('// === TRUMAN: script accordion ===');
const jsEleven   = chunk('// === TRUMAN: ElevenLabs settings copy ===');
const jsTrumanQA = chunk('// === TRUMAN: quick action handlers ===');

const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">`;

const lightboxHTML = `<div id="kbLightbox" class="kb-lightbox">
  <button class="kb-lightbox-close" data-lightbox-close>✕ CLOSE</button>
  <img id="kbLightboxImg" src="" alt="">
</div>`;

function page(opts) {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${opts.title}</title>
${fonts}
<style>
${css}
/* standalone tweaks */
.kb-shell{ grid-template-columns:1fr !important; }
/* mobile: prevent horizontal overflow / force-zoom issue */
html,body{ overflow-x:hidden; }
.kb-main{ overflow-x:hidden; max-width:100vw; }
</style>
</head>
<body class="mode-kb ${opts.bodyClass}">

<nav class="nav">
  <div class="nav-left">
    <a href="#" class="nav-logo"><span class="dot"></span>DUAL TRACK.</a>
    <span class="nav-tag">${opts.navTag}</span>
  </div>
</nav>

<div class="kb-shell">
  <main class="kb-main">
${opts.panel}
  </main>
</div>

${lightboxHTML}

<script>
${opts.js}
</script>
</body>
</html>`;
}

// VYVE
fs.writeFileSync('vyve.html', page({
  title: 'VYVE WANG — DUAL TRACK ENTERTAINMENT',
  bodyClass: 'vyve-active',
  navTag: 'VYVE WANG · IP02 · 虛擬 DJ / Model / Dancer',
  panel: vyvePanel,
  js: [jsLightbox, jsAction, jsGoto, jsTabs].join('\n\n')
}));

// TRUMAN
fs.writeFileSync('truman.html', page({
  title: '王楚門 TRUMAN — DUAL TRACK ENTERTAINMENT',
  bodyClass: 'truman-active',
  navTag: '王楚門 TRUMAN · IP01 · 60 歲虛擬大叔',
  panel: trumanPanel,
  js: [jsLightbox, jsAccord, jsEleven, jsTrumanQA].join('\n\n')
}));

console.log('vyve.html: ' + (fs.statSync('vyve.html').size/1024).toFixed(0) + ' KB');
console.log('truman.html: ' + (fs.statSync('truman.html').size/1024).toFixed(0) + ' KB');
console.log('css len: ' + css.length + ', vyvePanel: ' + vyvePanel.length + ', trumanPanel: ' + trumanPanel.length);
console.log('js chunks: lightbox=' + jsLightbox.length + ' action=' + jsAction.length + ' goto=' + jsGoto.length + ' tabs=' + jsTabs.length + ' accord=' + jsAccord.length + ' eleven=' + jsEleven.length + ' trumanQA=' + jsTrumanQA.length);
