(function (w) {
  'use strict';
  if (w.CW && w.CW.me) { return; }              

  var WHO   = ['CWid', 'memberCard', 'appearId', 'me'];
  var KEEP  = ['cw-id', 'appear-id'];           
  var CLEAR = ['cw-id', 'appear-id', 'cw-photo', 'cw-photo-for', 'cw-photo-at', 'cw-token', 'cw-first',
               'cw-view-as', 'cw-view-as-name', 'cw-super', 'cw-lastEmail'];
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
    ls(function () { for (var ci = 0; ci < CLEAR.length; ci++) { w.localStorage.removeItem(CLEAR[ci]); } });
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
      var out = input;
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf(GATE) > -1 && url.indexOf('action=') > -1 && url.indexOf('meToken=') === -1) {
          var t = ls(function () { return w.localStorage.getItem('cw-token') || ''; }, '');
          if (t) {
            var joined = url + (url.indexOf('?') > -1 ? '&' : '?') + 'meToken=' + encodeURIComponent(t);
            out = (typeof input === 'string') ? joined : new Request(joined, input);
          }
        }
      } catch (e) { out = input; }
      return orig.call(this, out, init);
    };
  })();

  (function wall() {
    var here = String(w.location.pathname || '/');
    var onCW = String(w.location.hostname || '').indexOf('creating.works') >= 0;

    var OPEN = onCW
      ? ['/', '/terms-of-service', '/privacy-policy', '/code-of-conduct', '/ops', '/vision', '/license']
      : ['/signin', '/signup', '/signin-google'];

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

    if (found) { return; }

    var back = here;
    ls(function () {
      var u = new URL(w.location.href);
      u.searchParams.delete('lock');
      var q = u.searchParams.toString();
      back = u.pathname + (q ? '?' + q : '') + u.hash;
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

  w.CW = {
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
    forget: function () {
      ls(function () {
        for (var i = 0; i < CLEAR.length; i++) { w.localStorage.removeItem(CLEAR[i]); }
        ss(function () {
          w.sessionStorage.removeItem('cw-view-as');
          w.sessionStorage.removeItem('cw-view-as-name');
          w.sessionStorage.removeItem(OUT_KEY);
        });
        Object.keys(w.localStorage).forEach(function (k) {
          if (k.indexOf('cw-edit-') === 0) { w.localStorage.removeItem(k); }
        });
      });
      w.CW_ID = '';
    }
  };
})(window);
