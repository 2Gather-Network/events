(function (w) {
  if (w.cwPost) { return; }
  var GATE = 'https://cw-api-gate.jessieupp.workers.dev';
  w.cwPost = function (action, body) {
    var me = '', tok = '';
    try { me = String(((w.CW && w.CW.me && w.CW.me()) || {}).id || '').trim(); } catch (e) {}
    try { tok = localStorage.getItem('cw-token') || ''; } catch (e) {}
    var b = { appearId: me, meToken: tok };
    Object.keys(body || {}).forEach(function (k) { b[k] = body[k] == null ? '' : String(body[k]); });
    return fetch(GATE + '?action=' + encodeURIComponent(action) + '&t=' + Date.now(), {
      method: 'POST', cache: 'no-store', referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b)
    }).then(function (r) { return r.json(); });
  };
})(window);
