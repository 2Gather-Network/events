(function (w, d) {
  if (w._cwLoadLog) { return; }
  var on = false;
  try {
    var m = /[?&]loadlog=(\d)/.exec(w.location.search);
    if (m) { if (m[1] === '1') { w.sessionStorage.setItem('cw-loadlog', '1'); } else { w.sessionStorage.removeItem('cw-loadlog'); } }
    on = w.sessionStorage.getItem('cw-loadlog') === '1';
  } catch (e) { on = !!(/[?&]loadlog=1/.test(w.location.search)); }
  if (!on) { return; }
  w._cwLoadLog = true;
  var T0 = (w.performance && performance.timing && performance.timing.navigationStart) || Date.now();
  var lines = [];
  var box = null, body = null;
  function secs(ms) { return (ms / 1000).toFixed(1) + 's'; }
  function stamp() { return secs(Date.now() - T0); }
  function nameOf(u) {
    try {
      var x = new URL(u, w.location.href);
      var a = x.searchParams.get('action');
      var h = x.hostname.replace(/\.jessieupp\.workers\.dev$/, '');
      return (a || (x.pathname === '/' ? '(events list)' : x.pathname)) + ' · ' + h;
    } catch (e) { return 'request'; }
  }
  function draw() {
    if (!box) {
      if (!d.body) { return; }
      box = d.createElement('div');
      box.setAttribute('style', 'position:fixed;left:6px;right:6px;bottom:6px;z-index:2147483647;background:#000;color:#9fe;font:11px/1.35 ui-monospace,Menlo,monospace;border-radius:8px;padding:6px 8px;max-height:38vh;overflow:auto;opacity:.94');
      var bar = d.createElement('div');
      bar.setAttribute('style', 'display:flex;gap:10px;align-items:center;margin-bottom:4px;color:#fff;font-weight:700');
      var t = d.createElement('span'); t.textContent = 'Load log'; t.style.flex = '1'; t.style.whiteSpace = 'nowrap';
      var cp = d.createElement('button'); cp.textContent = 'Copy';
      var off = d.createElement('button'); off.textContent = 'Switch off';
      [cp, off].forEach(function (b) { b.setAttribute('style', 'font:inherit;color:#000;background:#9fe;border:0;border-radius:6px;padding:2px 8px;flex:none;width:auto'); });
      cp.onclick = function () {
        var txt = lines.join('\n');
        try { navigator.clipboard.writeText(txt); cp.textContent = 'Copied'; } catch (e) { cp.textContent = 'Could not copy'; }
        setTimeout(function () { cp.textContent = 'Copy'; }, 1500);
      };
      off.onclick = function () { try { w.sessionStorage.removeItem('cw-loadlog'); } catch (e) {} box.remove(); box = null; w._cwLoadLog = false; };
      bar.appendChild(t); bar.appendChild(cp); bar.appendChild(off);
      body = d.createElement('div');
      body.style.whiteSpace = 'pre-wrap';
      box.appendChild(bar); box.appendChild(body);
      d.body.appendChild(box);
    }
    body.textContent = lines.join('\n');
    box.scrollTop = box.scrollHeight;
  }
  function add(s) {
    var line = stamp() + '  ' + s;
    lines.push(line);
    try { console.log('[loadlog] ' + line); } catch (e) {}
    draw();
  }
  var pending = 0;
  function begin(u) {
    pending++;
    var n = nameOf(u), t = Date.now();
    add('ask    ' + n + '  (' + pending + ' waiting)');
    return function (result) {
      pending--;
      add('answer ' + n + '  took ' + secs(Date.now() - t) + '  ' + result);
    };
  }
  var realFetch = w.fetch;
  if (realFetch) {
    w.fetch = function (input) {
      var u = typeof input === 'string' ? input : (input && input.url) || '';
      if (u.indexOf('cw-api-gate') === -1) { return realFetch.apply(this, arguments); }
      var end = begin(u);
      return realFetch.apply(this, arguments).then(function (r) {
        var c = '';
        try { c = r.headers.get('x-cw-cache') || r.headers.get('cf-cache-status') || ''; } catch (e) {}
        end('status ' + r.status + (c ? ' ' + c : ''));
        return r;
      }, function (err) { end('FAILED ' + (err && err.message || '')); throw err; });
    };
  }
  function watchScript(s) {
    if (!s || s.tagName !== 'SCRIPT' || !s.src || s.src.indexOf('cw-api-gate') === -1 || s._cwLog) { return; }
    s._cwLog = true;
    var end = begin(s.src), ended = false;
    function fin(r) { if (!ended) { ended = true; end(r); } }
    s.addEventListener('load', function () { fin('arrived'); });
    s.addEventListener('error', function () { fin('FAILED'); });
    setTimeout(function () { if (!ended && !d.documentElement.contains(s)) { fin('arrived'); } }, 0);
    var mo = new MutationObserver(function () { if (!d.documentElement.contains(s)) { fin('arrived'); mo.disconnect(); } });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  }
  new MutationObserver(function (list) {
    list.forEach(function (m) { for (var i = 0; i < m.addedNodes.length; i++) { watchScript(m.addedNodes[i]); } });
  }).observe(d.documentElement, { childList: true, subtree: true });
  var chipOn = false;
  setInterval(function () {
    var c = d.querySelector('.cw-onechip');
    var shown = !!(c && c.offsetParent !== null);
    if (shown !== chipOn) {
      chipOn = shown;
      var pageVisible = !!d.querySelector('#searchInput, .cw-loading-shown, input[type=search]');
      add(shown ? 'chip  shows "' + c.textContent.trim() + '"' + (pageVisible ? '  (page is visible too)' : '') : 'chip  gone');
    }
  }, 500);
  w.addEventListener('error', function (e) { add('error  ' + (e.message || 'script error')); });
  w.addEventListener('unhandledrejection', function (e) { add('error  ' + String(e.reason && e.reason.message || e.reason).slice(0, 120)); });
  d.addEventListener('DOMContentLoaded', function () { add('page   structure loaded'); draw(); });
  w.addEventListener('load', function () { add('page   everything loaded'); });
  add('start  Load log on. Add ?loadlog=0 to switch off.');
})(window, document);
