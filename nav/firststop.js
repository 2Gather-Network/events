(function () {
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var CW = window.CW = window.CW || {};

  var HEADING = 'cw-heading';
  var HEADING_LIFE = 30 * 60 * 1000;

  function ours(u) {
    var v = String(u == null ? '' : u);
    if (v.charAt(0) !== '/' || v.indexOf('//') === 0) return '';
    if (v.indexOf('/signin') === 0 || v.indexOf('/signup') === 0) return '';
    return v;
  }

  CW.rememberWhere = function (url) {
    var v = ours(url);
    if (!v) return;
    try { localStorage.setItem(HEADING, JSON.stringify({ u: v, at: Date.now() })); } catch (e) {}
  };

  CW.whereWasI = function () {
    var raw = '';
    try { raw = localStorage.getItem(HEADING) || ''; } catch (e) {}
    if (!raw) return '';
    var got = null;
    try { got = JSON.parse(raw); } catch (e) { return ''; }
    if (!got || !got.at || (Date.now() - Number(got.at)) > HEADING_LIFE) return '';
    return ours(got.u);
  };

  var SAID = ['needs', 'interests', 'skills', 'values', 'haves',
              'introNeed', 'introEnjoy', 'introSkills', 'introValues', 'introOffer'];

  function blank(v) { return !String(v == null ? '' : v).trim(); }

  function _asked(next) {
    try {
      var u = String(next || '');
      if (!u) return false;
      var path = u.split('#')[0].split('?')[0].replace(/^https?:\/\/[^/]+/, '');
      return /^\/(group|groups|event|myevents|ikigai|commons)(\/|$)/.test(path);
    } catch (e) { return false; }
  }

  CW.forgetWhere = function () {
    try { localStorage.removeItem(HEADING); } catch (e) {}
  };

  CW.firstStop = function (id, next, done) {
    CW.forgetWhere();
    var settled = false;
    function finish(url) { if (settled) return; settled = true; try { done(url); } catch (e) {} }
    if (!id) { finish(next); return; }

    var timer = setTimeout(function () { finish(next); }, 8000);

    fetch(GS + '?action=getIntake&appearId=' + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        var row = (d && d.data) || {};
        var spoken = SAID.some(function (k) { return !blank(row[k]); });
        finish((spoken || _asked(next)) ? next : 'https://2gather.network/welcome/');
      })
      .catch(function () { clearTimeout(timer); finish(next); });
  };
})();
