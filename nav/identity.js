/* Creating.Works — who is looking at this page.
 *
 * Load this FIRST in <head>, with no defer and no async:
 *     <script src="/nav/identity.js?v=1"></script>
 *
 * It must run before a page's own script, which is the whole reason it exists.
 * topbar.js is deferred, so anything that asked topbar ran too early and got nothing,
 * and that is why the same lookup ended up copied into ten pages and drifted apart.
 *
 * Every page asks the same question the same way:
 *     var me = CW.me();
 *     if (!me.known) { ...ask them to sign in... }
 *     fetch(url + '?CWid=' + encodeURIComponent(me.id));
 *     localStorage.setItem('draft-' + me.key, text);
 *
 * This resolves who. It never decides what a page is allowed to show.
 * It does not, and cannot, carry a person between domains: a script loaded from
 * anywhere still reads the storage of the page that loaded it.
 */
(function (w) {
  'use strict';
  if (w.CW && w.CW.me) { return; }              // already loaded, never define twice

  var WHO   = ['CWid', 'memberCard', 'appearId', 'me'];
  var KEEP  = ['cw-id', 'appear-id'];           // where a person is remembered
  var CLEAR = ['cw-id', 'appear-id', 'cw-photo', 'cw-photo-for', 'cw-token', 'cw-first'];

  function ls(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }

  /* Dots and case are noise. `w.hss` and `whss` are one person, and every storage
     key, cache key and comparison uses this form so they never split in two. */
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
    w.CW_ID = id;                                // topbar.js and older pages still read this
    ls(function () {
      for (var i = 0; i < KEEP.length; i++) { w.localStorage.setItem(KEEP[i], id); }
    });
    return id;
  }

  /* Take the person out of the address bar without reloading, and without losing a
     group id or an event id, which are not people. history.replaceState so the version
     carrying the id is not left sitting in the back button either. */
  function strip() {
    ls(function () {
      var url = new URL(w.location.href), hit = false;
      for (var i = 0; i < WHO.length; i++) {
        if (url.searchParams.has(WHO[i])) { url.searchParams.delete(WHO[i]); hit = true; }
      }
      if (!hit || !w.history || !w.history.replaceState) { return; }
      var q = url.searchParams.toString();
      w.history.replaceState({}, '', url.pathname + (q ? '?' + q : '') + url.hash);
    });
  }

  /* Resolve once, now, before any page script runs.

     An id in the address used to win outright: it was saved over whoever the device already
     knew and then wiped from the address bar, so opening somebody else's link quietly made
     you them, with nothing on screen to say so. That was the URL-as-password problem a real
     sign-in was built to end.

     The address is now believed only when there is nobody to contradict it, or when it names
     the same person the device already holds. Sign-in still works: it remembers you before it
     redirects, so the id it carries matches. A link naming somebody else is dropped, and taken
     out of the address either way, because an id in an address is a credential and does not
     belong on screen. Signing out first is how you become somebody else on purpose. */
  var stored = fromDevice();
  var fromLink = fromUrl();
  var found = '';
  if (fromLink && (!stored || normalise(fromLink) === normalise(stored))) {
    found = remember(fromLink);
    strip();
  } else if (stored) {
    found = stored;
    w.CW_ID = stored;
    if (fromLink) { strip(); }
  }

  w.CW = {
    /* The one call. Always the same shape, never null, so CW.me().id cannot throw
       on a page nobody has signed in to. */
    me: function () {
      var id = String(w.CW_ID || '').trim() || fromDevice();
      return { id: id, key: normalise(id), known: !!id };
    },
    remember: function (id) { return remember(id); },
    normalise: normalise,
    /* Signing out is this list. It lived inside one page, which is why it was easy to
       get wrong; it lives here now so there is one definition of leaving. */
    forget: function () {
      ls(function () {
        for (var i = 0; i < CLEAR.length; i++) { w.localStorage.removeItem(CLEAR[i]); }
        Object.keys(w.localStorage).forEach(function (k) {
          if (k.indexOf('cw-edit-') === 0) { w.localStorage.removeItem(k); }
        });
      });
      w.CW_ID = '';
    }
  };
})(window);
