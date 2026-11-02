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

  var BALANCE_FIRST = { 'Connect': ['howIConnect'], 'Create': ['methods', 'subjects', 'expression'], 'Eat and drink': ['howIEatAndDrink'], 'Move': ['howIMove'], 'Play': ['energizesMeKinds'], 'Rest': ['howIRest'], 'My body and physical surroundings': ['bodyMoreOf'], 'My feelings': ['feelingsLately'], 'My energy': ['energyNotServing'], 'My mind': ['mindMoreOf'], 'My imagination': ['imaginationMoreOf'] };

  function _balanceDone(row) {
    var picked = String(row.exploreAreas || '').split('|').map(function (x) { return x.trim(); }).filter(function (x) { return BALANCE_FIRST[x]; });
    return picked.length > 0 && picked.every(function (n) { return BALANCE_FIRST[n].some(function (k) { return !blank(row[k]); }); });
  }

  CW.firstStop = function (id, next, done) {
    CW.forgetWhere();
    try { sessionStorage.removeItem('cw-tb-quiet:lookupProfile'); } catch (e) {}
    var settled = false, ready = null;
    try { var tk = localStorage.getItem('cw-token') || ''; ready = (id && tk && CW.prepareNow) ? CW.prepareNow(id, tk) : null; } catch (e) { ready = null; }
    function finish(url) {
      if (settled) return; settled = true;
      if (!ready) { try { done(url); } catch (e) {} return; }
      var gone = false;
      var leave = function () { if (gone) return; gone = true; try { done(url); } catch (e) {} };
      var cap = setTimeout(leave, 10000);
      ready.then(function (r) {
        if (gone) return;
        clearTimeout(cap);
        var told = false;
        try { told = CW.rememberNow(r, url); } catch (e) { told = false; }
        if (told) { gone = true; } else { leave(); }
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
        finish((spoken || _asked(next) || onAppear) ? next : 'https://2gather.network/welcome/');
      })
      .catch(function () { clearTimeout(timer); finish(next); });
  };
})();
