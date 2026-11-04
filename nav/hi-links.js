(function () {
  if (window.__cwHiLinks) return;
  window.__cwHiLinks = true;
  var GATE = 'https://cw-api-gate.jessieupp.workers.dev';
  var DAY = 86400000, HOUR = 3600000;
  var asked = {};

  function read(code) {
    try {
      var v = JSON.parse(localStorage.getItem('cw-hi-' + code) || 'null');
      if (v && typeof v.t === 'number' && (Date.now() - v.t) < (v.n ? DAY : HOUR)) return v;
    } catch (e) {}
    return null;
  }
  function keep(code, name) {
    try { localStorage.setItem('cw-hi-' + code, JSON.stringify({ n: name || '', t: Date.now() })); } catch (e) {}
  }
  function codeOf(a) {
    var u;
    try { u = new URL(a.getAttribute('href'), location.href); } catch (e) { return ''; }
    if (u.hostname !== '2gather.network' || !/^\/me\/?$/.test(u.pathname)) return '';
    var c = String(u.searchParams.get('v') || u.searchParams.get('p') || '').trim().toLowerCase();
    if (!/^[0-9a-z]{6}$/.test(c)) return '';
    var other = false;
    u.searchParams.forEach(function (val, key) { if (key !== 'v' && key !== 'p') other = true; });
    return other ? '' : c;
  }
  function point(code, name) {
    if (!name) return;
    var to = 'https://2gather.network/hi/' + encodeURIComponent(name);
    document.querySelectorAll('a[href*="/me/?"]').forEach(function (a) {
      if (codeOf(a) === code) a.setAttribute('href', to);
    });
  }
  function sweep() {
    document.querySelectorAll('a[href*="/me/?"]').forEach(function (a) {
      var code = codeOf(a);
      if (!code) return;
      var got = read(code);
      if (got) { point(code, got.n); return; }
      if (asked[code]) return;
      asked[code] = true;
      fetch(GATE + '?action=vanity&p=' + encodeURIComponent(code))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || d.status !== 'ok' || typeof d.name !== 'string') return;
          var n = d.name.trim().toLowerCase();
          if (n && !/^[a-z0-9._-]+$/.test(n)) return;
          keep(code, n);
          point(code, n);
        })
        .catch(function () {});
    });
  }
  var timer = null;
  function soon() { if (timer) return; timer = setTimeout(function () { timer = null; sweep(); }, 150); }
  function start() {
    sweep();
    try { new MutationObserver(soon).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
