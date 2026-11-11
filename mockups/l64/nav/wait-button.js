(function (w, d) {
  var st = d.createElement('style');
  st.textContent = '@keyframes cw-btn-breathe{0%,100%{transform:scale(1);box-shadow:0 0 0 0 color-mix(in srgb,var(--brand,#5b4bc4) 45%,transparent)}50%{transform:scale(1.03);box-shadow:0 0 0 10px color-mix(in srgb,var(--brand,#5b4bc4) 0%,transparent)}}' +
    '@keyframes cw-btn-glow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}' +
    'button.cw-btn-wait,button.cw-btn-wait[disabled]{opacity:1;border-radius:999px;animation:cw-btn-breathe 1.8s ease-in-out infinite}' +
    '@media (prefers-reduced-motion: reduce){button.cw-btn-wait,button.cw-btn-wait[disabled]{animation:cw-btn-glow 2.4s ease-in-out infinite}}';
  (d.head || d.documentElement).appendChild(st);
  var SIGN_UP = ['Creating your account…', 'Building…', 'Humming along…'];
  var SIGN_IN = ['Signing into your account…', 'Updating…', 'Humming along…'];
  var page = String(w.location.pathname || '');
  function listFor(b) {
    if (/\/signup\//.test(page) && b.id === 'verify') { return SIGN_UP; }
    if (/\/signin\//.test(page) && b.id === 'create') { return SIGN_UP; }
    if (/\/signin\//.test(page) && b.id === 'verify') { return SIGN_IN; }
    return null;
  }
  function watch(b) {
    var list = listFor(b);
    if (!list) { return; }
    var i = 0, timer = null, mine = null, pageText = b.textContent;
    function show() { mine = list[Math.min(i, list.length - 1)]; if (b.textContent !== mine) { b.textContent = mine; } }
    function step() {
      timer = null;
      if (!b.disabled) { stop(); return; }
      i++; show();
      if (i < list.length - 1) { timer = setTimeout(step, 5000); }
    }
    function stop() {
      clearTimeout(timer); timer = null;
      if (mine !== null && b.textContent === mine) { b.textContent = pageText; }
      mine = null; i = 0;
      b.classList.remove('cw-btn-wait');
    }
    function check() {
      if (b.textContent !== mine) { pageText = b.textContent; }
      if (b.disabled) {
        b.classList.add('cw-btn-wait');
        if (mine === null) { i = 0; show(); timer = setTimeout(step, 5000); }
        else if (b.textContent !== mine) { show(); }
      } else if (mine !== null) { stop(); }
    }
    new MutationObserver(check).observe(b, { attributes: true, attributeFilter: ['disabled'], childList: true, characterData: true, subtree: true });
  }
  function go() { Array.prototype.forEach.call(d.querySelectorAll('button'), watch); }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', go); } else { go(); }
})(window, document);
