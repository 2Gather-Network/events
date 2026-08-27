/*
  Copyright 2026 DayBalancer LLC. All rights reserved.

  The code and the content here power Creating.Works, DayBalancer, Appear Network,
  and 2Gather. They are published so they can be read, audited, and dated.

  Running either as a separate offering requires a license, whether you brand it as
  ours or as your own, and whether or not money changes hands.

  hello@creating.works
*/
/*  Version: V5.42 | Date: 2026-08-26 | LAST CHANGE: ?chrome=2 full-bleed also stretches a centred flex item.
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
    try {
      var back = window.location.pathname + window.location.search;
      return 'https://2gather.network/signin/?next=' + encodeURIComponent(back);
    } catch (e) { return 'https://2gather.network/signin/'; }
  })();
  window.CW_SIGNUP = window.CW_SIGNUP || 'https://appear.network/';
  var HIDE_INSIDE_GLIDE = true;   // inside the Glide frame Glide already draws its own bar

  // ---- addresses, all of them, in one place ---------------------------------
  var LOGO     = 'https://2gather.network/images/2gather_logo.png';
  var EVENTS   = 'https://2gather.network/events';
  var MYEVENTS = 'https://2gather.network/myevents';
  var POST     = 'https://2gather.network/events?action=post';
  var MYGROUPS = 'https://2gather.network/mygroups';
  var START    = 'https://2gather.network/groups/create';
  var JOIN     = 'https://2gather.network/mygroups?join=1';
  var FINDTIME = 'https://2gather.network/find-a-time';
  var COMMONS  = 'https://events.2gather.network/events/yvrgej/zkxbzq';   // The Commons room, still
                                                                          // reachable from a group's Gather button
  var PROFILE  = 'https://creating.works/profile';
  var EDITME   = 'https://creating.works/profile-edit';
  var ACCOUNT  = 'https://creating.works/account';
  var ABOUT    = 'https://2gather.network/about';
  var SUPPORT  = 'https://2gather.network/support';

  // carry says which name that destination reads the person by.
  var NAV = [
    { key: 'events', label: 'Events', items: [
      { label: 'Calendar of events', url: EVENTS,   carry: 'memberCard' },
      // My events reads the person as `id`. Sent as memberCard it sees nothing and
      // falls back to a demo event, which is what it did until now.
      { label: 'My events',          url: MYEVENTS, carry: 'id' },
      { label: 'Post an event',      url: POST,     carry: 'memberCard' },
      { label: 'My event profile',   url: PROFILE,  carry: 'CWid' }
    ]},
    { key: 'groups', label: 'Groups', items: [
      { label: 'My groups',    url: MYGROUPS, carry: 'CWid' },
      { label: 'Start a group', url: START,   carry: 'CWid' },
      { label: 'Join a group',  url: JOIN,    carry: 'CWid' }
    ]},
    { key: 'more', label: 'More', items: [
      { label: 'Find a Time (Beta)', url: FINDTIME },
      { label: 'My profile',         url: ACCOUNT, carry: 'CWid' },
      { label: 'About',              url: ABOUT },
      { label: 'Support',            url: SUPPORT }
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

  function link(url, carry) {
    var who = me();
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
          row += anchor(n.items[j].label, link(n.items[j].url, n.items[j].carry), 'cwtb-item');
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

    var photo;
    if (!atDoor && me() && window.CW_TOPBAR_PHOTO) {
      photo = '<a role="link" tabindex="0" class="cwtb-face" title="My profile" data-nav="' +
              link(EDITME, 'CWid') + '" onclick="return _safeNavGo(this)">' +
              '<img src="' + window.CW_TOPBAR_PHOTO + '" alt=""></a>';
    } else if (!atDoor && me()) {
      photo = '<a role="link" tabindex="0" class="cwtb-signin cwtb-ghost cwtb-mine" data-nav="' +
              link(EDITME, 'CWid') + '" onclick="return _safeNavGo(this)">My profile</a>';
    } else {
      photo = '<a role="link" tabindex="0" class="cwtb-signin" data-nav="' +
              (window.CW_SIGNIN || 'https://appear.network/') +
              '" onclick="return _safeNavGo(this)">Sign in</a>' +
              '<a role="link" tabindex="0" class="cwtb-signin cwtb-ghost" data-nav="' +
              (window.CW_SIGNUP || 'https://appear.network/') +
              '" onclick="return _safeNavGo(this)">Sign up</a>';
    }

    var el = document.createElement('div');
    el.id = 'cw-topbar';
    el.innerHTML =
      '<div class="cwtb-bar">' +
        '<a role="link" tabindex="0" class="cwtb-mark" data-nav="' + link(EVENTS, 'memberCard') +
          '" onclick="return _safeNavGo(this)">' +
          '<span class="cwtb-glyph"><img src="' + LOGO + '" alt=""></span>' +
          '<span class="cwtb-word">Gathering for the common good.</span></a>' +
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

  // ?chrome=2 — preview of the full-bleed bar (Jessie 2026-08-26). The bar is a child of
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
    host.style.marginTop   = '-' + (parseFloat(cs.paddingTop) || 0) + 'px';
    host.style.marginBottom = '18px';
    var bar = host.querySelector('.cwtb-bar');
    if (bar) bar.style.boxShadow = 'none';
  }
  function maybeFullBleed() {
    try {
      if (!/[?&]chrome=2\b/.test(window.location.search)) return;
      fullBleed();
      window.addEventListener('resize', fullBleed);
    } catch (e) {}
  }

  function style() {
    var css =
      '#cw-topbar{font-family:"DM Sans","Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
        'position:relative;z-index:5;}' +
      '.cwtb-bar{background:#1F699E;display:flex;align-items:center;gap:14px;padding:0 16px;height:58px;' +
        'box-shadow:0 2px 0 rgba(0,0,0,.10),0 6px 14px rgba(15,45,70,.18);}' +
      '.cwtb-mark{display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none;cursor:pointer;}' +
      '.cwtb-glyph{width:38px;height:38px;border-radius:10px;background:#fff;display:flex;' +
        'align-items:center;justify-content:center;}' +
      '.cwtb-glyph img{width:30px;height:30px;object-fit:contain;display:block;}' +
      '.cwtb-word{color:rgba(255,255,255,.85);font-size:13px;font-weight:400;}' +
      '.cwtb-tabs{display:flex;align-items:center;gap:4px;margin-left:auto;margin-right:6px;' +
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
      '.cwtb-signin{flex-shrink:0;background:#fff;color:#1F699E;font-size:14px;font-weight:700;' +
        'padding:9px 18px;border-radius:22px;text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-signin:hover{background:#F7FBFF;}' +
      '.cwtb-ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55);margin-left:8px;}' +
      '.cwtb-ghost:hover{background:rgba(255,255,255,.12);}' +
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
        '.cwtb-tab{padding:8px 10px;font-size:13px;letter-spacing:.3px;}}';
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
    var face = document.querySelector('#cw-topbar .cwtb-face') ||
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
      face.className = 'cwtb-face';
      face.innerHTML = '<img src="' + src + '" alt="">';
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
    try {
      if (localStorage.getItem('cw-photo-for') === who && localStorage.getItem('cw-photo')) {
        window.CW_TOPBAR_PHOTO = localStorage.getItem('cw-photo');
        adopt();
        return;
      }
    } catch (e) {}
    try {
      fetch('https://cw-api-gate.jessieupp.workers.dev/?action=lookupProfile&appearId=' +
            encodeURIComponent(who))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.photo) return;
          window.CW_TOPBAR_PHOTO = d.photo;
          try {
            localStorage.setItem('cw-photo', d.photo);
            localStorage.setItem('cw-photo-for', who);
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
            (window.CW_SIGNIN || 'https://appear.network/') +
            '" onclick="return _safeNavGo(this)">Sign in</a>' +
          '<a role="link" tabindex="0" class="cwtb-ask-go cwtb-ask-ghost" data-nav="' +
            (window.CW_SIGNUP || 'https://appear.network/') +
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
      if (window.location.hostname.indexOf('creating.works') > -1 &&
          new URLSearchParams(window.location.search).get('topbar') !== '1') { return; }
    } catch (e) {}
    if (document.getElementById('cw-topbar') || hidden() || !SHOW_EVERYWHERE) return;
    var framed = false;
    try { framed = (window.self !== window.top); } catch (e) { framed = true; }
    if (framed && HIDE_INSIDE_GLIDE) return;
    style();
    draw();
    maybeFullBleed();
    watchForPhoto();
    fetchPhotoOnce();
    askToSignIn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else { go(); }
})();
