/* Creating.Works — who is looking at this page.
 *
 *  Version: V22 | Date: 2026-09-19 | LAST CHANGE: CW.withRef - who is sharing, added to a link, in ONE place. Jessie:
 *  "everything that is shareable For our share links should have a reference of who's sharing it." Two pages each had
 *  their own copy and three Share buttons had none. It lives here because the code is worked out by codeFor and the
 *  sharer is the person at the keyboard, both of which are already in this file.
 *  V21 | Date: 2026-09-19 | LAST CHANGE: both sites are shut to anybody who has not proved who they are.
 *  2Gather, in her words after trying it: "it works as it shoudld. It requires everyone to sign in to use the site. And
 *  any page." Creating.Works is one message and no door: "Creating works
 *  says one a message on the front end: coming soon to serve you. and nobody can even log in." So /intro/ is shut too -
 *  it was the way in. Open there: the home page, and the terms, privacy policy and code of conduct, only because
 *  2Gather's own pages link at them. On 2Gather the three sign-in doors stay open, and nothing else does.
 *  V20 | Date: 2026-09-19 | LAST CHANGE: Creating.Works is on for everybody. Jessie, asked whether the wall
 *  went on for both sites: "just for creating.works". So no Creating.Works page draws for somebody who has not proved
 *  who they are - they get the Coming soon message - while 2Gather stays behind ?lock=1 until she says. ?lock=0 takes it
 *  off one device on either site, and it is the way back if anything is wrong.
 *  V19 | Date: 2026-09-19 | LAST CHANGE: on Creating.Works a walled page answers with the message rather
 *  than with a page. Jessie: "creating.works should be saying a mesasge - not an actual page - what hapepned to the
 *  messeage saying coming soon to serve you?" It now lands on the home page, which says Coming soon to serve YOU. and
 *  nothing else, and that home page is never walled itself. /intro/ stays the side door and stays open.
 *  V18 | Date: 2026-09-19 | LAST CHANGE: no page draws for somebody who has not proved who they are.
 *  Jessie: "make all pages require log in. no page should be available to outsiders until we say ohterwise", then
 *  "F all" - a shared event link and a QR code on a flyer go to the sign-in screen first and land where they were
 *  headed afterwards. Off until ?lock=1 switches it on for one device; ?lock=0 takes it off. The doors stay open, and
 *  so do the terms, the privacy policy and the code of conduct, because terms nobody may read are terms nobody can
 *  agree to. THIS FILE NOW DECIDES WHETHER A PAGE MAY BE SEEN AT ALL, which the note below said it never would - that
 *  line is out of date on purpose: a second file would be a second version number to keep in step, and the proof it
 *  reads is already here. It is a curtain and not a door; the door is the audience guard in Code.js.
 *  V17 | Date: 2026-09-19 | LAST CHANGE: a remembered id is not a signed-in person. Jessie, 2026-09-19, after
 *  sharing an event: "it removed the admin bar at the top but still shows him logged in a sME". Being signed in was a NAME
 *  LEFT IN A BROWSER: cw-id was written by whatever last put a person here, and from then on every page treated the device
 *  as that person, with nothing ever asking it to prove so. All three doors that really sign somebody in - the emailed
 *  code, signing up, and Google - mint cw-token beside the id, so that token, unexpired and matching, IS the proof. An id
 *  sitting alone without one is a leftover rather than a session: it is cleared, and the device is nobody until somebody
 *  signs in through a door. This signs out anybody whose sign-in has run out, which is the point, and it is the only thing
 *  that takes a leaked identity off somebody else's phone without them having to know to do it.
 *  V14 | Date: 2026-09-10 | LAST CHANGE: a super admin can view the site signed out, and every page asking CW is told nobody is here.
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
 * This resolves who, and since V18 it also decides whether a page may be drawn at all - see THE WALL below.
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
  /* AN ID NAMING SOMEBODY ELSE BECOMES THEIR CODE. Jessie, 2026-09-18: "All I know is if I go to a
     URL with the ID exposed in the domain, I don't ever want to see that again. This shouldn't
     happen, right?" Right.

     WHO above takes out the ids that say "this is me" - CWid, memberCard, appearId, me - and has
     since August. `show` was never in that list, because deleting it would lose WHICH person the
     address is opening. So it stayed, and it is the one she kept seeing.

     It is not deleted, it is translated: ?show=<id> becomes ?v=<code>, the same six characters
     2gather.network/ikigai/?p= reads and a share link carries as r=. Worked out FROM the id, so
     nothing is stored and nothing is asked for - and it happens here, in the file every page loads
     before its own scripts run, so it covers every old link in anybody's history, in a message or
     in a screenshot, not only the links we go on to fix.

     `id` is deliberately NOT translated: on /group/ and /event/ it names a group or an event, not
     a person, and those are not people. */
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

  /* A REMEMBERED ID IS NOT A SIGNED-IN PERSON. Jessie, 2026-09-19, after sharing an event: "it
     removed the admin bar at the top but still shows him logged in a sME".

     Being signed in was a NAME LEFT IN A BROWSER. cw-id was written by whatever last put a person
     here - an address that named somebody, an older copy of this file that adopted one, a page that
     read an id and remembered it - and from then on every page treated this device as that person.
     Nothing ever asked the device to prove it, so a name that arrived by accident stayed for ever.

     All three doors that really sign somebody in - the emailed code, signing up, and Google - mint
     cw-token and put it beside the id. So that token, unexpired, IS the proof, and an id sitting
     alone without one is a leftover rather than a session. It is cleared rather than honoured, and
     the device is nobody until somebody signs in through a door.

     THIS SIGNS OUT ANYBODY WHOSE SIGN-IN HAS RUN OUT, which is the point, and it is the only thing
     that takes a leaked identity off somebody else's phone without them having to know to do it. */
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
    /* Nobody here, and the address names somebody. Take it out and stay signed out. */
    strip();
  }

  /* AND ALWAYS, WHOEVER IS HERE. Every branch above turns on fromLink or stored - the ids that say
     "this is me" - so a signed-out browser opening ?show=<somebody else> matched none of them and
     the address was left exactly as it arrived. Jessie found it in a private window within minutes:
     the id was still sitting in the bar.
     strip() only rewrites when it actually finds something, so calling it again costs nothing. */
  strip();

  /* ── NO PAGE UNTIL SOMEBODY HAS PROVED WHO THEY ARE ──────────────────────────────────────────
     Jessie, 2026-09-19: "make all pages require log in. no page should be available to outsiders
     until we say ohterwise". Asked whether a shared event link, or a QR code on a flyer, should
     stay readable to somebody with no account, she answered "F all": the sign-in screen comes
     first, and they land where they were headed afterwards.

     IT LIVES IN THIS FILE rather than in one of its own because this is the file that already
     runs first, in the head, on every page - and the only thing that can answer the question is
     twenty lines above: a token beside the id, unexpired, belonging to the person being drawn.
     A second file would be a second thing to keep in step, and the version number a page asks
     for is exactly the thing that drifts apart.

     AND IT IS A CURTAIN, NOT A DOOR. It stops a browser. It does not stop a script: anybody
     typing an address straight at the backend never loads this file at all, and a browser
     holding a cached older copy of it has none of this either. The door is the audience guard in
     Code.js, which is watching and still refusing nothing. That is written down here plainly so
     nobody reads the curtain as the door, which is the exact mistake of 2026-09-19.

     OFF UNTIL SHE SWITCHES IT ON. ?lock=1 turns it on for this device and nobody else's, ?lock=0
     turns it off again, and the word is taken out of the address either way - a parameter left
     sitting in the bar is the fault that handed her account to somebody else, and no share link
     is going to carry this one too. */
  var LOCK_KEY = 'cw-lock';
  (function wall() {
    var here = String(w.location.pathname || '/');
    var onCW = String(w.location.hostname || '').indexOf('creating.works') >= 0;

    /* THE DOORS, AND THE RECORD SOMEBODY HAS TO BE ABLE TO READ BEFORE AGREEING TO IT. Walling
       the sign-in page would leave nobody able to sign in ever again, and terms nobody may read
       are terms nobody can agree to. Neither names a person or carries anybody's data.
       Creating.Works signs people in on its OWN page and has to: each site keeps its own storage,
       so somebody signed in on 2gather.network is a stranger here - intro/index.html says so in
       its own comment - which is why /intro/ is the open one there rather than /signin/. */
    /* CREATING.WORKS IS ONE MESSAGE AND NO DOOR. Jessie, 2026-09-19: "Creating works says one a
       message on the front end: coming soon to serve you. and nobody can even log in. It just says
       one. A message on the front end coming soon to serve you." So /intro/ is shut with the rest -
       it was the way in, and there is meant to be no way in. The three kept open are the terms, the
       privacy policy and the code of conduct, and ONLY because 2Gather's own pages link straight at
       them: shutting those puts somebody signing up to 2Gather on Coming soon when they press
       Terms. Nothing else is open, the legal archive and the license included. */
    var OPEN = onCW
      ? ['/', '/terms-of-service', '/privacy-policy', '/code-of-conduct']
      : ['/signin', '/signup', '/signin-google'];

    /* Read first, and out of the address before anything is built from it. */
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
    /* ON FOR EVERYBODY, BOTH SITES. Jessie, 2026-09-19, having tried it: "2gather - it works as it
       shoudld. It requires everyone to sign in to use the site. And any page." ?lock=0 still takes
       it off one device, which is the way back if anything is wrong. */
    if (ls(function () { return w.localStorage.getItem(LOCK_KEY); }, null) === '0') { return; }

    for (var i = 0; i < OPEN.length; i++) {
      if (here === OPEN[i] || here.indexOf(OPEN[i] + '/') === 0 || here.indexOf(OPEN[i] + '.') === 0) { return; }
    }

    /* `found` above is the PROVED person: an id with a live token beside it. Anything less is
       nobody, which is the whole rule. A super admin looking at the site as a signed-out visitor
       is still proved here and is not sent anywhere, because that view is a way of looking rather
       than a way of leaving - and bouncing her out of it would take away the way back. */
    if (found) { return; }

    /* replace rather than href, so the page nobody was allowed to see is not left sitting in the
       back button either. */
    /* The return address is built with the lock word taken OUT rather than trusting that the
       rewrite above has already landed - found by running it: the first thing ?lock=1 did was
       carry itself into next= and hand it back on the way in. */
    var back = here;
    ls(function () {
      var u = new URL(w.location.href);
      u.searchParams.delete('lock');
      var q = u.searchParams.toString();
      back = u.pathname + (q ? '?' + q : '') + u.hash;
    });
    /* CREATING.WORKS ANSWERS WITH ITS MESSAGE, NOT WITH A PAGE. Jessie, 2026-09-19, seeing the
       first version send her into the Start a conversation form: "creating.works should be saying
       a mesasge - not an actual page - what hapepned to the messeage saying coming soon to serve
       you?" So a walled page there lands on the home page, which says "Coming soon to serve YOU."
       and nothing else - the page Doug asked for on 2026-09-14 and the one I should never have
       walled. /intro/ stays the side door for anybody who has one, exactly as it was. */
    w.location.replace(onCW ? '/' : '/signin/?next=' + encodeURIComponent(back));
  })();

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
    /* ── WHO IS SHARING, ADDED TO A LINK, IN ONE PLACE ───────────────────────────────────────
       Jessie, 2026-09-19: "everything that is shareable For our share links should have a
       reference of who's sharing it. Is this accurate on the site on every page?" It was not. The
       event page and the group invite page each carried their own copy of this, and the three
       other Share buttons - the calendar's, My events' and Appear's - carried none, so the same
       event credited you from one button and nobody from another.

       It belongs here because the answer is already here: the six characters are worked out from
       an id by codeFor, and the person sharing is realMe - the person at the keyboard, never
       whoever is being viewed, or a link copied while looking at somebody else would be credited
       to them. A CODE and never the id: an id in an address is the key to a person on this stack.

       Nothing is added for somebody who is nobody, and nothing is added twice. */
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
