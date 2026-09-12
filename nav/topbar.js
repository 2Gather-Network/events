/*
  Copyright 2026 DayBalancer LLC. All rights reserved.

  The code and the content here power Creating.Works, DayBalancer, Appear Network,
  and 2Gather. They are published so they can be read, audited, and dated.

  Running either as a separate offering requires a license, whether you brand it as
  ours or as your own, and whether or not money changes hands.

  hello@creating.works
*/
/*  Version: V6.04 | Date: 2026-09-12 | LAST CHANGE: Sign up reads white on the event page, where a page rule had made it blue on blue; each page keeps its address in the tab as it is left, so Support and FAQ can name the page before. V6.03: the Creating.Works mark is the gradient ring with 🌱 inside, in place of the arrows. Jessie: "A - update now".
    Version: V6.02 | Date: 2026-09-12 | LAST CHANGE: on creating.works, a page that sets window.CW_SHOW_BAR gets the bar, with the Creating.Works ring mark, "Because creating works." and no sign-in pills when signed out. Nothing changes on 2gather.network.
    Version: V6.01 | Date: 2026-09-10 | LAST CHANGE: your own profile page asks a signed-out visitor to sign in, as My events and My groups already do.
    V6.00 | Date: 2026-09-10 | LAST CHANGE: Change view offers Signed out, and the strip says "Viewing signed out" with Back to me.
    V5.99 | Date: 2026-09-10 | LAST CHANGE: cwCountedGroups leaves out groups everybody is in (Appear Network), so My groups is drawn only for somebody who joined one.
    V5.98 | Date: 2026-09-10 | LAST CHANGE: Post an event goes to /myevents/new/ rather than the calendar's overlay form.
    V5.50 | Date: 2026-08-26 | LAST CHANGE: the bar runs edge to edge on every page.
    V5.42 | Date: 2026-08-26 | LAST CHANGE: ?chrome=2 full-bleed also stretches a centred flex item.
    V5.41 | Date: 2026-08-26 | LAST CHANGE: ?chrome=2 previews the full-bleed bar.
    V5.40 | Date: 2026-08-26 | LAST CHANGE: your own id comes out of show= as well.
    V5.31 | Date: 2026-08-26 | LAST CHANGE: the front door never shows a face.
    V5.30 | Date: 2026-08-26 | LAST CHANGE: Creating.Works pages strip their ids too.
    V5.20 | Date: 2026-08-26 | LAST CHANGE: ids come out of the address bar everywhere, and your photo follows you.
    V5.00 | Date: 2026-08-26 | LAST CHANGE: Sign in is ours, and it carries you back where you were.
    V4.51 | Date: 2026-08-26 | LAST CHANGE: a page that is somebody's own asks first and draws nothing else.
    V4.12 | Date: 2026-08-26 | LAST CHANGE: a page's own mark hides when the bar draws one.

    ONE FILE, EVERY PAGE. Each 2Gather page loads /nav/topbar.js and nothing else.
    Change a label, a link or the order here and every page changes with it.

    The rule the bar follows: a tab names a place, and its menu is what you do there.
    ?topbar=0 hides the bar on a page, for when something needs looking at without it.
*/
(function () {
  'use strict';

  var SHOW_EVERYWHERE   = true;   // the bar draws on every page that loads this file

  // Where "Sign in" goes. Today it is Glide, which is the last dependency we have on
  // it. When our own sign-in page exists, this one line points every page at it, on
  // both domains, because every page reads it from here rather than holding its own
  // copy. Pages read window.CW_SIGNIN, so it is set before anything draws.
  window.CW_SIGNIN = window.CW_SIGNIN || (function () {
    var SIGNIN = 'https://2gather.network/signin/';
    try {
      var here = window.location.pathname || '';
      // Already on sign-in: carrying this page as the way back would send somebody
      // who just entered a code straight back to entering a code.
      if (here.indexOf('/signin') === 0) { return SIGNIN; }
      return SIGNIN + '?next=' + encodeURIComponent(here + window.location.search);
    } catch (e) { return SIGNIN; }
  })();
  window.CW_SIGNUP = window.CW_SIGNUP || 'https://2gather.network/signup/';
  // GROUPS EVERYBODY IS IN DO NOT MAKE SOMEBODY "IN A GROUP". Jessie, 2026-09-10: "Dont' show my
  // groups unless they are part of a group AND don't count beYd4M39RCqGSbP4KsNqGQ as part of a group
  // - htat's an appear group and everyone included in site". Appear Network holds everybody on the
  // site, so counting it drew My groups for everybody. Listed once, here, because every page loads
  // this file; the rails ask cwCountedGroups rather than keeping a copy of the list.
  window.CW_EVERYONE_GROUPS = window.CW_EVERYONE_GROUPS || ['beYd4M39RCqGSbP4KsNqGQ'];
  window.cwCountedGroups = window.cwCountedGroups || function (list) {
    var skip = window.CW_EVERYONE_GROUPS || [];
    return (list || []).filter(function (g) {
      var id = String((g && (g.groupID || g.groupId || g.id)) || g || '').trim();
      return id && skip.indexOf(id) === -1;
    });
  };
  var HIDE_INSIDE_GLIDE = true;   // inside the Glide frame Glide already draws its own bar

  // ---- addresses, all of them, in one place ---------------------------------
  var LOGO     = 'https://2gather.network/images/2gather_logo.png';
  // THE CREATING.WORKS MARK, for the bar on creating.works: the gradient ring from the original
  // creating.works home page with the seedling inside. Jessie, 2026-09-12: "show the icon for creating
  // works on the left", then "put 🌱 inside circle instead", then "A - update now" for the emoji over a
  // drawn seedling, so it matches the seedling beside the name in the pill. Inline, nothing to host.
  var CW_LOGO  = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs>' +
    '<circle cx="18" cy="18" r="16" fill="none" stroke="url(#g)" stroke-width="2.5"/>' +
    '<text x="18" y="24.5" text-anchor="middle" font-size="17">\u{1F331}</text></svg>');
  function onCreatingWorks() { try { return (window.location.hostname || '').toLowerCase().indexOf('creating.works') > -1; } catch (e) { return false; } }
  var EVENTS   = 'https://2gather.network/events';
  // MY EVENTS IS ONE PAGE AND ONE NAME, 2026-09-10. The editing page was built at /myevents/manage/
  // beside a list at /myevents/, and the pair was mistaken for a security split. It was not one:
  // both need you signed in as yourself and both show only your own events. Jessie: "so yes let's
  // make that one if it's not a securit boundary and it should be called myevents just like
  // mygroups". So this word points at /myevents/, matching /mygroups/, and the old address
  // forwards. The real pair is /event/?id= against /myevents/?id=, and that one stays two.
  var MYEVENTS = 'https://2gather.network/myevents/';
  // POSTING IS AT /myevents/new/. 2026-09-10, Jessie's "64 yes". This went to the calendar's
  // ?action=post, which opens the form as an overlay once the whole calendar has loaded;
  // /myevents/new/ opens the same two questions in the page at once.
  var POST     = 'https://2gather.network/myevents/new/';
  var MYGROUPS = 'https://2gather.network/mygroups';
  var START    = 'https://2gather.network/groups/create';
  var JOIN     = 'https://2gather.network/mygroups?join=1';
  var FINDTIME = 'https://2gather.network/find-a-time';
  var COMMONS  = 'https://events.2gather.network/events/yvrgej/zkxbzq';   // The Commons room, still
                                                                          // reachable from a group's Gather button
  var PROFILE  = 'https://2gather.network/profile';
  var EDITME   = 'https://2gather.network/profile-edit';
  var ACCOUNT  = 'https://2gather.network/account';
  var ABOUT    = 'https://2gather.network/about';
  var SUPPORT  = 'https://2gather.network/support';

  /* WHERE THEY WERE, CARRIED RATHER THAN GUESSED. The support form recorded the page somebody came
     from by reading document.referrer, and a referrer is not a record: it is empty on a tab opened
     directly, and Brave strips it. Jessie's own test on 2026-09-07 arrived with ticketFromPage
     blank for exactly that reason.
     The bar knows the page it is drawn on, so it says so. The PATHNAME only, never the query, so
     an id in an address can never travel into a ticket. */
  /* THE PAGE YOU WERE ON, KEPT BY THE SITE. Jessie, 2026-09-12: "We still don't see breadcrumbs on the support
     page or the FAQs page." Their trail named the page before from document.referrer, which her Brave leaves
     empty (see WHERE THEY WERE, CARRIED RATHER THAN GUESSED). Every page with this bar now writes its own
     address into this tab's sessionStorage as it is left, so the next page can read where you came from without
     the browser's help. This tab only, and only ever read back on this site. */
  try {
    window.addEventListener('pagehide', function () {
      try { sessionStorage.setItem('cw-prev-page', JSON.stringify({ href: String(window.location.href), at: Date.now() })); } catch (e) {}
    });
  } catch (e) {}

  function supportUrl() {
    var here = '';
    try { here = String(window.location.pathname || '').trim(); } catch (e) {}
    return here ? (SUPPORT + '?from=' + encodeURIComponent(here)) : SUPPORT;
  }

  // carry says which name that destination reads the person by.
  // ONLY THE PHOTO. Jessie, 2026-09-08: "since 2gather is synchronous adn appear is asynchronous
  // groups are begin decided as more appear. so leat's make the top nav bar only the pphoto and
  // when clicking on it , it goes to my profile. remove groups and evnets from top."
  //
  // Groups are being decided as an Appear thing rather than a 2Gather one, which is decision B6 in
  // the decisions doc arriving in the product. A Groups menu on this bar states an answer that has
  // not been given. Events came off with it, because a bar with one menu on it is a bar that has
  // not decided what it is.
  //
  // The menus are kept below rather than deleted, so putting one back is uncommenting rather than
  // rewriting. Everything in them is still reachable: Find an event and My events from the calendar
  // and My events themselves, and My profile from the photo.
  var NAV = [];
  var NAV_PARKED = [

    { key: 'events', label: 'Events', items: [
      // FIND AN EVENT, because that is what somebody opening this menu is trying to do. "Calendar
      // of events" names the thing rather than the errand. Jessie, 2026-09-07.
      { label: 'Find an event',      url: EVENTS,   carry: 'memberCard' },
      // MY EVENTS CARRIES NOBODY. It used to send the person as `id`, and that id then decided
      // whose list the page drew - which meant that while somebody was using View as someone, an
      // id in the address would have overridden the person they were looking at. The page asks
      // the device now, and the device is what knows both halves. It also keeps a person's id out
      // of an address for no reason, which is the rule everywhere else here.
      { label: 'My events',          url: MYEVENTS },
      { label: 'Post an event',      url: POST,     carry: 'memberCard' }
      // My event profile came off this menu on 2026-09-07. The profile is not an events thing and
      // it is already on More, so it was the same door listed twice.
    ]},
    { key: 'groups', label: 'Groups', items: [
      // Host a group is third, because joining one is what most people are here to do and hosting
      // is the smaller door. It was called Start a group. Jessie, 2026-09-07.
      { label: 'My groups',    url: MYGROUPS, carry: 'CWid' },
      { label: 'Join a group',  url: JOIN,    carry: 'CWid' },
      { label: 'Host a group',  url: START,   carry: 'CWid' }
    ]},
    { key: 'more', label: 'More', items: [
      { label: 'Where do I start?',  url: 'https://2gather.network/welcome/' },
      // Find a Time came off the More menu 2026-08-30. Its home is a Tools tab on the profile,
      // beside Appear and DayBalancer, which is not built yet. The page still works at its own
      // address; it is only the menu entry that has gone.
      // { label: 'Find a Time (Beta)', url: FINDTIME },
      // My profile went back here on 2026-09-04 at Jessie's word, replacing My account, which
      // had replaced it on 2026-09-02 on the reasoning that the account page's own tabs already
      // reach the profile. The traffic goes the other way: the profile is the room people want
      // and the account is the settings behind it.
      //
      // The account page keeps its doors from the commons and from the editor, but it no longer
      // has one on the top bar. Flagged to Jessie the same day rather than fixed here, because
      // adding one is a second change nobody asked for.
      { label: 'My profile',         url: PROFILE,  carry: 'CWid' },
      { label: 'About',              url: ABOUT },
      { label: 'Support',            url: supportUrl() },
      { label: 'Sign out',           signOut: true }
    ]}
  ];

  // ---- who is looking -------------------------------------------------------
  // Only these names carry a person. `id` is a group id on group.html and an
  // event id on event.html, so it is never read here.
  // One definition of who is looking, shared with every page. nav/identity.js loads
  // synchronously ahead of this file and has already resolved and remembered them.
  // The fallback below only runs if identity.js failed to load, so the bar still works.
  function me() {
    if (window.CW && window.CW.me) { return window.CW.me().id; }
    try {
      var p = new URLSearchParams(window.location.search);
      var fromUrl = String(p.get('CWid') || p.get('memberCard') || p.get('me') || p.get('appearId') || '').trim();
      if (fromUrl) return fromUrl;
    } catch (e) {}
    try { return String(window.CW_ID || localStorage.getItem('cw-id') || localStorage.getItem('appear-id') || '').trim(); }
    catch (e) { return ''; }
  }

  // WHO IS SIGNED IN, whatever is on screen. Everything that DISPLAYS asks me(); an id put into an
  // address is not a display, it is a bearer token that the block further down remembers on this
  // device as who you are.
  function realId() {
    try {
      if (window.CW && window.CW.realMe) {
        var r = String(window.CW.realMe().id || '').trim();
        if (r) return r;
      }
    } catch (e) {}
    return me();
  }

  // THE ADDRESS CARRIES THE PERSON SIGNED IN, never the person being looked at.
  //
  // These links were built from me(), which is the person being viewed while View as someone is
  // on. So every "my" link in this bar carried Doug's id, the strip below remembered it, and one
  // click left Jessie's browser holding his id in both keys as who she is, on every page. She
  // found it on 2026-09-07 by his face still being in the bar after Back to me.
  //
  // The pages still show what he sees, because they ask CW.me() and the viewing key travels with
  // the device rather than in the address.
  function link(url, carry) {
    var who = realId();
    if (!who || !carry) return url;
    return url + (url.indexOf('?') > -1 ? '&' : '?') + carry + '=' + encodeURIComponent(who);
  }

  function here() {
    var f = (window.location.pathname || '').toLowerCase();
    if (f.indexOf('mygroups') > -1 || f.indexOf('group') > -1 || f.indexOf('/groups/') > -1) return 'groups';
    if (f.indexOf('event') > -1 || f.indexOf('attendees') > -1 || f.indexOf('intro') > -1) return 'events';
    return '';
  }

  // ---- navigation, same tab, no url on hover --------------------------------
  if (!window._safeNavGo) {
    window._safeNavGo = function (el) {
      try {
        var u = el && el.getAttribute && el.getAttribute('data-nav');
        if (u) { window.location.href = u; }
      } catch (e) {}
      return false;
    };
  }

  function anchor(label, url, cls) {
    return '<a role="link" tabindex="0" class="' + cls + '" data-nav="' + url +
           '" onclick="return _safeNavGo(this)">' + label + '</a>';
  }

  var CARET = '<svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true"' +
              ' style="margin-left:5px;vertical-align:middle;"><path d="M1 1.5L5.5 5.5L10 1.5"' +
              ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---- draw -----------------------------------------------------------------
  function draw() {
    var open = here(), tabs = '', rows = '', i, j, n;

    for (i = 0; i < NAV.length; i++) {
      n = NAV[i];
      if (n.items) {
        tabs += '<span class="cwtb-tab' + (n.key === open ? ' cwtb-on' : '') + '" role="button"' +
                ' tabindex="0" aria-expanded="false" data-menu="' + n.key + '">' + n.label + CARET + '</span>';
        var row = '';
        for (j = 0; j < n.items.length; j++) {
          var it = n.items[j];
          if (it.signOut) {
            if (!me()) { continue; }   // nothing to leave
            row += '<a role="link" tabindex="0" class="cwtb-item" data-signout="1">' + it.label + '</a>';
            continue;
          }
          row += anchor(it.label, link(it.url, it.carry), 'cwtb-item');
        }
        rows += '<div class="cwtb-row" data-row="' + n.key + '">' + row + '</div>';
      } else {
        tabs += anchor(n.label, link(n.url, n.carry), 'cwtb-tab' + (n.key === open ? ' cwtb-on' : ''));
      }
    }

    // Three states, and no empty circle among them. With a photo, the photo. Known
    // but no photo yet, the words instead, which the photo replaces when it arrives.
    // Not known, the two doors.
    // On the sign-in page itself there is no face to show, whatever the device
    // remembers. Somebody standing at the front door is not through it yet.
    var atDoor = (window.location.pathname || '').toLowerCase().indexOf('/signin') === 0;

    // THE NAME SITS BESIDE THE FACE, IN ONE PILL. Jessie, 2026-09-08: "put my name to the left of
    // my photo in top right photo as we did in the same pill", and she picked the version carrying
    // the seedling: "C - pill with the greeting". The seedling comes up from the My account
    // heading, which goes once this is in, so nothing is lost in the move.
    //
    // The name is whatever the bar already knows. It is fetched for the person being LOOKED AT, so
    // while viewing as somebody else it is their name, and cw-name-for says whose - which is why
    // it is checked rather than trusted. Without a name the pill is just the face, which is what
    // it was before.
    //
    // On a phone the name is hidden by CSS rather than left out, so nothing has to be redrawn when
    // the window changes size. A long name would otherwise push this bar onto two rows, which
    // already happened once to GROUPS and MORE at 375px.
    function myName() {
      try {
        // window, not w. `w` is a local in another function further down this file and is not in
        // scope here; reaching for it would throw and take the whole bar with it, on every page.
        var n = String(window.CW_NAME || window.localStorage.getItem('cw-name') || '').trim();
        var forWho = String(window.localStorage.getItem('cw-name-for') || '').trim();
        if (!n) return '';
        if (forWho && String(me() || '').trim() && forWho !== String(me() || '').trim()) { return ''; }
        return n;
      } catch (e) { return ''; }
    }
    function esc2(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

    var photo;
    if (!atDoor && me() && window.CW_TOPBAR_PHOTO) {
      var nm = myName();
      photo = '<a role="link" tabindex="0" class="cwtb-me" title="My profile" data-nav="' +
              link(PROFILE, 'CWid') + '" onclick="return _safeNavGo(this)">' +
              (nm ? '<span class="cwtb-me-name">' + esc2(nm) + ' \u{1F331}</span>' : '') +
              '<span class="cwtb-face"><img src="' + window.CW_TOPBAR_PHOTO + '" alt=""></span></a>';
    } else if (!atDoor && me()) {
      photo = '<a role="link" tabindex="0" class="cwtb-signin cwtb-ghost cwtb-mine" data-nav="' +
              link(PROFILE, 'CWid') + '" onclick="return _safeNavGo(this)">My profile</a>';
    } else if (onCreatingWorks()) {
      // NO DOORS ON CREATING.WORKS. A sign-in on 2gather.network cannot come back here, because each
      // site keeps its own, and the creating.works pages that draw this bar sign people in themselves.
      photo = '';
    } else {
      photo = '<a role="link" tabindex="0" class="cwtb-signin" data-nav="' +
              (window.CW_SIGNIN || 'https://2gather.network/signin/') +
              '" onclick="return _safeNavGo(this)">Sign in</a>' +
              '<a role="link" tabindex="0" class="cwtb-signin cwtb-ghost" data-nav="' +
              (window.CW_SIGNUP || 'https://2gather.network/signup/') +
              '" onclick="return _safeNavGo(this)">Sign up</a>';
    }

    var el = document.createElement('div');
    el.id = 'cw-topbar';
    el.innerHTML =
      '<div class="cwtb-bar">' +
        // On creating.works the mark is Creating.Works and so are its words. Jessie, 2026-09-12: "instead
        // of gathering for the common good, show the icon for creating works on the left and say Because
        // creating works."
        '<a role="link" tabindex="0" class="cwtb-mark" data-nav="' +
          (onCreatingWorks() ? 'https://creating.works/' : link(EVENTS, 'memberCard')) +
          '" onclick="return _safeNavGo(this)">' +
          '<span class="cwtb-glyph"><img src="' + (onCreatingWorks() ? CW_LOGO : LOGO) + '" alt=""></span>' +
          '<span class="cwtb-word">' + (onCreatingWorks() ? 'Because creating works.' : 'Gathering for the common good.') + '</span></a>' +
        '<div class="cwtb-tabs">' + tabs + '</div>' +
        photo +
      '</div>' + rows;

    document.body.insertBefore(el, document.body.firstChild);
    // A page that draws its own mark and tagline would show them twice now
    document.documentElement.className += ' cwtb-drawn';

    // one menu open at a time, as a panel under the tab that opened it
    var triggers = el.querySelectorAll('[data-menu]');
    function place(t, r) {
      var bar = el.querySelector('.cwtb-bar');
      r.style.top = (bar.offsetHeight + 8) + 'px';
      r.style.left = '0px';
      var want = t.getBoundingClientRect().left - el.getBoundingClientRect().left;
      var room = el.clientWidth - r.offsetWidth - 8;
      r.style.left = Math.max(8, Math.min(want, room)) + 'px';
    }
    function show(key) {
      var t, r, k;
      // while a menu is open, the page's own tab stops looking selected, so only
      // the tab you opened is lit
      el.className = key ? 'cwtb-menuing' : '';
      for (var a = 0; a < triggers.length; a++) {
        t = triggers[a];
        k = t.getAttribute('data-menu');
        r = el.querySelector('[data-row="' + k + '"]');
        var on = (k === key);
        t.setAttribute('aria-expanded', on ? 'true' : 'false');
        t.className = t.className.replace(/ ?cwtb-lit/, '') + (on ? ' cwtb-lit' : '');
        if (r) {
          r.className = 'cwtb-row' + (on ? ' cwtb-open' : '');
          if (on) { place(t, r); }
        }
      }
    }
    // Leaving is one definition, in identity.js, so this asks it rather than clearing keys of
    // its own and drifting from what signing out means everywhere else.
    var outs = el.querySelectorAll('[data-signout]');
    for (var o = 0; o < outs.length; o++) {
      outs[o].addEventListener('click', function () {
        if (window.CW && window.CW.forget) { window.CW.forget(); }
        window.location.href = 'https://2gather.network/signin/?out=1';
      });
    }
    document.addEventListener('click', function (e) {
      if (!el.contains(e.target)) { show(''); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { show(''); }
    });
    for (var b = 0; b < triggers.length; b++) {
      (function (t) {
        var k = t.getAttribute('data-menu');
        function toggle() {
          var r = el.querySelector('[data-row="' + k + '"]');
          show(r && r.className.indexOf('cwtb-open') > -1 ? '' : k);
        }
        t.addEventListener('click', toggle);
        t.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
          if (e.key === 'Escape') { show(''); }
        });
      })(triggers[b]);
    }
  }

  // The bar runs edge to edge (Jessie 2026-08-26, approved on the event page). It is a child of
  // <body>, so any page that pads its body pushes the bar in from the edges and the shadow
  // turns that gutter into a frame. This reads the container's own padding and cancels it,
  // which works whatever padding a given page uses. Deliberately not width:100vw — that
  // counts the scrollbar and gives desktop a horizontal scroll.
  function fullBleed() {
    var host = document.getElementById('cw-topbar');
    if (!host) return;
    var p  = host.parentElement || document.body;
    var cs = window.getComputedStyle(p);
    // A page that centres its children with flex makes the bar a flex item, which shrinks to
    // its own content. Stretching it back is what actually widens the bar; the negative
    // margins below only cancel the container's padding.
    host.style.alignSelf = 'stretch';
    host.style.width     = 'auto';
    host.style.marginLeft  = '-' + (parseFloat(cs.paddingLeft) || 0) + 'px';
    host.style.marginRight = '-' + (parseFloat(cs.paddingRight) || 0) + 'px';
    // Only the page's OWN top spacing is cancelled. The admin strip floats above everything and
    // adds its height to that same spacing to make room for itself, and this line used to
    // cancel the lot, so the blue menu slid back up underneath the white strip and the two
    // shared one band of screen. Take the strip's share off first. Jessie, 2026-09-02.
    var reserved = parseFloat(
      w.getComputedStyle(d.documentElement).getPropertyValue('--cw-adminbar')
    ) || 0;
    host.style.marginTop   = '-' + Math.max(0, (parseFloat(cs.paddingTop) || 0) - reserved) + 'px';
    host.style.marginBottom = '18px';
    var bar = host.querySelector('.cwtb-bar');
    if (bar) bar.style.boxShadow = 'none';
  }
  function applyFullBleed() {
    try {
      fullBleed();
      window.addEventListener('resize', fullBleed);
    } catch (e) {}
  }

  function style() {
    var css =
      '#cw-topbar{font-family:"DM Sans","Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
        'position:relative;z-index:5;}' +
      // The admin strip stacked to nearly 200px on a narrow window, because every button became
      // its own row and pushed the whole site down. It stays one or two tight lines now.
      '@media (max-width:700px){#cw-viewas{font-size:11.5px !important;gap:6px 8px !important;' +
        'padding:5px 8px !important;}' +
        '#cw-viewas button{padding:3px 8px !important;font-size:11.5px !important;}' +
        '#cw-viewas a{font-size:11.5px !important;}}' +
      '.cwtb-bar{background:#1F699E;display:flex;align-items:center;gap:14px;padding:0 16px;height:58px;' +
        'box-shadow:0 2px 0 rgba(0,0,0,.10),0 6px 14px rgba(15,45,70,.18);}' +
      '.cwtb-mark{display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none;cursor:pointer;}' +
      '.cwtb-glyph{width:38px;height:38px;border-radius:10px;background:#fff;display:flex;' +
        'align-items:center;justify-content:center;}' +
      '.cwtb-glyph img{width:30px;height:30px;object-fit:contain;display:block;}' +
      '.cwtb-word{color:rgba(255,255,255,.85);font-size:13px;font-weight:400;}' +
      // min-width:0 is what makes the overflow-x above actually work. Without it a flex item
      // refuses to shrink below its content, so on a narrow screen the tabs did not scroll and
      // did not wrap, they simply sat underneath the sign-in buttons. Jessie, 2026-09-02:
      // "Top menu bar not functional for mobile users." 2026-09-03.
      '.cwtb-tabs{display:flex;align-items:center;gap:4px;margin-left:auto;margin-right:6px;min-width:0;' +
        'overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;}' +
      '.cwtb-tabs::-webkit-scrollbar{display:none;}' +
      '.cwtb-tab{color:#fff;font-size:14px;font-weight:500;letter-spacing:.6px;text-transform:uppercase;' +
        'padding:9px 15px;border-radius:9px;text-decoration:none;white-space:nowrap;cursor:pointer;}' +
      '.cwtb-tab:hover{background:rgba(255,255,255,.12);}' +
      '.cwtb-on{background:rgba(255,255,255,.20);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);}' +
      '.cwtb-face{width:36px;height:36px;border-radius:50%;flex-shrink:0;overflow:hidden;cursor:pointer;' +
        'background:linear-gradient(135deg,#7DD3FC,#1F699E);display:block;' +
        'box-shadow:0 0 0 2px rgba(255,255,255,.55);}' +
      '.cwtb-face img{width:100%;height:100%;object-fit:cover;display:block;}' +
      '.cwtb-me{display:inline-flex;align-items:center;gap:9px;background:#fff;border-radius:26px;' +
        'padding:3px 4px 3px 15px;text-decoration:none;flex-shrink:0;cursor:pointer;}' +
      '.cwtb-me .cwtb-face{width:32px;height:32px;box-shadow:none;}' +
      '.cwtb-me-name{color:#1F699E;font-size:14px;font-weight:700;white-space:nowrap;line-height:1;}' +
      '@media(max-width:700px){.cwtb-me{background:none;padding:0;gap:0;}' +
        '.cwtb-me-name{display:none;}' +
        '.cwtb-me .cwtb-face{width:36px;height:36px;box-shadow:0 0 0 2px rgba(255,255,255,.55);}}' +
      '.cwtb-signin{flex-shrink:0;background:#fff;color:#1F699E;font-size:14px;font-weight:700;' +
        'padding:9px 18px;border-radius:22px;text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-signin:hover{background:#F7FBFF;}' +
      '.cwtb-ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55);margin-left:8px;}' +
      '.cwtb-ghost:hover{background:rgba(255,255,255,.12);}' +
      // SIGN UP YOU CAN READ. Jessie, 2026-09-12, with a picture of the bar on an event signed out: "the sign up is
      // odd". The event page colors every link that is not a button blue (a:not(.btn)), which outranks one class,
      // so Sign up was blue on the blue bar. Two classes outrank it, on every page.
      '.cwtb-signin.cwtb-ghost{color:#fff;}' +
      '.cwtb-ask{padding:48px 20px;display:flex;justify-content:center;}' +
      '.cwtb-ask-card{background:#fff;border-radius:16px;padding:34px 34px 30px;max-width:460px;width:100%;}' +
      '.cwtb-ask-card h1{font-size:22px;font-weight:800;color:#1A2E42;margin:0 0 8px;line-height:1.3;}' +
      '.cwtb-ask-card p{font-size:15px;color:#6B7A8D;line-height:1.55;margin:0 0 22px;}' +
      '.cwtb-ask-row{display:flex;gap:10px;flex-wrap:wrap;}' +
      // A page's own link colour was bleeding into these, so the filled button lost its text.
      '.cwtb-ask-go{background:#1F699E !important;color:#fff !important;font-size:15px;font-weight:700;' +
        'padding:12px 24px;border-radius:24px;text-decoration:none !important;cursor:pointer;' +
        'display:inline-block;line-height:1.2;}' +
      '.cwtb-ask-ghost{background:#fff !important;color:#1F699E !important;' +
        'box-shadow:inset 0 0 0 1.5px #C9DFF3;}' +
      '@media(max-width:700px){.cwtb-signin{padding:8px 13px;font-size:13px;}.cwtb-ghost{margin-left:6px;}}' +
      '.cwtb-row{display:none;position:absolute;min-width:236px;background:#fff;border-radius:14px;' +
        'padding:10px 0;box-shadow:0 14px 34px rgba(15,45,70,.28);z-index:20;}' +
      '.cwtb-row.cwtb-open{display:block;}' +
      '.cwtb-item{display:block;padding:13px 22px;font-size:16px;font-weight:500;color:#1A2E42;' +
        'text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-item:hover{background:#F7FBFF;}' +
      // a page that draws its own mark and tagline would show them twice
      '.cwtb-drawn .cw-dupe-brand{display:none !important;}' +
      '.cwtb-lit{background:rgba(255,255,255,.20);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);}' +
      '#cw-topbar.cwtb-menuing .cwtb-tab.cwtb-on:not(.cwtb-lit){background:transparent;box-shadow:none;}' +
      '@media(max-width:700px){.cwtb-bar{gap:8px;padding:0 10px;height:54px;}' +
        '.cwtb-word{display:none;}.cwtb-tabs{margin-left:auto;}' +
        '.cwtb-tab{padding:8px 10px;font-size:13px;letter-spacing:.3px;}}' +
      // A PHONE GETS TWO ROWS. On an iPhone the bar held a logo, three tabs and two buttons in
      // 375 pixels: GROUPS was cut in half, MORE was gone entirely, and the sign-in buttons were
      // drawn on top of both, so Groups and More could not be reached at all. Squeezing them
      // further would have made every one of them too small to hit. So the logo and the sign-in
      // buttons keep the first row and the three tabs get the second, spread across the width.
      // Nothing is hidden and nothing new is built. 2026-09-03.
      '@media(max-width:560px){' +
        '.cwtb-bar{flex-wrap:wrap;height:auto;min-height:54px;padding:6px 10px 8px;row-gap:4px;}' +
        '.cwtb-mark{margin-right:auto;}' +
        '.cwtb-tabs{order:3;width:100%;margin:0;justify-content:space-between;overflow-x:visible;}' +
        '.cwtb-tab{padding:8px 12px;font-size:13.5px;letter-spacing:.4px;}' +
      '}';
    var s = document.createElement('style');
    s.id = 'cw-topbar-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---- the person's own photo, and the pill it replaces ---------------------
  // The page fetches the photo after it loads, so watch for it rather than
  // reading once. The old My profile pill comes off while the bar is up,
  // because the photo in the bar is that same link.
  function adopt() {
    // Inside the pill the face is a span, so this fills THAT rather than replacing the pill and
    // taking the name with it.
    var face = document.querySelector('#cw-topbar .cwtb-me .cwtb-face') ||
               document.querySelector('#cw-topbar .cwtb-face') ||
               document.querySelector('#cw-topbar .cwtb-mine');
    if (!face) return true;

    var pill = document.getElementById('gp-myprofile-pill');
    if (pill) { pill.style.display = 'none'; }

    var src = window.CW_TOPBAR_PHOTO || '';
    if (!src) {
      var img = document.querySelector('#gp-myprofile-avatar img, #gp-myprofile-pill img, .cw-me-photo img');
      if (img && img.getAttribute('src')) { src = img.getAttribute('src'); }
    }
    if (src) {
      // THE PILL SURVIVES THE PHOTO ARRIVING. Jessie, 2026-09-08: "top photo isn't a pill."
      //
      // Most pages never fetch a face, so the bar draws the fallback anchor first and this fills it
      // in when the photo turns up. It did that by turning that anchor INTO a bare face - which on
      // every page where the photo arrives late is every page, threw away the pill and the name
      // with it. The pill was only ever visible on the rare page that already had a photo at draw
      // time, which is why it looked like it had not been built.
      //
      // Two shapes to fill: the span inside a pill that is already there, or the fallback anchor,
      // which is rebuilt AS the pill.
      var inPill = face.parentNode && face.parentNode.className &&
                   String(face.parentNode.className).indexOf('cwtb-me') > -1;
      if (inPill || face.className.indexOf('cwtb-face') > -1) {
        face.className = 'cwtb-face';
        face.innerHTML = '<img src="' + src + '" alt="">';
        return true;
      }
      var nm2 = '';
      try {
        nm2 = String(window.CW_NAME || window.localStorage.getItem('cw-name') || '').trim();
        var forWho2 = String(window.localStorage.getItem('cw-name-for') || '').trim();
        var meNow = String((window.CW && window.CW.me) ? (window.CW.me().id || '') : '').trim();
        if (forWho2 && meNow && forWho2 !== meNow) { nm2 = ''; }
      } catch (e) { nm2 = ''; }
      var esc3 = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
      face.className = 'cwtb-me';
      face.setAttribute('title', 'My profile');
      face.innerHTML = (nm2 ? '<span class="cwtb-me-name">' + esc3(nm2) + ' \u{1F331}</span>' : '')
                     + '<span class="cwtb-face"><img src="' + src + '" alt=""></span>';
      return true;
    }
    return false;
  }

  // The bar wants a face on every page, and most pages never fetch one. So it is
  // looked up once, kept on the device beside the id it belongs to, and reused.
  // One small public read, and only when we do not already have it.
  function fetchPhotoOnce() {
    var who = me();
    if (!who) return;
    // Showing the remembered picture straight away is right. Never asking again was not: once
    // a wrong or out-of-date one was on a device it stayed there for good, and somebody who
    // changed their photo on Appear kept seeing the old one with no way to correct it. The
    // remembered one still paints instantly; it is simply checked again once a day behind it.
    var fresh = false;
    try {
      if (localStorage.getItem('cw-photo-for') === who && localStorage.getItem('cw-photo')) {
        window.CW_TOPBAR_PHOTO = localStorage.getItem('cw-photo');
        adopt();
        var when = parseInt(localStorage.getItem('cw-photo-at') || '0', 10);
        fresh = !!when && (Date.now() - when) < 86400000;
      }
    } catch (e) {}
    if (fresh) return;
    try {
      fetch('https://cw-api-gate.jessieupp.workers.dev/?action=lookupProfile&appearId=' +
            encodeURIComponent(who))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.photo) return;
          window.CW_TOPBAR_PHOTO = d.photo;
          // The name rides along with the photo, out of a call already being made, so the admin
          // strip can say who you are rather than a sentence about it.
          //
          // AND IT IS KEPT BESIDE WHOSE NAME IT IS. This is fetched for the person being LOOKED AT,
          // so while viewing Doug it holds Doug's name. Without a key saying so, Back to me left
          // the strip reading "You are Doug Breitbart" until the next fetch returned. The photo has
          // had cw-photo-for for exactly this reason since the day it was written; the name went in
          // without one. Jessie, 2026-09-07: "didn't change over when i went back to me, maybe?"
          try {
            if (d.name) {
              window.CW_NAME = d.name;
              localStorage.setItem('cw-name', d.name);
              localStorage.setItem('cw-name-for', who);
            }
          } catch (e) {}
          // Tell the strip, which drew before this answer arrived.
          try { if (window.CW_REDRAW_ADMIN) { window.CW_REDRAW_ADMIN(); } } catch (e) {}
          try {
            localStorage.setItem('cw-photo', d.photo);
            localStorage.setItem('cw-photo-for', who);
            localStorage.setItem('cw-photo-at', String(Date.now()));
          } catch (e) {}
          adopt();
        })
        .catch(function () {});
    } catch (e) {}
  }

  function watchForPhoto() {
    if (adopt()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (adopt() || tries > 40) { clearInterval(t); }
    }, 400);
  }

  // ---- taking the id out of the address bar ---------------------------------
  // Somebody arrives at /mygroups?CWid=w.hss. We read the id, remember it on this
  // device under the key the pages already fall back to, then rewrite the address
  // to /mygroups with nothing after it. No reload, and the history entry is
  // replaced rather than added, so the version carrying the id is not left behind
  // either. Everything else in the query stays, because a group id or an event id
  // is not a person.
  //
  // ?mask=1 turns it on for one page while we watch it work. MASK_BY_DEFAULT makes
  // it the rule everywhere.
  var MASK_BY_DEFAULT = true;
  var WHO_PARAMS = ['CWid', 'memberCard', 'appearId', 'me'];

  function remember(id) {
    if (!id) return;
    // NEVER WHILE LOOKING AT SOMEBODY ELSE. This writes an id onto this device permanently, as who
    // you are, on every page, and nothing afterwards says it happened: Back to me clears the
    // viewing key and cannot undo a write to the id itself. It is tested on the raw key rather
    // than on CW.me().viewing, because once the device has been stamped the two ids match and
    // viewing reads false, which is exactly the state this has to refuse in.
    // AND IT READS THE KEY ITSELF WHEN CW IS NOT THERE. identity.js is what defines CW, and it is
    // not on every page that loads this file: on creating.works the bar is up and identity.js is
    // not, so asking CW would have answered "nobody is being viewed" on exactly the pages with no
    // other protection. Those are the pages where this guard is the only one.
    try {
      var seen = (window.CW && window.CW.viewingAs)
        ? String(window.CW.viewingAs() || '').trim()
        : String(sessionStorage.getItem('cw-view-as') || '').trim();   // per tab since 2026-09-07
      if (seen) { return; }
      // NOR WHILE THE VIEW IS SIGNED OUT. 2026-09-10, Jessie: "add a signed out view to here". A
      // visitor has no id to remember, and her real one is left exactly as it was.
      var out = (window.CW && window.CW.signedOutView)
        ? window.CW.signedOutView()
        : sessionStorage.getItem('cw-view-out') === '1';
      if (out) { return; }
    } catch (e) {}
    window.CW_ID = id;
    try { localStorage.setItem('appear-id', id); } catch (e) {}
    try { localStorage.setItem('cw-id', id); } catch (e) {}
  }

  function maskWanted() {
    try {
      if (new URLSearchParams(window.location.search).get('mask') === '0') return false;
      if (new URLSearchParams(window.location.search).get('mask') === '1') return true;
    } catch (e) {}
    return MASK_BY_DEFAULT;
  }

  function stripId() {
    var p, id = '';
    try { p = new URLSearchParams(window.location.search); } catch (e) { return; }

    for (var i = 0; i < WHO_PARAMS.length; i++) {
      var v = p.get(WHO_PARAMS[i]);
      if (v && !id) { id = String(v).trim(); }
    }
    remember(id);
    if (!id || !maskWanted()) return;
    if (!window.history || !window.history.replaceState) return;

    for (var j = 0; j < WHO_PARAMS.length; j++) { p.delete(WHO_PARAMS[j]); }
    // `show` is who is being looked at, so it stays, unless that is the person looking,
    // in which case it is their own id sitting in their own address bar.
    var shown = p.get('show');
    if (shown && String(shown).split('.').join('').toLowerCase() ===
                 String(id).split('.').join('').toLowerCase()) { p.delete('show'); }
    p.delete('mask');
    var rest = p.toString();
    var clean = window.location.pathname + (rest ? '?' + rest : '') + window.location.hash;
    try { window.history.replaceState(null, '', clean); } catch (e) {}
  }

  // ---- pages that are somebody's own -----------------------------------------
  // My groups signed out used to draw its heading, its buttons and an empty card,
  // which is a page pretending to be about you while knowing nothing about you.
  // Our own sign-in page exists now, so these paths go straight there carrying
  // where the person was headed. Asking on a card first only added a click.
  // Every path here needs to know who you are before it is worth drawing. A group's
  // own page is deliberately NOT here: somebody invited to a group should be able to
  // look at it, see a few faces and first names, and then be asked to sign in when
  // they act. Looking is not the same as doing.
  var MINE_ONLY = [
    '/mygroups', '/myevents',
    '/groups/create', '/groups/invite', '/groups/host', '/groups/request',
    '/commons', '/attendees'
  ];

  function askToSignIn() {
    var path = (window.location.pathname || '').toLowerCase();
    var gated = MINE_ONLY.some(function (p) { return path.indexOf(p) === 0; });
    // MY PROFILE TOO, WHEN IT IS YOUR OWN. Jessie, 2026-09-10, looking at /ikigai/ signed out: "shouldn't
    // see this - ask to sign in". It drew the profile tabs and an empty "This is me" card. A shared
    // profile link (?show=) is somebody else's profile and stays open to look at, like a group's page.
    if (!gated && path.indexOf('/ikigai') === 0) {
      // Any of the parameters the profile page opens somebody by (see _idFromUrl in ikigai) means it
      // is opening a named profile, not your own, so it is not asked here.
      var _q = ''; try { var _sp = new URLSearchParams(window.location.search);
        _q = ['show', 'id', 'CWid', 'me', 'memberCard', 'appearId'].map(function (k) { return _sp.get(k) || ''; }).join(''); } catch (e) {}
      gated = !_q;
    }
    if (!gated || me()) return;

    // Straight to sign-in, carrying where they were headed so they land back here.
    // replace() rather than href, so Back returns to wherever they came from
    // instead of bouncing them forward into this same redirect again.
    var go = window.CW_SIGNIN || '';
    if (go.indexOf('/signin') > -1) {
      try { window.location.replace(go); return; } catch (e) {}
    }

    // Only if that address is missing or is not our own sign-in page. Nobody should
    // be left staring at a page that knows nothing about them.
    var what = path.indexOf('/myevents') === 0 ? 'your events'
             : path.indexOf('/mygroups') === 0 ? 'your groups'
             : 'this';
    var bar = document.getElementById('cw-topbar');
    var ask = document.createElement('div');
    ask.className = 'cwtb-ask';
    ask.innerHTML =
      '<div class="cwtb-ask-card">' +
        '<h1>Sign in to see ' + what + '.</h1>' +
        '<p>They are here waiting. We just need to know who you are.</p>' +
        '<div class="cwtb-ask-row">' +
          '<a role="link" tabindex="0" class="cwtb-ask-go" data-nav="' +
            (window.CW_SIGNIN || 'https://2gather.network/signin/') +
            '" onclick="return _safeNavGo(this)">Sign in</a>' +
          '<a role="link" tabindex="0" class="cwtb-ask-go cwtb-ask-ghost" data-nav="' +
            (window.CW_SIGNUP || 'https://2gather.network/signup/') +
            '" onclick="return _safeNavGo(this)">Sign up</a>' +
        '</div>' +
      '</div>';

    var kids = Array.prototype.slice.call(document.body.children);
    kids.forEach(function (el) { if (el !== bar && el.tagName !== 'SCRIPT') { el.style.display = 'none'; } });
    document.body.appendChild(ask);
  }

  // ---- the tab, and what a shared link says --------------------------------
  // Pages rename themselves as they load, so keep the tool on the end of
  // whatever they set. Runs with or without the bar.
  function titleGuard() {
    var host = (window.location.hostname || '').toLowerCase();
    var tool = host.indexOf('2gather') > -1 ? '2Gather'
             : host.indexOf('creating.works') > -1 ? 'Creating.Works'
             : host.indexOf('appear') > -1 ? 'Appear' : '';
    if (!tool) return;
    var tail = ' · ' + tool;
    function fix() {
      var t = document.title || '';
      if (t && t.indexOf(tool) === -1) { document.title = t + tail; }
    }
    fix();
    try {
      var el = document.querySelector('title');
      if (el && window.MutationObserver) { new MutationObserver(fix).observe(el, { childList: true }); }
    } catch (e) {}
  }

  // ---- the tab icon ---------------------------------------------------------
  // Every 2Gather page, groups included, shows the 2Gather mark. Creating.Works
  // shows the seedling and an Appear page shows a globe. Appear's own pages are
  // built in Glide and set their icon there, so this only reaches ours.
  function emoji(ch) {
    return 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<text y=".9em" font-size="90">' + ch + '</text></svg>');
  }

  function favicon() {
    try {
      var host = (window.location.hostname || '').toLowerCase();
      var href = '';
      if (host.indexOf('creating.works') > -1) { href = emoji('🌱'); }
      else if (host.indexOf('appear') > -1) { href = emoji('🌍'); }
      else if (host.indexOf('2gather') > -1) { href = LOGO; }
      if (!href) return;
      var links = document.querySelectorAll('link[rel~="icon"]');
      for (var i = 0; i < links.length; i++) { links[i].parentNode.removeChild(links[i]); }
      var l = document.createElement('link');
      l.rel = 'icon';
      l.href = href;
      document.head.appendChild(l);
    } catch (e) {}
  }

  function hidden() {
    try { return new URLSearchParams(window.location.search).get('topbar') === '0'; }
    catch (e) { return false; }
  }

  function go() {
    favicon();
    titleGuard();
    setTimeout(stripId, 0);

    // Creating.Works loads this file for the tab icon, the title and the strip, and
    // not for the bar. Those pages are reached from inside 2Gather and carry their
    // own furniture, so a second bar would be one too many. ?topbar=1 draws it there
    // when we want to look at how it would sit.
    try {
      // A creating.works page that wants the bar says so with window.CW_SHOW_BAR, which the home page
      // and ops do. Jessie, 2026-09-12: "add the pill on the right hand side of who I am".
      if (window.location.hostname.indexOf('creating.works') > -1 && !window.CW_SHOW_BAR &&
          new URLSearchParams(window.location.search).get('topbar') !== '1') { return; }
    } catch (e) {}
    if (document.getElementById('cw-topbar') || hidden() || !SHOW_EVERYWHERE) return;
    var framed = false;
    try { framed = (window.self !== window.top); } catch (e) { framed = true; }
    if (framed && HIDE_INSIDE_GLIDE) return;
    style();
    draw();
    applyFullBleed();
    watchForPhoto();
    fetchPhotoOnce();
    askToSignIn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else { go(); }
})();

/* ── Viewing as somebody else ─────────────────────────────────────────────────
 * For the handful of people who run this. Standing in somebody's shoes is the only honest way
 * to answer "what does this look like for them", and guessing from the data never is.
 *
 * Three rules it keeps.
 *   It is never invisible. While it is on, an amber bar sits above everything saying whose
 *   view this is, on every page, with a way out.
 *   It is never a write. It sets its own key rather than cw-id, so CW.me().viewing is true and
 *   anything that saves can refuse. Signing out ends it.
 *   It is never open. The bar only appears at all once the backend has said this person is a
 *   super admin, and the backend decides that from a list only it can see.
 */
(function (w, d) {
  'use strict';
  if (!w.CW || !w.CW.realMe) { return; }

  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  /* THE PERSON AT THE KEYBOARD, NOT realMe(). Jessie, 2026-09-10, asking for a signed-out view
     with "a way back to herself". While it is on, realMe() answers nobody on every page, and this
     strip asked realMe() whether to draw at all, so it would have vanished and taken the way back
     with it. atKeyboard() is the one question in identity.js that still answers her, and this strip
     is the only thing that asks it. An older identity.js without it still gets realMe(). */
  var me = w.CW.atKeyboard ? w.CW.atKeyboard() : w.CW.realMe();
  if (!me.known) { return; }

  function ls(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }

  /* ITS OWN COPY, because this is a different closure. The first version called supportUrl() from
     the file's other IIFE, where it is not in scope, so paint() threw a ReferenceError and the
     whole admin strip stopped drawing on every page. Jessie, 2026-09-07: "my super admin at top is
     missing from this page". Found in the console rather than guessed at. A helper crossing a
     closure boundary is not shared, it is undefined. */
  function _supportHere() {
    var here = '';
    try { here = String(w.location.pathname || '').trim(); } catch (e) {}
    return here
      ? 'https://2gather.network/support?from=' + encodeURIComponent(here)
      : 'https://2gather.network/support';
  }

  function paint() {
    var old = d.getElementById('cw-viewas'); if (old) { old.remove(); }
    var out = !!(w.CW.signedOutView && w.CW.signedOutView());
    var seen = w.CW.viewingAs();
    var name = ls(function () { return w.sessionStorage.getItem('cw-view-as-name') || ''; }, '');

    var bar = d.createElement('div');
    bar.id = 'cw-viewas';
    // fixed, not sticky: sticky is in the flow, so the strip pushed the whole page down and the
    // group's own header slid under it. Over the page, not shoving it. Jessie, 2026-09-01.
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;display:flex;align-items:center;gap:10px;'
      + 'flex-wrap:wrap;gap:10px 16px;padding:7px 14px;font:600 13px/1.4 "DM Sans",system-ui,sans-serif;'
      + 'background:#fff;color:#1A2E42;border-bottom:1px solid #E3EAF0;'
      // White throughout, as asked. Standing in somebody else's shoes still has to be
      // impossible to miss, so that state keeps an amber edge and an amber name.
      + ((seen || out) ? 'box-shadow:inset 4px 0 0 #B8862F;' : '');

    // Two clusters: who you are looking as on the left, the things you run on the right.
    // Without this they queued up in one row and the bar read as a pile rather than a strip.
    var left = d.createElement('div');
    left.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0;';
    var right = d.createElement('div');
    right.style.cssText = 'display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-left:auto;';
    bar.appendChild(left); bar.appendChild(right);
    // Being fixed takes it out of the flow, so the page must be told to leave room for it.
    // Measured after it is on screen, because its height depends on how the words wrap, and
    // measured AGAIN on every resize: on a phone this strip wraps onto two rows, and a single
    // measurement taken before the font loaded left the page short by a row. Jessie, 2026-09-02.
    //
    // The number is published as --cw-adminbar as well as applied, because the blue menu below
    // pulls itself up by the page's top spacing to run edge to edge, and it was cancelling
    // exactly this. One number, written once, read by both, so they cannot disagree.
    // reserve is a resize listener AND it fires a resize below, so it called itself until the
    // browser gave up: "Maximum call stack size exceeded", four times over, on every page.
    // Found on 2026-09-03 by opening the profile and reading the console after an unrelated
    // change. The dispatch stays, because other things on the page listen for it. This flag
    // stops reserve acting on its own event, which is the only part that was wrong.
    var reserving = false;
    function reserve() {
      if (reserving) { return; }
      reserving = true;
      try {
        var h = bar.getBoundingClientRect().height;
        if (!h) { return; }
        d.documentElement.style.setProperty('--cw-adminbar', h + 'px');
        d.body.style.paddingTop = h + 'px';
        // Told DIRECTLY, not through a resize event and a listener. 2026-09-03.
        //
        // The blue menu cancels the page's own top spacing to run edge to edge, and it takes the
        // strip's share off first so it does not slide up underneath. That arithmetic is only
        // right if it runs AFTER --cw-adminbar is set. Going through an event left the order to
        // chance: if the menu recalculated while the variable still read zero, it pulled itself
        // up by the strip's whole height and sat under it, which clips the logo row.
        //
        // Jessie caught it on a phone on 2026-09-03 and I could not reproduce it on the same
        // width, which is what a race looks like. Calling fullBleed by name removes the ordering
        // question rather than making the odds better. The resize event still goes out, because
        // other things listen for it.
        try { fullBleed(); } catch (e2) {}
        w.dispatchEvent(new Event('resize'));
      } catch (e) {
      } finally {
        // finally, not a line after the catch. There is a `return` inside the try for the case
        // where the bar has no height yet, and reaching it any other way would leave this flag
        // stuck on and the handler dead for the life of the page.
        reserving = false;
      }
    }
    setTimeout(reserve, 0);
    // Fonts arriving late change how the words wrap, which changes the height.
    try { if (d.fonts && d.fonts.ready) { d.fonts.ready.then(reserve); } } catch (e) {}
    // And once more after everything has settled, because a height measured while the page was
    // still laying itself out is the other way this ends up wrong.
    setTimeout(reserve, 400);
    w.addEventListener('resize', reserve);
    w.addEventListener('orientationchange', reserve);

    // 2026-08-30. "Viewing as yourself" pushed the strip onto two rows on a phone, with Support
    // and Hide wrapping underneath. Shorter, so the whole strip sits on one line.
    var says;
    if (out) {
      /* VIEWING SIGNED OUT, in the amber of the other view. Jessie, 2026-09-10: "add a signed out
         view to here so i know hwat an even looks like or any page looks like for signed out". The
         page underneath is drawn for a visitor, so this line is the only thing on screen saying
         she is still signed in, and it has to be as hard to miss as viewing as somebody. */
      says = d.createElement('span');
      says.textContent = 'Viewing signed out';
      says.style.color = '#8A6220';
    } else if (seen) {
      says = d.createElement('span');
      says.textContent = 'Viewing as ' + (name || seen);
      says.style.color = '#8A6220';
    } else {
      // NOT A LABEL THAT READS LIKE A BUTTON. "View as self" sat beside the "View as someone"
      // pill and the eye paired them, so pressing it was the obvious way back and there was
      // nothing behind it. Jessie, 2026-09-07: "view as self at top super admin bar doesn't go
      // back to me."
      //
      // It says what is true, and pressing it still puts you back, which is the one thing anybody
      // reaching for it wants. Harmless when nothing is being viewed, and the way out if the
      // strip is ever out of step with the device.
      /* IT SAYS WHO, and it must not say it the SAME WAY as the other state. She asked for the
         name to show: "chagne to Viewing as (name) so it's apparent". Taken literally that made
         both states read "Viewing as somebody", so standing on her own page said the same words as
         standing on Doug's, and the missing Back to me read as a fault rather than as nothing to
         go back from. Jessie, minutes later: "Back to viewing as me is gone on bar."

         So the name is here, which is what she asked for, and the two states cannot be confused:
         "You are Jessie Upp" against an amber "Viewing as Doug Breitbart". Pressing it still puts
         you back, which is harmless when you are already yourself and is the way out if the strip
         is ever out of step with the device. */
      /* Only if it is THIS person's name. A name with no owner is how the strip came to greet her
         as the person she had just stopped viewing. */
      var mine = '';
      try {
        var nameFor = String(w.localStorage.getItem('cw-name-for') || '').trim();
        var realNow = String((w.CW && w.CW.realMe && w.CW.realMe().id) || '').trim();
        // Compared here rather than with identity.js's normalise, which is not in scope in this
        // file. Assuming a helper crosses a closure boundary is the fault that took the whole strip
        // down earlier today.
        var _flat = function (x) { return String(x || '').split('.').join('').toLowerCase(); };
        if (nameFor && realNow && _flat(nameFor) === _flat(realNow)) {
          mine = String(w.localStorage.getItem('cw-name') || '').trim();
        }
      } catch (e) {}
      says = d.createElement('button');
      says.type = 'button';
      /* HER WORDING, after seeing both. I changed this to "You are Jessie Upp" because both states
         otherwise read "Viewing as somebody", and she looked at that and asked for her version
         back: "i want it to say Viewing as Jessie Upp again not You are seeing your own pages".
         The amber and the Back to me button are what separate the two states. Her call, twice. */
      /* JUST THE NAME. Jessie, 2026-09-08: "and Viewing as Jessie Upp to just my name". Standing
         on her own pages, "Viewing as" is three words explaining a state that is simply normal.
         The other state keeps its full sentence in amber, because THAT one is the one worth
         announcing. */
      /* IT SAYS NOTHING UNTIL IT KNOWS. Jessie, 2026-09-08: "why does it toggle from 'your own
         pages' to 'Jessie Upp' at top superadmin nav?"
         Because the name is fetched and the strip draws first. It said "Your own pages", then the
         answer arrived and it redrew as her name - two different things in the same spot, seconds
         apart, which reads as the page changing its mind.
         Empty until the name is there. The strip keeps its height either way, so nothing jumps,
         and what appears appears once. */
      says.textContent = mine || '';
      says.style.cssText = 'font:inherit;padding:0;border:0;background:transparent;color:#1A2E42;'
        + 'cursor:pointer;text-align:left;';
      says.onclick = function () { try { w.CW.stopViewing(); } catch (e) {} w.location.reload(); };
    }
    left.appendChild(says);

    var pick = d.createElement('button');
    pick.type = 'button';
    // TWO WORDS. Jessie, 2026-09-08: "change view as someone at top of my supseradmin bar to change
    // view". Both states say the same two words now, which is also the button rule arriving on the
    // one control that had been carrying three.
    pick.textContent = 'Change view';
    pick.style.cssText = 'font:inherit;padding:4px 12px;border-radius:14px;cursor:pointer;'
      + 'border:1px solid #C3D0DB;background:transparent;color:#1A2E42;';
    pick.onclick = function () { open(bar); };
    left.appendChild(pick);

    // The same Back to me for both views, and it ends whichever one is on.
    if (seen || out) {
      var stop = d.createElement('button');
      stop.type = 'button';
      stop.textContent = 'Back to me';
      stop.style.cssText = 'font:inherit;padding:4px 12px;border-radius:14px;cursor:pointer;'
        + 'border:0;background:#1A2E42;color:#fff;font-weight:800;';
      stop.onclick = function () { w.CW.stopViewing(); w.location.reload(); };
      left.appendChild(stop);
    }

    // The things only the people who run this see. Same line, because they are the same kind
    // of thing and a second strip would cost another row on every page.
    function adminLink(label, href, strong) {
      var a = d.createElement('a');
      a.href = href;
      a.textContent = label;
      a.style.cssText = 'font:inherit;font-size:13px;text-decoration:none;cursor:pointer;'
        + (strong ? 'font-weight:800;color:#1F699E;' : 'font-weight:700;color:#4B5A6D;');
      right.appendChild(a);
      return a;
    }

    var waiting = ls(function () { return parseInt(w.localStorage.getItem('cw-tickets') || '', 10); }, NaN);
    adminLink((waiting > 0)
      ? (waiting + ' support ticket' + (waiting === 1 ? '' : 's') + ' waiting')
      : 'Support', _supportHere(), waiting > 0);

    // Hiding it during a demo has to survive walking to another page, so the choice is kept on
    // the device rather than in this page. A word rather than a symbol, so the way back reads.
    var fold = d.createElement('button');
    fold.type = 'button';
    fold.textContent = 'Hide';
    fold.style.cssText = 'font:inherit;font-size:12.5px;padding:4px 11px;border-radius:14px;'
      + 'cursor:pointer;border:1px solid #C3D0DB;background:transparent;color:#4B5A6D;';
    fold.onclick = function () { setFolded(true); };
    right.appendChild(fold);

    // Back at the very top, above the bar, which is where Jessie wants it: it is a warning
    // about the whole page, so it sits over the whole page rather than inside it.
    d.body.insertBefore(bar, d.body.firstChild);
  }

  var FOLD_KEY = 'cw-admin-folded';
  function folded() { return ls(function () { return w.localStorage.getItem(FOLD_KEY) === '1'; }, false); }
  function setFolded(v) {
    ls(function () {
      if (v) { w.localStorage.setItem(FOLD_KEY, '1'); } else { w.localStorage.removeItem(FOLD_KEY); }
    });
    drawAdminBar();
  }

  // Folded away, one small word is left so it can be brought back. Nothing at all would mean
  // hiding it during a demo hid it for good.
  function paintFolded() {
    var old = d.getElementById('cw-viewas'); if (old) { old.remove(); }
    // Pressing Hide took the strip away and left the gap it had asked for, so the page kept a
    // band of empty white at the top with nothing in it. Give the room back. Jessie, 2026-09-02.
    try {
      d.documentElement.style.setProperty('--cw-adminbar', '0px');
      d.body.style.paddingTop = '';
      w.dispatchEvent(new Event('resize'));
    } catch (e) {}
    var tab = d.createElement('div');
    tab.id = 'cw-viewas';
    tab.style.cssText = 'position:sticky;top:0;z-index:99999;display:flex;justify-content:flex-end;'
      + 'padding:2px 10px;background:transparent;pointer-events:none;';
    var b = d.createElement('button');
    b.type = 'button';
    b.textContent = 'Admin';
    b.style.cssText = 'font:700 11.5px/1 "DM Sans",system-ui,sans-serif;padding:4px 9px;'
      + 'border-radius:0 0 8px 8px;cursor:pointer;border:1px solid #E3EAF0;border-top:0;'
      + 'background:#fff;color:#4B5A6D;pointer-events:auto;';
    b.onclick = function () { setFolded(false); };
    tab.appendChild(b);
    d.body.insertBefore(tab, d.body.firstChild);
  }

  function drawAdminBar() { if (folded()) { paintFolded(); } else { paint(); } }

  /* A HOOK, because the name is fetched in this file's OTHER closure and cannot call in here.
     Without it the strip only learns your name on the next page load, so Back to me left it saying
     "You are seeing your own pages" until she navigated again. Jessie, 2026-09-07: "yes back to me
     worked but it went back to saying You are seeing your own pages". */
  w.CW_REDRAW_ADMIN = function () { try { drawAdminBar(); } catch (e) {} };

  function open(bar) {
    var old = d.getElementById('cw-viewas-pick'); if (old) { old.remove(); return; }
    var panel = d.createElement('div');
    panel.id = 'cw-viewas-pick';
    // 34px was the strip's height on a desktop. On a phone it wraps onto two rows and the
    // picker opened behind it. The measured height, or 34 if nothing has measured yet.
    panel.style.cssText = 'position:sticky;top:calc(var(--cw-adminbar, 34px));z-index:99999;background:#fff;color:#1A2E42;'
      + 'border-bottom:1px solid #DDE3EA;padding:12px 14px;font:400 14px/1.4 "DM Sans",system-ui,sans-serif;';

    var _faSeq = 0;   // see the note on the fetch below: answers can arrive out of order
    var inp = d.createElement('input');
    inp.type = 'text';
    // IT DID NOT FIT. Jessie, 2026-09-07: "The placeholder doesn't fit. So just name or email."
    // On a phone the box is narrower than the sentence, so it cut off mid-word and told nobody
    // anything. Two words fit, and the search reads both.
    inp.placeholder = 'Name or email';
    inp.style.cssText = 'width:100%;max-width:420px;border:1.5px solid #DDE3EA;border-radius:10px;'
      + 'padding:9px 12px;font:inherit;outline:none;';
    var out = d.createElement('div');
    out.style.cssText = 'margin-top:8px;display:flex;flex-direction:column;gap:5px;max-width:420px;';
    /* SIGNED OUT IS ONE OF THE CHOICES, beside looking as a person. Jessie, 2026-09-10: "add a
       signed out view to here so i know hwat an even looks like or any page looks like for signed
       out". First in the panel and one press, because it needs no search. Drawn only when
       identity.js knows how to do it, so a cached older copy never offers a button that does
       nothing. */
    if (w.CW.viewSignedOut) {
      var outLine = d.createElement('div');
      outLine.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;';
      var asOut = d.createElement('button');
      asOut.type = 'button';
      asOut.textContent = 'Signed out';
      asOut.style.cssText = 'font:inherit;font-weight:700;padding:6px 14px;border-radius:14px;cursor:pointer;'
        + 'border:1px solid #DDE3EA;background:#F7FBFF;color:#1A2E42;';
      asOut.onclick = function () { w.CW.viewSignedOut(); w.location.reload(); };
      var outNote = d.createElement('span');
      outNote.textContent = 'See every page as somebody who is not signed in. Or look as a person:';
      outNote.style.cssText = 'font-size:12.5px;color:#6B7A8D;';
      outLine.appendChild(asOut); outLine.appendChild(outNote);
      panel.appendChild(outLine);
    }
    panel.appendChild(inp); panel.appendChild(out);
    bar.parentNode.insertBefore(panel, bar.nextSibling);
    inp.focus();

    /* A FACE AND AN ADDRESS UNDER THE NAME. Two rows both reading Doug Breitbart, with nothing to
       tell them apart, is the whole reason for this. Jessie, 2026-09-07. The photo is drawn only
       when there is one, so nobody gets an empty circle. */
    function esc(t) {
      return String(t == null ? '' : t)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function row(id, label, email, photo) {
      var b = d.createElement('button');
      b.type = 'button';
      b.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;text-align:left;'
        + 'font:inherit;padding:8px 11px;border-radius:9px;cursor:pointer;'
        + 'border:1px solid #DDE3EA;background:#F7FBFF;color:#1A2E42;';
      var face = photo
        ? '<img src="' + esc(photo) + '" alt="" style="width:30px;height:30px;border-radius:50%;'
          + 'object-fit:cover;flex:0 0 auto;">'
        : '';
      b.innerHTML = face
        + '<span style="min-width:0;">'
        +   '<span style="display:block;font-weight:700;">' + esc(label) + '</span>'
        +   (email ? '<span style="display:block;font-size:12px;color:#6B7A8D;overflow:hidden;'
              + 'text-overflow:ellipsis;">' + esc(email) + '</span>' : '')
        + '</span>';
      b.onclick = function () { w.CW.viewAs(id, label); w.location.reload(); };
      return b;
    }

    var timer = null;
    inp.addEventListener('input', function () {
      var q = inp.value.trim();
      if (timer) { clearTimeout(timer); }
      out.innerHTML = '';
      if (q.length < 2) { return; }
      /* THE TYPED TEXT IS OFFERED ONLY WHEN NOTHING MATCHED IT. It used to be drawn straight away
         for anything without a space, on the reasoning that a single word is as likely to be an id
         as a name. So typing "doug" put "doug" at the top of a list of Dougs, which reads as a
         duplicate of the thing you just typed. Jessie, 2026-09-07: "whatever i search for names it
         shows the name again - duplciative."

         Pasting an id still works, because an id matches no name and the list comes back empty,
         which is exactly when the typed text is worth offering. */
      /* THE LAST ANSWER TO ARRIVE IS NOT THE ANSWER TO THE LAST QUESTION. Jessie, 2026-09-07:
         "I looked Jerry up again to see what his email was and got this where nobody matches."
         Five people came back for "jerry": Devkumar Banerjee, Jeff McClard, Jessie Upp, Jennifer
         Diamond, Jennifer Mason. Nothing matches "jerry" and every one of them contains a j -
         Banerjee, Jeff, Jessie, Jennifer. That was the answer to her FIRST keystroke, landing
         after the answer to the whole word and painting over it.

         The debounce only stops a request being SENT. Once two are in flight this backend takes
         anywhere from two to forty seconds, so they come back in whatever order they finish, and
         the slower early one wins. A stamp on each request, and a check that the box still holds
         the text this answer was asked about, so a late reply to an abandoned question is dropped
         rather than drawn. */
      var seq = (++_faSeq);
      timer = setTimeout(function () {
        fetch(GS + '?action=findAnyone&appearId=' + encodeURIComponent(me.id)
              + '&q=' + encodeURIComponent(q))
          .then(function (r) { return r.json(); })
          .then(function (dd) {
            if (seq !== _faSeq) { return; }
            if (inp.value.trim() !== q) { return; }   // q is not lowercased where it is read
            var list = (dd && dd.status === 'ok' && dd.matches) ? dd.matches : [];
            out.innerHTML = '';
            list.forEach(function (p) {
              out.appendChild(row(p.appearId, (p.name || p.appearId), p.email, p.photo));
            });
            if (!list.length) {
              out.appendChild(row(q, q));
              var note = d.createElement('div');
              note.textContent = 'No name matched. Press it to view as that id.';
              note.style.cssText = 'font-size:12px;color:#6B7A8D;padding:2px 2px 0;';
              out.appendChild(note);
            }
          })
          .catch(function () {});
      }, 350);
    });
  }

  // Asked once and remembered, because the answer does not change between pages and the
  // backend takes its time. A wrong yes shows a bar that the backend still refuses to serve.
  var known = ls(function () { return w.localStorage.getItem('cw-super'); }, null);
  if (known === 'yes') { drawAdminBar(); return; }
  if (known === 'no') { return; }
  fetch(GS + '?action=amISuper&appearId=' + encodeURIComponent(me.id))
    .then(function (r) { return r.json(); })
    .then(function (dd) {
      var yes = !!(dd && dd.status === 'ok' && dd.isSuper);
      ls(function () { w.localStorage.setItem('cw-super', yes ? 'yes' : 'no'); });
      if (yes) { drawAdminBar(); }
    })
    .catch(function () {});
})(window, document);
