(function (w, d) {
  if (w._cwTiming) { return; }
  w._cwTiming = true;
  var KEY = 'cw-timing', LIFE = 15 * 60 * 1000;
  function load() { try { var a = JSON.parse(w.localStorage.getItem(KEY) || '[]'); var now = Date.now(); return a.filter(function (x) { return now - x.t < LIFE; }); } catch (e) { return []; } }
  var log = load();
  function save() { try { w.localStorage.setItem(KEY, JSON.stringify(log.slice(-80))); } catch (e) {} }
  function add(x) { x.t = x.t || Date.now(); log.push(x); save(); try { console.log('[timing]', JSON.stringify(x)); } catch (e) {} paint(); }
  function nameOf(u) {
    var m = String(u).match(/[?&]action=([A-Za-z]+)/);
    if (m) { return m[1]; }
    var c = String(u).match(/cw-carry\.[^\/]+(\/[a-z]+)/);
    return c ? 'carry' + c[1] : '';
  }
  var orig = w.fetch;
  w.fetch = function (input, init) {
    var u = (typeof input === 'string') ? input : (input && input.url) || '';
    var nm = nameOf(u);
    var p = orig.apply(this, arguments);
    if (!nm || !p || !p.then) { return p; }
    var t0 = Date.now(), row = { t: t0, kind: 'call', name: nm, page: w.location.pathname };
    add(row);
    p.then(function (r) {
      row.ms = Date.now() - t0;
      row.status = r && r.status;
      try { row.cache = r.headers.get('X-Gate-Cache') || ''; } catch (e) {}
      save(); paint();
    }, function () { row.ms = Date.now() - t0; row.status = 'failed'; save(); paint(); });
    return p;
  };
  add({ kind: 'page', name: 'opened ' + w.location.pathname });
  d.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('button,a') : null;
    if (b && b.textContent) { add({ kind: 'click', name: 'pressed "' + b.textContent.trim().slice(0, 30) + '"' }); }
  }, true);
  w.addEventListener('pagehide', function () { add({ kind: 'page', name: 'left ' + w.location.pathname }); });
  var box = null;
  function paint() {
    if (!d.body) { return; }
    if (!box) {
      box = d.createElement('div');
      box.id = 'cw-timing';
      box.style.cssText = 'position:fixed;right:8px;bottom:8px;z-index:2147483646;max-width:340px;max-height:46vh;overflow:auto;background:#fff;color:#1A2E42;border:1px solid #C3D0DB;border-radius:10px;box-shadow:0 4px 16px rgba(26,46,66,.18);font:12px/1.45 ui-monospace,Menlo,monospace;padding:8px 10px;';
      d.body.appendChild(box);
    }
    var start = log.length ? log[0].t : Date.now();
    var lines = log.slice(-18).map(function (x) {
      var at = '+' + ((x.t - start) / 1000).toFixed(1) + 's';
      var tail = x.kind === 'call' ? (x.ms == null ? ' waiting' : ' ' + (x.ms / 1000).toFixed(1) + 's' + (x.cache ? ' ' + x.cache : '') + (x.status && x.status !== 200 ? ' ' + x.status : '')) : '';
      return at + '  ' + x.name + tail;
    });
    box.innerHTML = '';
    var head = d.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;gap:8px;font-weight:700;margin-bottom:4px;';
    head.appendChild(d.createTextNode('Timing check (test page only)'));
    var clr = d.createElement('button');
    clr.type = 'button'; clr.textContent = 'Clear';
    clr.style.cssText = 'font:inherit;font-size:11px;border:1px solid #C3D0DB;background:#fff;border-radius:6px;cursor:pointer;';
    clr.onclick = function (e) { e.stopPropagation(); log = []; save(); add({ kind: 'page', name: 'cleared on ' + w.location.pathname }); };
    head.appendChild(clr);
    box.appendChild(head);
    lines.forEach(function (l) { var r = d.createElement('div'); r.textContent = l; box.appendChild(r); });
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', paint); } else { paint(); }
  setInterval(paint, 1000);
})(window, document);
