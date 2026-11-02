(function (w) {
  'use strict';
  if (w.CW && w.CW.me) { return; }              

  var WHO   = ['CWid', 'memberCard', 'appearId', 'me'];
  var KEEP  = ['cw-id', 'appear-id'];           
  var ANSWER_KEYS = ['cw-intro-answers:', 'cw-intro-pending:', 'cw-gadmin-'];
  function clearAnswerCopies() {
    try { Object.keys(w.localStorage).forEach(function (k) { for (var j = 0; j < ANSWER_KEYS.length; j++) { if (k.indexOf(ANSWER_KEYS[j]) === 0) { w.localStorage.removeItem(k); } } }); } catch (e) {}
  }
  var CLEAR = ['cw-id', 'appear-id', 'cw-photo', 'cw-photo-for', 'cw-photo-at', 'cw-token', 'cw-first',
               'cw-view-as', 'cw-view-as-name', 'cw-super', 'cw-super-for', 'cw-lastEmail', 'cw-enabled', 'cw-jump-mark', 'cw-jump-known'];
  var VIEW_KEY = 'cw-view-as';
  var OUT_KEY = 'cw-view-out';

  function ls(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }
  function ss(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }
  ls(function () { w.localStorage.removeItem('cw-view-as'); w.localStorage.removeItem('cw-view-as-name'); });

  function normalise(v) {
    return String(v == null ? '' : v).replace(/\./g, '').trim().toLowerCase();
  }

  function fromUrl() {
    return ls(function () {
      var p = new URLSearchParams(w.location.search);
      for (var i = 0; i < WHO.length; i++) {
        var v = String(p.get(WHO[i]) || '').trim();
        if (v) { return v; }
      }
      return '';
    }, '');
  }

  function fromDevice() {
    return ls(function () {
      for (var i = 0; i < KEEP.length; i++) {
        var v = String(w.localStorage.getItem(KEEP[i]) || '').trim();
        if (v) { return v; }
      }
      return '';
    }, '');
  }

  function remember(id) {
    id = String(id || '').trim();
    if (!id) { return ''; }
    w.CW_ID = id;                                
    ls(function () {
      for (var i = 0; i < KEEP.length; i++) { w.localStorage.setItem(KEEP[i], id); }
    });
    return id;
  }

  function codeFor(id) {
    var v = String(id || '').split('.').join('').toLowerCase();
    if (!v) { return ''; }
    var h = 5381;
    for (var i = 0; i < v.length; i++) { h = ((h * 33) ^ v.charCodeAt(i)) >>> 0; }
    return ('000000' + h.toString(36)).slice(-6);
  }

  function strip() {
    ls(function () {
      var url = new URL(w.location.href), hit = false;
      var shown = String(url.searchParams.get('show') || '').trim();
      if (shown) {
        var code = codeFor(shown);
        url.searchParams.delete('show');
        if (code && !url.searchParams.get('v')) { url.searchParams.set('v', code); }
        hit = true;
      }
      for (var i = 0; i < WHO.length; i++) {
        if (url.searchParams.has(WHO[i])) { url.searchParams.delete(WHO[i]); hit = true; }
      }
      if (!hit || !w.history || !w.history.replaceState) { return; }
      var q = url.searchParams.toString();
      w.history.replaceState({}, '', url.pathname + (q ? '?' + q : '') + url.hash);
    });
  }

  (function oneAnswer() {
    ls(function () {
      var a = String(w.localStorage.getItem('appear-id') || '').trim();
      var c = String(w.localStorage.getItem('cw-id') || '').trim();
      if (!a || !c) { return; }                       
      if (normalise(a) === normalise(c)) { return; }  
      w.localStorage.setItem('appear-id', c);
    });
  })();

  function proven(id) {
    return ls(function () {
      var t = String(w.localStorage.getItem('cw-token') || '');
      if (!t) { return false; }
      var exp = parseInt(t.split('.')[1], 10);
      if (!exp || Date.now() > (exp - 60000)) { return false; }
      var who = normalise(w.localStorage.getItem('cw-id') || w.localStorage.getItem('appear-id') || '');
      return !!who && who === normalise(id);
    }, false);
  }
  var stored = fromDevice();
  if (stored && !proven(stored)) {
    ls(function () { for (var ci = 0; ci < CLEAR.length; ci++) { w.localStorage.removeItem(CLEAR[ci]); } clearAnswerCopies(); });
    stored = '';
  }
  var fromLink = fromUrl();
  var found = '';
  if (fromLink && stored && normalise(fromLink) === normalise(stored)) {
    found = remember(fromLink);
    strip();
  } else if (stored) {
    found = stored;
    w.CW_ID = stored;
    if (fromLink) { strip(); }
  } else if (fromLink) {
    strip();
  }

  strip();

  var LOCK_KEY = 'cw-lock';
  (function showThePass() {
    var GATE = 'cw-api-gate.jessieupp.workers.dev';
    if (!w.fetch || w._cwPassOn) { return; }
    w._cwPassOn = true;
    var orig = w.fetch;
    w.fetch = function (input, init) {
      var out = input, carries = false;
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf(GATE) > -1 && url.indexOf('action=') > -1) {
          carries = url.indexOf('meToken=') > -1;
          if (!carries && url.length < 6000) {
            var t = ls(function () { return w.localStorage.getItem('cw-token') || ''; }, '');
            if (t) {
              var joined = url + (url.indexOf('?') > -1 ? '&' : '?') + 'meToken=' + encodeURIComponent(t);
              out = (typeof input === 'string') ? joined : new Request(joined, input);
              carries = true;
            }
          }
          if (carries && viewingAs()) {
            var u2 = (typeof out === 'string') ? out : (out && out.url) || '';
            var realId = String(w.CW_ID || '').trim() || fromDevice();
            if (u2.indexOf('realMe=') === -1 && realId && u2.length < 6000) {
              var j2 = u2 + '&realMe=' + encodeURIComponent(realId);
              out = (typeof out === 'string') ? j2 : new Request(j2, out);
            }
          }
        }
      } catch (e) { out = input; }
      var p = orig.call(this, out, init);
      if (!carries || !p || !p.then) { return p; }
      var asked = '';
      try { asked = (typeof out === 'string') ? out : (out && out.url) || ''; } catch (e) {}
      return p.then(function (r) {
        try { if (r && r.headers && r.headers.get('X-CW-Signin') === '1' && namesMe(asked)) { signInAgain(); } } catch (e) {}
        return r;
      });
    };
    function namesMe(u) {
      var mine = normalise(ls(function () { return w.localStorage.getItem('cw-id') || w.localStorage.getItem('appear-id') || ''; }, ''));
      if (!mine) { return false; }
      var q = new URLSearchParams(String(u).split('?')[1] || '');
      var keys = ['appearId', 'me', 'memberCard', 'CWid', 'from', 'byAppearId', 'hostAppearId', 'invitedById', 'gifterAppearId', 'userID', 'byID'];
      for (var i = 0; i < keys.length; i++) { if (normalise(q.get(keys[i]) || '') === mine) { return true; } }
      return false;
    }
    function signInAgain() {
      if (w._cwSignInAgain) { return; }
      var path = String(w.location.pathname || '/');
      if (/^\/(signin|signup|signin-google)(\/|$)/.test(path)) { return; }
      w._cwSignInAgain = true;
      try { if (w.CW && w.CW.forget) { w.CW.forget(); } } catch (e) {}
      var onCW = String(w.location.hostname || '').indexOf('creating.works') >= 0;
      var back = path + String(w.location.search || '') + String(w.location.hash || '').replace(/^#cwview=.*$/, '');
      if (jumpOn()) {
        var arrived = parseInt(ls(function () { return w.localStorage.getItem('cw-jump-arrived'); }, '') || '0', 10) || 0;
        ls(function () { w.localStorage.removeItem('cw-jump-known'); });
        if (Date.now() - arrived > 2 * 60 * 1000) {
          ls(function () { w.localStorage.removeItem('cw-jump-wait'); });
          w.location.replace(back);
          return;
        }
        ls(function () { w.localStorage.setItem('cw-jump-wait', String(Date.now() + 30 * 60 * 1000)); });
      }
      w.location.replace(onCW ? '/' : '/signin/?next=' + encodeURIComponent(back));
    }
  })();

  var JUMP_SITE = { '2gather.network': 'gather', '2appear.network': 'appear', '2balance.network': 'balance', 'creating.works': 'creatingworks' };
  var JUMP_ON = false;
  ls(function () {
    var m = /^#cwjumptest=([01])$/.exec(String(w.location.hash || ''));
    if (!m || !JUMP_SITE[String(w.location.hostname || '').toLowerCase()]) { return; }
    if (m[1] === '1') { w.localStorage.setItem('cw-jump-test', '1'); } else { w.localStorage.removeItem('cw-jump-test'); w.localStorage.removeItem('cw-jump-log'); }
    w.history.replaceState(null, '', w.location.pathname + w.location.search);
  });
  function jumpOn() {
    if (!JUMP_SITE[String(w.location.hostname || '').toLowerCase()]) { return false; }
    return JUMP_ON || ls(function () { return w.localStorage.getItem('cw-jump-test'); }, '') === '1';
  }

  function jumpLog(step) {
    if (!jumpOn()) { return; }
    var line = new Date().toLocaleTimeString() + ' ' + String(w.location.pathname || '/') + ' ' + step;
    ls(function () { w.console.info('[sign-in check] ' + line); });
    ls(function () {
      var all = JSON.parse(w.localStorage.getItem('cw-jump-log') || '[]');
      all.push(line);
      w.localStorage.setItem('cw-jump-log', JSON.stringify(all.slice(-14)));
    });
  }
  function prepareSession(id, token) {
    var got = null, a = new Uint8Array(16), key = normalise(id), exp = parseInt(String(token).split('.')[1], 10) || 0;
    w.crypto.getRandomValues(a);
    var st = Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    return w.fetch('https://cw-api-gate.jessieupp.workers.dev?action=carryReadyAll&appearId=' + encodeURIComponent(id) + '&meToken=' + encodeURIComponent(token), { referrerPolicy: 'no-referrer' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || d.status !== 'ok' || !d.passes) { jumpLog('backend refused the passes: ' + String((d && d.message) || 'no answer')); throw new Error('refused'); }
        jumpLog('backend gave passes for: ' + Object.keys(d.passes).join(', '));
        got = d;
        return w.fetch('https://cw-carry.jessieupp.workers.dev/prepare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({ appearId: d.appearId, firstName: d.firstName || '', passes: d.passes, state: st })
        });
      })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || d.status !== 'ok' || !d.code) { jumpLog('service refused the passes'); throw new Error('refused'); }
        jumpLog('service holds the passes, ready to remember');
        var list = String(got.enabledSolution || '');
        ls(function () { w.localStorage.setItem('cw-enabled', list); });
        ss(function () { w.sessionStorage.setItem('cw-jump-pending', JSON.stringify({ id: key, exp: exp, enabled: list, code: d.code, state: st, at: Date.now() })); });
      });
  }

  (function jumpOrRemember() {
    var SERVICE = 'https://cw-carry.jessieupp.workers.dev';
    var WAIT_MS = 30 * 60 * 1000, PENDING_MS = 9 * 60 * 1000, RETRY_MS = 10 * 60 * 1000;
    if (!jumpOn()) { return; }
    var site = JUMP_SITE[String(w.location.hostname || '').toLowerCase()];
    if (ls(function () { return w.top !== w.self; }, true)) { return; }
    var nav = w.navigator || {};
    if (nav.webdriver || /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|slack|discord|telegram|lighthouse|headless/i.test(String(nav.userAgent || ''))) { return; }
    if (w.document && w.document.visibilityState === 'prerender') { return; }
    var here = String(w.location.pathname || '/');
    if (/^\/(carry|signout|signin|signup|signin-google)(\/|$)/.test(here)) { return; }
    if (signedOutView() || viewingAs()) { jumpLog('stopped: viewing as someone'); return; }
    var now = Date.now();
    function newState() {
      var a = new Uint8Array(16);
      w.crypto.getRandomValues(a);
      return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    }
    function num(k) { return parseInt(ls(function () { return w.localStorage.getItem(k); }, '') || '0', 10) || 0; }

    if (!found) {
      if (num('cw-jump-wait') > now) { jumpLog('not signed in here; guest wait, ' + Math.ceil((num('cw-jump-wait') - now) / 60000) + ' min left, no jump'); return; }
      var until = String(now + WAIT_MS);
      var held = ls(function () { w.localStorage.setItem('cw-jump-wait', until); return w.localStorage.getItem('cw-jump-wait') === until; }, false);
      if (!held) { return; }
      var st = newState();
      var saved = ss(function () {
        w.sessionStorage.setItem('cw-carry-state', st);
        w.sessionStorage.setItem('cw-jump-next', here + String(w.location.search || '') + String(w.location.hash || ''));
        return true;
      }, false);
      if (!saved) { return; }
      jumpLog('not signed in here; asking the service');
      w._cwJumping = true;
      try { w.stop(); } catch (e) {}
      w.location.replace(SERVICE + '/jump?to=' + site + '&state=' + st);
      return;
    }

    var key = normalise(found);
    var token = ls(function () { return w.localStorage.getItem('cw-token') || ''; }, '');
    var exp = parseInt(token.split('.')[1], 10) || 0;
    var enabled = ls(function () { return w.localStorage.getItem('cw-enabled') || ''; }, '');
    var mark = ls(function () { return JSON.parse(w.localStorage.getItem('cw-jump-mark') || 'null'); }, null);
    if (mark && mark.id === key && mark.exp === exp && String(mark.enabled || '') === enabled) { jumpLog('signed in here; service already told'); return; }

    function typing() {
      var d = w.document, a = d.activeElement, tag = a && a.tagName ? a.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (a && a.isContentEditable)) { return true; }
      var f = d.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea');
      for (var i = 0; i < f.length; i++) { if (f[i].value && f[i].value !== f[i].defaultValue && f[i].getClientRects().length) { return true; } }
      return false;
    }
    function remember(soon) {
      var pending = ss(function () { return JSON.parse(w.sessionStorage.getItem('cw-jump-pending') || 'null'); }, null);
      if (!pending || pending.id !== key || pending.exp !== exp || Date.now() - pending.at >= PENDING_MS) { return false; }
      var back = here + String(w.location.search || '');
      if (w.location.hash || !/^\/(?!\/)[A-Za-z0-9\-._~\/%?=&+@:,]{0,300}$/.test(back)) { jumpLog('remember held: this address cannot come back'); return true; }
      if (soon && typing()) { jumpLog('remember held: you are typing'); return true; }
      jumpLog('telling the service');
      ss(function () { w.sessionStorage.removeItem('cw-jump-pending'); });
      ls(function () { w.localStorage.setItem('cw-jump-mark', JSON.stringify({ id: key, exp: exp, enabled: String(pending.enabled || '') })); });
      var form = w.document.createElement('form');
      form.method = 'POST';
      form.action = SERVICE + '/remember';
      [['code', pending.code], ['state', pending.state], ['back', back]].forEach(function (pair) {
        var input = w.document.createElement('input');
        input.type = 'hidden';
        input.name = pair[0];
        input.value = pair[1];
        form.appendChild(input);
      });
      w.document.documentElement.appendChild(form);
      w._cwJumping = true;
      try { w.stop(); } catch (e) {}
      form.submit();
      return true;
    }
    if (remember(false)) { return; }

    if (num('cw-jump-retry') > now) { jumpLog('signed in here; last try was recent, ' + Math.ceil((num('cw-jump-retry') - now) / 60000) + ' min until next'); return; }
    jumpLog('signed in here; asking the backend for passes');
    ls(function () { w.localStorage.setItem('cw-jump-retry', String(now + RETRY_MS)); });
    w.setTimeout(function () { prepareSession(found, token).then(function () { remember(true); }).catch(function (e) { jumpLog('passes failed: ' + String((e && e.message) || e)); }); }, 1500);
  })();

  (function wall() {
    if (w._cwJumping) { return; }
    var here = String(w.location.pathname || '/');
    var onCW = String(w.location.hostname || '').indexOf('creating.works') >= 0;
    var onAppear = String(w.location.hostname || '').toLowerCase().indexOf('appear.network') >= 0;
    var onBalance = String(w.location.hostname || '').toLowerCase().indexOf('balance.network') >= 0;

    var OPEN = onCW
      ? ['/', '/terms-of-service', '/privacy-policy', '/code-of-conduct', '/ops', '/vision', '/license', '/signout']
      : onAppear
        ? ['/', '/signin', '/signup', '/signin-google', '/signout']
      : onBalance
        ? ['/', '/signin', '/signup', '/signin-google', '/signout']
        : ['/signin', '/signup', '/signin-google', '/signout', '/event', '/events'];

    var asked = ls(function () { return new URLSearchParams(w.location.search).get('lock'); }, null);
    if (asked !== null) {
      ls(function () {
        w.localStorage.setItem(LOCK_KEY, String(asked) === '0' ? '0' : '1');
        if (!w.history || !w.history.replaceState) { return; }
        var u = new URL(w.location.href);
        u.searchParams.delete('lock');
        var q = u.searchParams.toString();
        w.history.replaceState({}, '', u.pathname + (q ? '?' + q : '') + u.hash);
      });
    }
    if (ls(function () { return w.localStorage.getItem(LOCK_KEY); }, null) === '0') { return; }

    for (var i = 0; i < OPEN.length; i++) {
      if (here === OPEN[i] || here.indexOf(OPEN[i] + '/') === 0 || here.indexOf(OPEN[i] + '.') === 0) { return; }
    }
    if (!onCW && /^\/support\/?(index\.html)?$/.test(here)) { return; }
    if (!onCW && !onBalance && /^\/group\/[A-Za-z0-9][A-Za-z0-9-]{1,59}\/?$/.test(here) && here !== '/group/index.html' && !/[?&]view=/.test(w.location.search)) { return; }
    if (!onCW && !onBalance && /^\/group\/?(index\.html)?$/.test(here) && !/[?&]view=/.test(w.location.search)) { return; }

    if (found) { return; }

    var back = here;
    ls(function () {
      var u = new URL(w.location.href);
      u.searchParams.delete('lock');
      var q = u.searchParams.toString();
      back = u.pathname + (q ? '?' + q : '') + String(u.hash || '').replace(/^#cwview=.*$/, '');
    });
    w.location.replace(onCW ? '/' : '/signin/?next=' + encodeURIComponent(back));
  })();

  (function swapToOneId() {
    var SWAP_ONLY = [];
    if (!found) { return; }
    var allowed = false;
    for (var si = 0; si < SWAP_ONLY.length; si++) {
      if (normalise(SWAP_ONLY[si]) === normalise(found)) { allowed = true; break; }
    }
    if (!allowed) { return; }
    var MARK = 'cw-id-checked';
    ls(function () {
      if (String(w.localStorage.getItem(MARK) || '') === normalise(found)) { return; }
      var url = 'https://cw-api-gate.jessieupp.workers.dev?action=canonicalId&appearId='
              + encodeURIComponent(found) + '&t=' + Date.now();
      w.fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || d.status !== 'ok' || !d.known) { return; }   
          ls(function () { w.localStorage.setItem(MARK, normalise(found)); });
          var next = String(d.id || '').trim();
          if (!next || normalise(next) === normalise(found)) { return; }
          remember(next);
          ls(function () { w.localStorage.setItem(MARK, normalise(next)); });
        })
        .catch(function () {});
    });
  })();

  function viewingAs() {
    if (signedOutView()) { return ''; }
    return ss(function () { return String(w.sessionStorage.getItem(VIEW_KEY) || '').trim(); }, '');
  }
  function signedOutView() {
    return ss(function () { return w.sessionStorage.getItem(OUT_KEY) === '1'; }, false);
  }
  function nobody() {
    return { id: '', key: '', known: false, viewing: false, realId: '', signedOutView: true };
  }

  if (signedOutView()) { w.CW_ID = ''; }

  var _spellT = -1, _spellMap = null;
  function spellOf(s) {
    var raw = w.localStorage.getItem('cw-words-v3'); if (!raw) { return ''; }
    var k = JSON.parse(raw); if (!k || !k.rows) { return ''; }
    if (_spellMap === null || _spellT !== k.t) {
      _spellMap = {}; _spellT = k.t;
      k.rows.forEach(function (r) { var n = String((r && r[1]) || '').trim(); if (n && !_spellMap[n.toLowerCase()]) { _spellMap[n.toLowerCase()] = n; } });
    }
    return _spellMap[s.toLowerCase()] || '';
  }

  w.CW = {
    sentence: function (s) {
      s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
      if (!s) { return s; }
      var kept = ls(function () { return spellOf(s); }, '');
      if (kept) { return kept; }
      var words = s.split(' '), alpha = words.filter(function (x) { return /[A-Za-z]/.test(x); });
      var title = alpha.length > 1 && alpha.every(function (x) { return /^[A-Z]/.test(x); });
      return words.map(function (x, i) {
        if (i === 0) { return /^[a-z]+[A-Z]/.test(x) ? x : x.charAt(0).toUpperCase() + x.slice(1); }
        if (!title) { return x; }
        if (x.length > 1 && /^[A-Z0-9&.\-]+$/.test(x)) { return x; }
        if (/[a-z][A-Z]/.test(x)) { return x; }
        return x.charAt(0).toLowerCase() + x.slice(1);
      }).join(' ');
    },
    passParam: function () { try { var t = w.localStorage.getItem('cw-token') || ''; return t ? '&meToken=' + encodeURIComponent(t) : ''; } catch (e) { return ''; } },
    me: function () {
      if (signedOutView()) { return nobody(); }
      var real = String(w.CW_ID || '').trim() || fromDevice();
      var seen = viewingAs();
      if (seen && normalise(seen) !== normalise(real)) {
        return { id: seen, key: normalise(seen), known: true, viewing: true, realId: real };
      }
      return { id: real, key: normalise(real), known: !!real, viewing: false, realId: real };
    },
    realMe: function () {
      if (signedOutView()) { return { id: '', key: '', known: false }; }
      var real = String(w.CW_ID || '').trim() || fromDevice();
      return { id: real, key: normalise(real), known: !!real };
    },
    atKeyboard: function () {
      var real = String(w.CW_ID || '').trim() || fromDevice();   
      return { id: real, key: normalise(real), known: !!real };
    },
    viewingAs: viewingAs,
    signedOutView: signedOutView,
    viewSignedOut: function () {
      ss(function () {
        w.sessionStorage.removeItem(VIEW_KEY);
        w.sessionStorage.removeItem('cw-view-as-name');
        w.sessionStorage.setItem(OUT_KEY, '1');
      });
    },
    viewAs: function (id, name) {
      id = String(id || '').trim();
      ss(function () { w.sessionStorage.removeItem(OUT_KEY); });
      ls(function () {
        if (!id) { w.sessionStorage.removeItem(VIEW_KEY); w.sessionStorage.removeItem('cw-view-as-name'); }
        else { w.sessionStorage.setItem(VIEW_KEY, id); w.sessionStorage.setItem('cw-view-as-name', String(name || '')); }
      });
      return id;
    },
    stopViewing: function () {
      ss(function () {
        w.sessionStorage.removeItem(VIEW_KEY);
        w.sessionStorage.removeItem('cw-view-as-name');
        w.sessionStorage.removeItem(OUT_KEY);
      });
    },
    remember: function (id) { return remember(id); },
    refCode: codeFor,
    withRef: function (url) {
      try {
        var u = String(url || '');
        if (!u || /[?&]r=/.test(u)) { return u; }
        var me = '';
        if (!signedOutView()) { me = String((w.CW_ID || '') || fromDevice()).trim(); }
        if (!me) { return u; }
        var code = codeFor(me);
        return code ? u + (u.indexOf('?') > -1 ? '&' : '?') + 'r=' + code : u;
      } catch (e) { return String(url || ''); }
    },
    normalise: normalise,
    jumpOn: jumpOn,
    prepareSession: prepareSession,
    connectKnown: function () {
      var site = JUMP_SITE[String(w.location.hostname || '').toLowerCase()];
      if (!jumpOn() || (site !== 'appear' && site !== 'balance') || fromDevice()) { return false; }
      return (parseInt(ls(function () { return w.localStorage.getItem('cw-jump-known'); }, '') || '0', 10) || 0) > Date.now();
    },
    connectNow: function (next) {
      var site = JUMP_SITE[String(w.location.hostname || '').toLowerCase()];
      var a = new Uint8Array(16);
      w.crypto.getRandomValues(a);
      var st = Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      var ok = ss(function () {
        w.sessionStorage.setItem('cw-carry-state', st);
        w.sessionStorage.setItem('cw-jump-next', next || (w.location.pathname + w.location.search + w.location.hash));
        w.sessionStorage.setItem('cw-jump-connect', site);
        return true;
      }, false);
      if (ok) { w.location.href = 'https://cw-carry.jessieupp.workers.dev/jump?to=' + site + '&state=' + st + '&connect=1'; }
    },
    offerConnect: function (box, next) {
      if (!box || !w.CW.connectKnown()) { return; }
      var d = w.document, p = d.createElement('p'), b = d.createElement('button');
      p.textContent = 'You are already signed in on another of our sites.';
      p.style.margin = '0 0 10px';
      b.type = 'button';
      b.textContent = 'Connect now';
      b.style.marginBottom = '22px';
      b.onclick = function () { w.CW.connectNow(next); };
      box.insertBefore(b, box.firstChild);
      box.insertBefore(p, b);
    },
    signOutAll: function () {
      if (!jumpOn()) { return false; }
      ls(function () {
        var t = w.localStorage.getItem('cw-token') || '';
        var who = w.localStorage.getItem('cw-id') || w.localStorage.getItem('appear-id') || '';
        if (t && who) {
          w.fetch('https://cw-api-gate.jessieupp.workers.dev?action=signOutPass&appearId=' + encodeURIComponent(who) + '&meToken=' + encodeURIComponent(t), { keepalive: true, referrerPolicy: 'no-referrer' }).catch(function () {});
        }
      });
      w.CW.forget();
      w.location.href = '/signout/#all=1';
      return true;
    },
    forget: function () {
      ls(function () {
        for (var i = 0; i < CLEAR.length; i++) { w.localStorage.removeItem(CLEAR[i]); }
        ss(function () {
          w.sessionStorage.removeItem('cw-view-as');
          w.sessionStorage.removeItem('cw-view-as-name');
          w.sessionStorage.removeItem(OUT_KEY);
          w.sessionStorage.removeItem('cw-jump-pending');
          w.sessionStorage.removeItem('cw-jump-next');
          w.sessionStorage.removeItem('cw-carry-state');
        });
        w.localStorage.removeItem('cw-jump-retry');
        Object.keys(w.localStorage).forEach(function (k) {
          if (k.indexOf('cw-edit-') === 0) { w.localStorage.removeItem(k); }
        });
        clearAnswerCopies();
      });
      w.CW_ID = '';
    }
  };
})(window);
