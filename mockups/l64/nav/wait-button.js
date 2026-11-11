(function (w, d) {
  var st = d.createElement('style');
  st.textContent = '@keyframes cw-btn-breathe{0%,100%{opacity:1}50%{opacity:.6}}.cw-btn-wait{animation:cw-btn-breathe 1.6s ease-in-out infinite}@media (prefers-reduced-motion: reduce){.cw-btn-wait{animation:none}}';
  (d.head || d.documentElement).appendChild(st);
  function words() {
    var a = (w.CW_WAITING_WORDS || []).slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function watch(b) {
    var timer = null, mine = null, order = [], k = 0;
    function stop() { clearTimeout(timer); timer = null; mine = null; b.classList.remove('cw-btn-wait'); }
    function tick() {
      if (!b.disabled) { stop(); return; }
      if (mine !== null && b.textContent !== mine) { mine = null; timer = setTimeout(tick, 5000); return; }
      if (!order.length || k >= order.length) { order = words(); k = 0; }
      if (order.length) { mine = order[k++] + '…'; b.textContent = mine; }
      timer = setTimeout(tick, 7000);
    }
    function check() {
      if (b.disabled && /…\s*$/.test(b.textContent)) {
        b.classList.add('cw-btn-wait');
        if (!timer) { timer = setTimeout(tick, 5000); }
      } else if (!b.disabled) { stop(); }
    }
    new MutationObserver(check).observe(b, { attributes: true, attributeFilter: ['disabled'], childList: true, characterData: true, subtree: true });
  }
  function go() { Array.prototype.forEach.call(d.querySelectorAll('button'), watch); }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', go); } else { go(); }
})(window, document);
