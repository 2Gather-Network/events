(function (w, d) {
  if (w._cwWaitWords) { return; }
  w._cwWaitWords = true;
  var q = String(w.location.search || '');
  if (!/[?&]waitwords=1(&|$)/.test(q)) { return; }
  var FIRST = 3000;
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
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  function start(el) {
    if (!el || (seen && seen.has(el))) { return; }
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
      if (el.offsetParent !== null) {
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
  function begin() {
    scan(d.body);
    if (typeof MutationObserver !== 'function') { return; }
    new MutationObserver(function (muts) {
      for (var m = 0; m < muts.length; m++) {
        var added = muts[m].addedNodes;
        for (var n = 0; n < added.length; n++) {
          if (added[n].nodeType === 1) { scan(added[n]); }
        }
      }
    }).observe(d.body, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', begin); } else { begin(); }
})(window, document);
