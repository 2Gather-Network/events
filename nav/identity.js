/* Creating.Works — who is looking at this page.
 *
 *  Version: V14 | Date: 2026-09-10 | LAST CHANGE: a super admin can view the site signed out, and every page asking CW is told nobody is here.
 *  V13 | Date: 2026-09-07 | LAST CHANGE: viewing as somebody lives per tab, in sessionStorage.
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
  /* SIGNED OUT, AS A VIEW. Jessie, 2026-09-10, looking at her strip reading "Jessie Upp | Change
     view": "add a signed out view to here so i know hwat an even looks like or any page looks like
     for signed out".
     Signing out for real to look would cost her the sign-in, and a private window shows nothing of
     the strip that gets her back. So it is a view, the same shape as viewing as somebody: its own
     key, per tab, beside cw-view-as and never in place of cw-id. While it is on, me() and realMe()
     both answer nobody, so every page that asks CW draws what a visitor sees and has no id to write
     with. The id on the device is never read out, never cleared and never written. Only atKeyboard()
     below still answers her, and only the admin strip asks it, because the strip is the way back. */
  var OUT_KEY = 'cw-view-out';

  function ls(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }
  /* VIEWING AS SOMEBODY LIVES PER TAB. Moved from localStorage on 2026-09-07.
     Jessie: "Would you say that it would be an issue if I'm logged in on one tab as me and doing as
     Jerry as another on another tab?" It was. localStorage is shared by every tab on the site, so
     there were never two sessions, there was one, and the last tab to switch decided for both. The
     other tab went on showing the old person until its next read and then quietly became Jerry.
     sessionStorage is per tab, survives a reload and starts empty in a new tab, which is the shape
     this always wanted. Signing in is still localStorage: that IS meant to follow you everywhere. */
  function ss(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }
  /* Anybody carrying the old key would be stuck viewing somebody with no tab to end it in, so it
     is cleared once, here, on load. */
  ls(function () { w.localStorage.removeItem('cw-view-as'); w.localStorage.removeItem('cw-view-as-name'); });

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
  /* ONE DEVICE, ONE ANSWER. 2026-09-03.

     localStorage can hold `appear-id` and `cw-id` with DIFFERENT ids for one person, and which
     page finds you depends on which key it reads first. That is not theoretical: on 2026-09-02
     /ikigai/ was changed to read cw-id first and stopped finding Jessie while /profile-edit/,
     which reads appear-id, found her instantly. It was reverted, and the revert made the two
     pages agree without fixing why they could disagree.

     They drift because four places wrote ONE key and left the other behind: the events page and
     three lines on the giving page. Those now write both, and this reconciles whatever a device
     is already carrying before any page asks.

     `cw-id` WINS, and the first version of this got it backwards.

     It made appear-id win, on the reasoning that /ikigai/ and /profile-edit/ read that key first.
     But THIS file reads cw-id first, in KEEP above, and CW_ID is what the top bar, the group
     pages and the operations page all ask. So on any device where the two disagreed, the person
     the whole site thought you were changed, and Jessie's operations page stopped recognising her
     as an operator within the hour: "shows no data. this worked fine before".

     Which value is chosen barely matters once both keys hold it, because every reader matches on
     any id a person answers to. What matters is that the choice does not move anybody. cw-id is
     what CW_ID already answered, so nobody moves. Exactly the rule I broke to get here: never
     change the page that works to match the page that is broken. 2026-09-03. */
  (function oneAnswer() {
    ls(function () {
      var a = String(w.localStorage.getItem('appear-id') || '').trim();
      var c = String(w.localStorage.getItem('cw-id') || '').trim();
      if (!a || !c) { return; }                       // one of them, or neither: nothing to settle
      if (normalise(a) === normalise(c)) { return; }  // the same person spelled two ways is fine
      w.localStorage.setItem('appear-id', c);
    });
  })();

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
    /* EMPTY, AND IT HAS TO BE. canonicalId became operators only on 2026-09-01, because handing
       back "is this a real person" for a five-character id is an enumeration oracle and an id is
       a password here. A page cannot call it any more, so this list would silently do nothing.
       When the swap widens, it moves to a job that runs on the server against the sheet, not to
       a page asking on somebody's behalf. */
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
    // Nobody is being viewed as while the view is signed out. Whoever was picked before is still in
    // the key only if something wrote around viewSignedOut(), and it must not come back here.
    if (signedOutView()) { return ''; }
    return ss(function () { return String(w.sessionStorage.getItem(VIEW_KEY) || '').trim(); }, '');
  }
  function signedOutView() {
    return ss(function () { return w.sessionStorage.getItem(OUT_KEY) === '1'; }, false);
  }
  function nobody() {
    return { id: '', key: '', known: false, viewing: false, realId: '', signedOutView: true };
  }

  /* CW_ID ANSWERS NOBODY TOO, because the top bar's fallback and the older pages read it directly.
     Only the global is emptied. The id stays on the device, where atKeyboard() reads it. */
  if (signedOutView()) { w.CW_ID = ''; }

  w.CW = {
    /* The one call. Always the same shape, never null, so CW.me().id cannot throw
       on a page nobody has signed in to.

       While somebody is looking as another person, `id` is that other person, because every
       page reads this and every page should show what they would see. `viewing` says so, and
       anything that writes is expected to check it and refuse. */
    me: function () {
      if (signedOutView()) { return nobody(); }
      var real = String(w.CW_ID || '').trim() || fromDevice();
      var seen = viewingAs();
      if (seen && normalise(seen) !== normalise(real)) {
        return { id: seen, key: normalise(seen), known: true, viewing: true, realId: real };
      }
      return { id: real, key: normalise(real), known: !!real, viewing: false, realId: real };
    },
    /* Who is actually signed in, whatever they are looking at. Anything that writes, or that
       decides what somebody is allowed to do, asks this rather than me(). */
    /* NOBODY WHILE THE VIEW IS SIGNED OUT, 2026-09-10. Pages ask this for who may write and for the
       id put into a link, and a visitor has neither. Answering her here would put the pencil, her
       RSVPs and her id in every address back on the page she asked to see without them. */
    realMe: function () {
      if (signedOutView()) { return { id: '', key: '', known: false }; }
      var real = String(w.CW_ID || '').trim() || fromDevice();
      return { id: real, key: normalise(real), known: !!real };
    },
    /* THE PERSON AT THE KEYBOARD, whatever view is on. ONLY THE ADMIN STRIP ASKS THIS. Jessie,
       2026-09-10: the signed-out view needs "a way back to herself", and the strip can only offer
       one if it still knows she is a super admin while every page is being told nobody is here.
       A page asking this instead of me() or realMe() would undo the view, so none should. */
    atKeyboard: function () {
      var real = String(w.CW_ID || '').trim() || fromDevice();   // CW_ID is empty in the view
      return { id: real, key: normalise(real), known: !!real };
    },
    viewingAs: viewingAs,
    signedOutView: signedOutView,
    /* One view at a time. Choosing signed out ends viewing as somebody, and choosing a person ends
       signed out, so the strip can never be saying one thing while the pages do another. */
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
    // Back to me ends either view, so there is one way back whichever one is on.
    stopViewing: function () {
      ss(function () {
        w.sessionStorage.removeItem(VIEW_KEY);
        w.sessionStorage.removeItem('cw-view-as-name');
        w.sessionStorage.removeItem(OUT_KEY);
      });
    },
    remember: function (id) { return remember(id); },
    normalise: normalise,
    /* Signing out is this list. It lived inside one page, which is why it was easy to
       get wrong; it lives here now so there is one definition of leaving. */
    forget: function () {
      ls(function () {
        for (var i = 0; i < CLEAR.length; i++) { w.localStorage.removeItem(CLEAR[i]); }
        // Viewing lives in sessionStorage now, and signing out still ends it.
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
