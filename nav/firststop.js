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

  var BALANCE_FIRST = { 'Connect': ['1stHowIConnect'], 'Create': ['methods', 'subjects', 'expression'], 'Eat and drink': ['1stHowIEatAndDrink'], 'Move': ['howIMove'], 'Play': ['1stEnergizesMeKinds'], 'Rest': ['howIRest'], 'My body and physical surroundings': ['1stBodyMoreOf'], 'My feelings': ['1stFeelingsLately'], 'My energy': ['1stEnergyNotServing'], 'My mind': ['1stMindMoreOf'], 'My imagination': ['1stImaginationMoreOf'] };

  function _balanceDone(row) {
    var picked = String(row['1stExploreAreas'] || '').split('|').map(function (x) { return x.trim(); }).filter(function (x) { return BALANCE_FIRST[x]; });
    return picked.length > 0 && picked.every(function (n) { return BALANCE_FIRST[n].some(function (k) { return !blank(row[k]); }); });
  }

  var READY = 'cw-page-ready';
  function _pageReady(row, id) {
    var photo = !blank(row.photoURL) || !blank(row.photo);
    try { if (!photo && localStorage.getItem('cw-photo-for') === id && localStorage.getItem('cw-photo')) { photo = true; } } catch (e) {}
    return photo && !blank(row.location) && !blank(row.languages);
  }
  function _keepReady(id, ready) {
    try { localStorage.setItem(READY, JSON.stringify({ who: id, ready: ready, at: Date.now() })); } catch (e) {}
  }

  CW.pageReady = function (id, cb) {
    var c = null;
    try { c = JSON.parse(localStorage.getItem(READY) || 'null'); } catch (e) {}
    if (c && c.who === id && c.ready === true && (Date.now() - Number(c.at)) < 600000) { cb(true); return; }
    fetch(GS + '?action=getIntake&appearId=' + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || d.status === 'error' || d.found === false) { cb(null); return; }
        var ready = _pageReady((d && d.data) || {}, id);
        _keepReady(id, ready);
        cb(ready);
      })
      .catch(function () { cb(null); });
  };

  CW.firstStop = function (id, next, done) {
    CW.forgetWhere();
    try { sessionStorage.removeItem('cw-tb-quiet:lookupProfile'); } catch (e) {}
    var settled = false, ready = null;
    try { var tk = localStorage.getItem('cw-token') || ''; ready = (id && tk && CW.prepareNow) ? CW.prepareNow(id, tk) : null; } catch (e) { ready = null; }
    var siteOn = (ready && CW.siteOnSettled) ? CW.siteOnSettled() : null;
    var siteOk = !siteOn;
    if (siteOn) {
      var onCap = new Promise(function (ok) { setTimeout(function () { ok({ ok: false }); }, 30000); });
      siteOk = Promise.race([siteOn, onCap]).then(function (t) {
        if (!t || !t.conductNeeded) return t;
        return new Promise(function (ok) {
          var tick = setInterval(function () {
            var yes = false;
            try { yes = localStorage.getItem('cw-conduct') === 'yes'; } catch (e) {}
            if (yes) { clearInterval(tick); ok(t); }
          }, 400);
        });
      });
    }
    function finish(url) {
      if (settled) return; settled = true;
      if (!ready) { try { done(url); } catch (e) {} return; }
      var gone = false;
      var leave = function () {
        if (gone) return; gone = true;
        Promise.resolve(siteOk).then(function () { try { done(url); } catch (e) {} });
      };
      var cap = setTimeout(leave, 20000);
      ready.then(function (r) {
        if (gone) return;
        clearTimeout(cap);
        Promise.resolve(siteOk).then(function () {
          var told = false;
          try { told = CW.rememberNow(r, url); } catch (e) { told = false; }
          if (told) { gone = true; } else { leave(); }
        });
      }, function () { clearTimeout(cap); leave(); });
    }
    if (!id) { finish(next); return; }

    var timer = setTimeout(function () { finish(next); }, 8000);

    fetch(GS + '?action=getIntake&appearId=' + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        var row = (d && d.data) || {};
        var spoken = SAID.some(function (k) { return !blank(row[k]); });
        if (String(window.location.hostname || '').toLowerCase().indexOf('2balance.network') > -1) { finish(_balanceDone(row) ? '/start/' : '/first-minute/'); return; }
        var onAppear = String(window.location.hostname || '').toLowerCase().indexOf('appear.network') > -1;
        if (onAppear && d && d.status !== 'error' && !_asked(next) && String(next || '/') === '/') {
          var ready = _pageReady(row, id);
          _keepReady(id, ready);
          if (ready) { finish('/me/?mine=1'); return; }
        }
        finish((spoken || _asked(next) || onAppear) ? next : 'https://2gather.network/welcome/');
      })
      .catch(function () { clearTimeout(timer); finish(next); });
  };
})();
