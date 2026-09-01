/* Creating.Works — who is looking at this page.
 *
 * Load this FIRST in <head>, with no defer and no async:
 *     <script src="/nav/identity.js?v=5"></script>
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
  var CLEAR = ['cw-id', 'appear-id', 'cw-photo', 'cw-photo-for', 'cw-photo-at', 'cw-token', 'cw-first',
               'cw-view-as', 'cw-view-as-name', 'cw-super'];
  /* Looking at the site as somebody else, for the handful of people who run it.
     Deliberately a SEPARATE key from cw-id. Signing in and standing in somebody's shoes are
     different things, and keeping them apart is what lets every page know the difference and
     refuse to write. It is also why signing out ends it: it is in the list above. */
  var VIEW_KEY = 'cw-view-as';

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
  /* 2026-08-31. Closed the rest of the way, after it happened to a real person.

     Somebody opened a link carrying Jessie's id on a device that held nobody. The rule below
     used to believe the address when there was nobody to contradict it, so he became her: her
     name and her face in the corner, her profile with the edit buttons on it. He was never
     asked for a code, because he never signed in. Nothing had gone wrong; that was the rule.

     An id in an address is now never believed on its own. It is stripped and ignored. The only
     thing that makes somebody signed in is signing in, which writes the id to this device
     directly and does not go near the address bar. A link that names the person already here
     still matches, so returning by one of our own links is unchanged. */
  var stored = fromDevice();
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
    /* Nobody here, and the address names somebody. Take it out and stay signed out. */
    strip();
  }

  /* ONE PERSON, ONE ID.
     Somebody who came from Appear has carried a short id in this browser ever since; everybody
     who signs up here gets a long one. Both work, because every reader now matches on either.
     But an old member keeps writing their short id into anything new they make, so the mix never
     resolves on its own. Once per browser, ask the server which id this person should carry and
     keep that instead.

     It only ever swaps for an id the server says belongs to the same person, and any failure
     leaves what is already here alone. Nothing is asked of anybody and nothing is lost: the old
     id keeps working everywhere, because matching on any id is what made this safe to do.
     Jessie's call, 2026-09-01. */
  (function swapToOneId() {
    /* ONE PERSON AT A TIME, 2026-09-01.
       This was on for everybody for a few minutes and it moved Jessie onto her long id while
       getMyGroups still matched one id exactly, so she lost all 22 groups she hosts. Fourteen
       reads and writes matched exactly; all fourteen were fixed by audit that evening.

       It is back on for the ids named below and nobody else. Jessie is the one name on it,
       because she is the person who will notice within a minute if anything is wrong. Add an id
       here to widen it; empty the list to stop it entirely. */
    var SWAP_ONLY = ['w.hss'];
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
          if (!d || d.status !== 'ok' || !d.known) { return; }   // unknown: keep what we have
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
    return ls(function () { return String(w.localStorage.getItem(VIEW_KEY) || '').trim(); }, '');
  }

  w.CW = {
    /* The one call. Always the same shape, never null, so CW.me().id cannot throw
       on a page nobody has signed in to.

       While somebody is looking as another person, `id` is that other person, because every
       page reads this and every page should show what they would see. `viewing` says so, and
       anything that writes is expected to check it and refuse. */
    me: function () {
      var real = String(w.CW_ID || '').trim() || fromDevice();
      var seen = viewingAs();
      if (seen && normalise(seen) !== normalise(real)) {
        return { id: seen, key: normalise(seen), known: true, viewing: true, realId: real };
      }
      return { id: real, key: normalise(real), known: !!real, viewing: false, realId: real };
    },
    /* Who is actually signed in, whatever they are looking at. Anything that writes, or that
       decides what somebody is allowed to do, asks this rather than me(). */
    realMe: function () {
      var real = String(w.CW_ID || '').trim() || fromDevice();
      return { id: real, key: normalise(real), known: !!real };
    },
    viewingAs: viewingAs,
    viewAs: function (id, name) {
      id = String(id || '').trim();
      ls(function () {
        if (!id) { w.localStorage.removeItem(VIEW_KEY); w.localStorage.removeItem('cw-view-as-name'); }
        else { w.localStorage.setItem(VIEW_KEY, id); w.localStorage.setItem('cw-view-as-name', String(name || '')); }
      });
      return id;
    },
    stopViewing: function () {
      ls(function () {
        w.localStorage.removeItem(VIEW_KEY);
        w.localStorage.removeItem('cw-view-as-name');
      });
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
