(function (w, d) {
  if (w._cwWaitWords) { return; }
  w._cwWaitWords = true;
  var FIRST = 5000;
  var EVERY = 7000;
  var WORDS = [
    'Putting the kettle on', 'Setting the table', 'Pulling up a chair', 'Making room', 'Opening the door', 'Lighting the lanterns',
    'Gathering', 'Weaving', 'Mending', 'Sowing', 'Watering', 'Harvesting', 'Composting',
    'Making introductions', 'Finding common ground', 'Passing the note along', 'Circling back',
    'Sketching', 'Tinkering', 'Stitching', 'Kneading',
    'Ambling over', 'Wandering the commons', 'Carrying it across',
    'Noodling', 'Doodling', 'Humming along',
    'Pausing', 'Taking a breath', 'Settling in'
  ];
  w.CW_WAITING_WORDS = WORDS.slice();
  function shuffled() {
    var a = WORDS.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  var ONE = true;
  (function () {
    var st = d.createElement('style');
    st.id = 'cw-onechip-early';
    st.textContent = '.cw-loading:not(.cw-onechip):not(.cw-loading-shown){visibility:hidden !important}';
    (d.head || d.documentElement).appendChild(st);
  })();
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  function start(el) {
    if (!el || (seen && seen.has(el))) { return; }
    if (ONE && !(el.classList && el.classList.contains('cw-onechip'))) { return; }
    if (seen) { seen.add(el); }
    var mine = null, order = shuffled(), i = 0, first = el.textContent;
    try { el.setAttribute('aria-live', 'off'); } catch (e) {}
    function stillOurs() {
      if (!d.documentElement.contains(el)) { return false; }
      var now = el.textContent;
      return mine === null ? now === first : now === mine;
    }
    function tick() {
      if (!stillOurs()) { return; }
      if (el.offsetParent !== null || (el.classList && el.classList.contains('cw-onechip'))) {
        if (i >= order.length) { order = shuffled(); i = 0; }
        mine = order[i++] + '…';
        el.textContent = mine;
      }
      setTimeout(tick, EVERY);
    }
    setTimeout(tick, FIRST);
  }
  function scan(root) {
    if (!root || !root.querySelectorAll) { return; }
    if (root.classList && root.classList.contains('cw-loading')) { start(root); }
    var list = root.querySelectorAll('.cw-loading');
    for (var k = 0; k < list.length; k++) { start(list[k]); }
  }
  var firstText = typeof WeakMap === 'function' ? new WeakMap() : null;
  var released = typeof WeakSet === 'function' ? new WeakSet() : null;
  var chip = null;
  var COPY = ['backgroundColor', 'color', 'fontFamily', 'fontSize', 'fontWeight', 'padding', 'borderRadius',
    'animationName', 'animationDuration', 'animationTimingFunction', 'animationIterationCount', 'boxShadow', 'border'];
  function sources() {
    var out = [], list = d.querySelectorAll('.cw-loading');
    for (var k = 0; k < list.length; k++) {
      var el = list[k];
      if (el === chip || (el.classList && el.classList.contains('cw-onechip'))) { continue; }
      if (released && released.has(el)) { continue; }
      if (firstText && !firstText.has(el)) { firstText.set(el, el.textContent); }
      if (firstText && el.textContent !== firstText.get(el)) {
        if (/(\.\.\.|\u2026)\s*$/.test(el.textContent) || /^\s*(Loading|Looking|Opening|Finding|Checking|Getting|Fetching|Gathering|Searching|Joining|Saving|Sending|Preparing|Waking|Starting)\b/i.test(el.textContent)) {
          firstText.set(el, el.textContent);
          if (chip && chip.parentNode) { chip.parentNode.removeChild(chip); }
          chip = null;
        } else {
          if (released) { released.add(el); }
          el.style.visibility = '';
          el.classList.add('cw-loading-shown');
          continue;
        }
      }
      if (el.offsetParent !== null) { out.push(el); }
    }
    return out;
  }
  var hideSince = 0, HIDE_MAX = 40000;
  function pageHidden(on) {
    var h = d.documentElement;
    if (on) {
      if (!d.getElementById('cw-onechip-style')) {
        var st = d.createElement('style');
        st.id = 'cw-onechip-style';
        st.textContent = 'html.cw-waiting body > *:not(#cw-topbar):not(#cw-viewas):not(#cw-viewas-pick):not(.cw-onechip){visibility:hidden !important}';
        d.head.appendChild(st);
      }
      h.classList.add('cw-waiting');
    } else {
      h.classList.remove('cw-waiting');
    }
  }
  function groupName() {
    try {
      var q = new URLSearchParams(w.location.search);
      var n = String(q.get('name') || q.get('groupName') || '').trim();
      if (n) { return n; }
      var m = String(w.location.pathname || '').match(/^\/group\/([^\/]+)/i);
      if (m && m[1] && !/^index\.html$/i.test(m[1])) { return decodeURIComponent(m[1]).replace(/-/g, ' ').trim(); }
    } catch (e) {}
    return '';
  }
  function chipLine(t) {
    var text = String(t || '').trim();
    var named = groupName();
    if (/^Looking up this group/i.test(text)) { return named ? 'Looking up ' + named + '\u2026' : 'Looking up this group\u2026'; }
    var o = text.match(/^Opening (.+?)\s*(\.\.\.|\u2026)?$/i);
    if (o && o[1] && !/^(Manage|your |the )/i.test(o[1])) { return 'Looking up ' + o[1] + '\u2026'; }
    return text;
  }
  function oneChip() {
    if (!d.body) { return; }
    var src = sources();
    if (!src.length) {
      if (chip && chip.parentNode) { chip.parentNode.removeChild(chip); }
      chip = null;
      hideSince = 0;
      pageHidden(false);
      return;
    }
    if (!hideSince) { hideSince = Date.now(); }
    pageHidden(Date.now() - hideSince < HIDE_MAX);
    if (!chip) {
      chip = d.createElement('span');
      chip.className = 'cw-loading cw-onechip';
      chip.setAttribute('role', 'status');
      var cs = w.getComputedStyle(src[0]);
      for (var c = 0; c < COPY.length; c++) { try { chip.style[COPY[c]] = cs[COPY[c]]; } catch (e) {} }
      chip.style.backgroundColor = '#fff';
      chip.style.color = '#1F699E';
      chip.style.border = '0';
      chip.style.boxShadow = '0 6px 24px rgba(16, 42, 67, .22)';
      chip.style.padding = '10px 20px';
      chip.style.borderRadius = '22px';
      chip.style.fontSize = '14px';
      chip.style.fontWeight = '700';
      chip.style.position = 'fixed';
      chip.style.left = '50%';
      chip.style.top = '50%';
      chip.style.transform = 'translate(-50%, -50%)';
      chip.style.zIndex = '2147482000';
      chip.style.pointerEvents = 'none';
      chip.style.margin = '0';
      chip.style.display = 'inline-flex';
      chip.style.alignItems = 'center';
      chip.style.whiteSpace = 'nowrap';
      chip.textContent = chipLine((firstText && firstText.get(src[0])) || src[0].textContent);
      d.body.appendChild(chip);
    }
    for (var k = 0; k < src.length; k++) { src[k].style.visibility = 'hidden'; }
  }
  if (typeof MutationObserver === 'function') {
    new MutationObserver(function (muts) {
      for (var m = 0; m < muts.length; m++) {
        var added = muts[m].addedNodes;
        for (var n = 0; n < added.length; n++) {
          if (added[n].nodeType === 1) { scan(added[n]); }
        }
      }
      if (ONE) { oneChip(); }
    }).observe(d.documentElement, { childList: true, subtree: true });
  }
  function begin() {
    if (ONE) { oneChip(); setInterval(oneChip, 250); }
    scan(d.body);
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', begin); } else { begin(); }
})(window, document);
