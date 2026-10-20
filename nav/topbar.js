(function () {
  'use strict';

  var SHOW_EVERYWHERE   = true;   

  window.CW_SIGNIN = window.CW_SIGNIN || (function () {
    var SIGNIN = 'https://2gather.network/signin/';
    try {
      var here = window.location.pathname || '';
      if (here.indexOf('/signin') === 0) { return SIGNIN; }
      return SIGNIN + '?next=' + encodeURIComponent(here + window.location.search);
    } catch (e) { return SIGNIN; }
  })();
  window.CW_SIGNUP = window.CW_SIGNUP || (function () {
    var SIGNUP = 'https://2gather.network/signup/';
    try {
      var here = window.location.pathname || '';
      if (here.indexOf('/signup') === 0 || here.indexOf('/signin') === 0) { return SIGNUP; }
      return SIGNUP + '?next=' + encodeURIComponent(here + window.location.search);
    } catch (e) { return SIGNUP; }
  })();
  window.CW_EVERYONE_GROUPS = window.CW_EVERYONE_GROUPS || ['beYd4M39RCqGSbP4KsNqGQ'];
  window.cwCountedGroups = window.cwCountedGroups || function (list) {
    var skip = window.CW_EVERYONE_GROUPS || [];
    return (list || []).filter(function (g) {
      var id = String((g && (g.groupID || g.groupId || g.id)) || g || '').trim();
      return id && skip.indexOf(id) === -1;
    });
  };
  var HIDE_INSIDE_GLIDE = true;   

  var LOGO     = 'https://2gather.network/images/2gather_logo.png';
  var SEED_SVG = '<svg class="cwtb-seed" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" focusable="false"><path d="M14 22.5Q10.5 18.5 12 13" fill="none" stroke="#6FA83A" stroke-width="2.2" stroke-linecap="round"/><path transform="rotate(-30 12 13)" d="M12 13C12 8 8 5 3 5c0 5 3 8 9 8z" fill="#58A03C"/><path transform="rotate(-5 12 14)" d="M12 14c0-5 4-9 10-9 0 6-4 9-10 9z" fill="#7FC241"/></svg>';
  var CW_LOGO  = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs>' +
    '<circle cx="18" cy="18" r="16" fill="none" stroke="url(#g)" stroke-width="2.5"/>' +
    '<g transform="translate(9 9) scale(.75)"><path d="M14 22.5Q10.5 18.5 12 13" fill="none" stroke="#6FA83A" stroke-width="2.2" stroke-linecap="round"/><path transform="rotate(-30 12 13)" d="M12 13C12 8 8 5 3 5c0 5 3 8 9 8z" fill="#58A03C"/><path transform="rotate(-5 12 14)" d="M12 14c0-5 4-9 10-9 0 6-4 9-10 9z" fill="#7FC241"/></g></svg>');
  function onCreatingWorks() { try { return (window.location.hostname || '').toLowerCase().indexOf('creating.works') > -1; } catch (e) { return false; } }
  function onAppear() { try { return (window.location.hostname || '').toLowerCase().indexOf('appear.network') > -1; } catch (e) { return false; } }
  var EVENTS   = 'https://2gather.network/events';
  var MYEVENTS = 'https://2gather.network/myevents/';
  var POST     = 'https://2gather.network/myevents/#new';
  var MYGROUPS = 'https://2gather.network/mygroups';
  var START    = 'https://2gather.network/groups/create';
  var JOIN     = 'https://2gather.network/mygroups?join=1';
  var FINDTIME = 'https://2gather.network/find-a-time';
  var COMMONS  = 'https://events.2gather.network/events/yvrgej/zkxbzq';   
  var PROFILE  = 'https://2gather.network/profile';
  var EDITME   = 'https://2gather.network/profile-edit';
  var ACCOUNT  = 'https://2gather.network/account';
  var ABOUT    = 'https://2gather.network/about';
  var SUPPORT  = 'https://2gather.network/support';

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

  function groupNavOn() {
    try { return /[?&]groupnav=1\b/.test(window.location.search); } catch (e) { return false; }
  }
  function groupInAddress() {
    try {
      var q = new URLSearchParams(window.location.search);
      var g = String(q.get('group') || q.get('groupId') || '').trim();
      if (g) { return g; }
      var p = String(window.location.pathname || '');
      if (/^\/(group|groups)\b/.test(p)) { return String(q.get('id') || '').trim(); }
      return '';
    } catch (e) { return ''; }
  }
  function groupNav() {
    var g = groupInAddress();
    if (!g) { return null; }
    var e = encodeURIComponent(g);
    return { key: 'thisgroup', label: 'This group', items: [
      { label: 'Info',           url: 'https://2gather.network/group/?id=' + e },
      { label: 'Dashboard',      url: 'https://2gather.network/groups/admin/?id=' + e },
      { label: 'Events',         url: 'https://2gather.network/myevents/?groupId=' + e },
      { label: 'Bulletin board', url: 'https://2gather.network/attendees/?group=' + e },
      { label: 'Matches',        url: 'https://2gather.network/attendees/?group=' + e + '&view=matches' }
    ]};
  }

  var NAV = [];
  var NAV_PARKED = [

    { key: 'events', label: 'Events', items: [
      { label: 'Find an event',      url: EVENTS,   carry: 'memberCard' },
      { label: 'My events',          url: MYEVENTS },
      { label: 'Post an event',      url: POST,     carry: 'memberCard' }
    ]},
    { key: 'groups', label: 'Groups', items: [
      { label: 'My groups',    url: MYGROUPS, carry: 'CWid' },
      { label: 'Join a group',  url: JOIN,    carry: 'CWid' },
      { label: 'Host a group',  url: START,   carry: 'CWid' }
    ]},
    { key: 'more', label: 'More', items: [
      { label: 'Where do I start?',  url: 'https://2gather.network/welcome/' },
      { label: 'My profile',         url: PROFILE,  carry: 'CWid' },
      { label: 'About',              url: ABOUT },
      { label: 'Support',            url: supportUrl() },
      { label: 'Sign out',           signOut: true }
    ]}
  ];

  function hasEvents() {
    try {
      var norm = function (x) { return String(x || '').split('.').join('').toLowerCase(); };
      var v = JSON.parse(localStorage.getItem('cw-haveevents') || 'null');
      return !!(v && v.yes === true && norm(v.who) === norm(me()));
    } catch (e) { return false; }
  }
  var INITIALS_CSS = 'display:flex;align-items:center;justify-content:center;background:#EEF4FA;color:#1F699E;font-weight:800;font-size:13px;';
  function initialsOf(n) {
    return String(n || '').trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }
  function adoptName(n) {
    try {
      var el = document.querySelector('#cw-topbar .cwtb-mine');
      if (!el || !n) return;
      var e3 = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
      el.className = 'cwtb-me';
      el.setAttribute('title', 'Yours');
      el.innerHTML = '<span class="cwtb-me-name">' + e3(n) + ' ' + SEED_SVG + '</span>'
        + '<span class="cwtb-face" style="' + INITIALS_CSS + '">' + e3(initialsOf(n)) + '</span>';
    } catch (e) {}
  }
  function hasBookmarks() {
    try {
      var norm = function (x) { return String(x || '').split('.').join('').toLowerCase(); };
      var v = JSON.parse(localStorage.getItem('cw-havebookmarks') || 'null');
      return !!(v && v.yes === true && norm(v.who) === norm(me()));
    } catch (e) { return false; }
  }
  function _tbProved() {
    try {
      if (!localStorage.getItem('cw-token')) { return false; }
      if (window.CW && window.CW.realMe) { return !!String(window.CW.realMe().id || ''); }
      return !!me();
    } catch (e) { return false; }
  }
  function _tbQuiet(k) {
    try { var t = parseInt(sessionStorage.getItem('cw-tb-quiet:' + k) || '0', 10); return !!t && Date.now() < t; } catch (e) { return false; }
  }
  function _tbHush(k, mins) {
    try { sessionStorage.setItem('cw-tb-quiet:' + k, String(Date.now() + mins * 60000)); } catch (e) {}
  }
  function checkBookmarks() {
    try {
      var who = me();
      if (!who) return;
      if (!_tbProved() || _tbQuiet('getBookmarks')) return;
      var norm = function (x) { return String(x || '').split('.').join('').toLowerCase(); };
      var v = JSON.parse(localStorage.getItem('cw-havebookmarks') || 'null');
      if (v && norm(v.who) === norm(who) && v.at && (Date.now() - v.at) < 6 * 60 * 60 * 1000) return;
      fetch('https://cw-api-gate.jessieupp.workers.dev/?action=getBookmarks&appearId=' + encodeURIComponent(who))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || d.status === 'error' || !Array.isArray(d.bookmarks)) { _tbHush('getBookmarks', 5); return; }
          localStorage.setItem('cw-havebookmarks', JSON.stringify({ who: who, yes: d.bookmarks.length > 0, at: Date.now() }));
        })
        .catch(function () { _tbHush('getBookmarks', 5); });
    } catch (e) {}
  }
  function myProfileUrl() {
    try {
      var norm = function (x) { return String(x || '').split('.').join('').toLowerCase(); };
      var real = (window.CW && window.CW.realMe) ? window.CW.realMe().id : me();
      var v = localStorage.getItem('cw-vanity') || '', f = localStorage.getItem('cw-vanity-for') || '';
      if (v && norm(f) && norm(f) === norm(real)) { return 'https://2gather.network/hi/' + encodeURIComponent(v); }
    } catch (e) {}
    return 'https://2gather.network/me/?mine=1';
  }
  function hasAGroup() {
    try { return !!me(); } catch (e) { return false; }
  }

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

  function realId() {
    try {
      if (window.CW && window.CW.realMe) {
        var r = String(window.CW.realMe().id || '').trim();
        if (r) return r;
      }
    } catch (e) {}
    return me();
  }

  function link(url) {
    return url;
  }

  function here() {
    var f = (window.location.pathname || '').toLowerCase();
    if (f.indexOf('mygroups') > -1 || f.indexOf('group') > -1 || f.indexOf('/groups/') > -1) return 'groups';
    if (f.indexOf('event') > -1 || f.indexOf('attendees') > -1 || f.indexOf('intro') > -1) return 'events';
    return '';
  }

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
    return '<a role="link" tabindex="0" class="' + cls + '" href="' + url + '" data-nav="' + url +
           '" onclick="return _safeNavGo(this)">' + label + '</a>';
  }

  var CARET = '<svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true"' +
              ' style="margin-left:5px;vertical-align:middle;"><path d="M1 1.5L5.5 5.5L10 1.5"' +
              ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function draw() {
    var open = here(), tabs = '', rows = '', i, j, n;
    var _gn = groupNavOn() ? groupNav() : null;
    if (_gn && NAV.indexOf(_gn) === -1) { NAV = NAV.concat([_gn]); }

    for (i = 0; i < NAV.length; i++) {
      n = NAV[i];
      if (n.items) {
        tabs += '<span class="cwtb-tab' + (n.key === open ? ' cwtb-on' : '') + '" role="button"' +
                ' tabindex="0" aria-expanded="false" data-menu="' + n.key + '">' + n.label + CARET + '</span>';
        var row = '';
        for (j = 0; j < n.items.length; j++) {
          var it = n.items[j];
          if (it.signOut) {
            if (!me()) { continue; }   
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

    var atDoor = (window.location.pathname || '').toLowerCase().indexOf('/signin') === 0;
    if (!atDoor) { checkBookmarks(); }

    function myName() {
      try {
        var n = String(window.CW_NAME || window.localStorage.getItem('cw-name') || '').trim();
        var forWho = String(window.localStorage.getItem('cw-name-for') || '').trim();
        if (!n) return '';
        if (forWho && String(me() || '').trim() && forWho !== String(me() || '').trim()) { return ''; }
        return n;
      } catch (e) { return ''; }
    }
    function esc2(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

    var _tkExpired = false;
    try {
      var _tk = String(window.localStorage.getItem('cw-token') || '');
      if (_tk) { var _tx = parseInt(_tk.split('.')[1], 10); _tkExpired = !!_tx && Date.now() > (_tx - 60000); }
    } catch (e) { _tkExpired = false; }
    var photo;
    if (!atDoor && me() && !_tkExpired && window.CW_TOPBAR_PHOTO) {
      var nm = myName();
      photo = '<span role="button" tabindex="0" class="cwtb-me" title="Yours" aria-expanded="false" data-menu="me">' +
              (nm ? '<span class="cwtb-me-name">' + esc2(nm) + ' ' + SEED_SVG + '</span>' : '') +
              '<span class="cwtb-face"><img src="' + window.CW_TOPBAR_PHOTO + '" alt=""></span></span>';
    } else if (!atDoor && me() && !_tkExpired && myName()) {
      photo = '<span role="button" tabindex="0" class="cwtb-me" title="Yours" aria-expanded="false" data-menu="me">' +
              '<span class="cwtb-me-name">' + esc2(myName()) + ' ' + SEED_SVG + '</span>' +
              '<span class="cwtb-face" style="' + INITIALS_CSS + '">' + esc2(initialsOf(myName())) + '</span></span>';
    } else if (!atDoor && me() && !_tkExpired) {
      photo = '<span role="button" tabindex="0" class="cwtb-me cwtb-mine" title="Yours" ' +
              'aria-label="Your menu" aria-expanded="false" data-menu="me">' +
              '<span class="cwtb-face" style="' + INITIALS_CSS + '"></span></span>';
    } else if (onCreatingWorks()) {
      photo = '';
    } else {
      var _si = (window.CW_SIGNIN || 'https://2gather.network/signin/');
      var _su = (window.CW_SIGNUP || 'https://2gather.network/signup/');
      photo = '<a role="link" tabindex="0" class="cwtb-signin" href="' + _si + '" data-nav="' + _si +
              '" onclick="return _safeNavGo(this)">Sign in</a>' +
              '<a role="link" tabindex="0" class="cwtb-signin cwtb-ghost" href="' + _su + '" data-nav="' + _su +
              '" onclick="return _safeNavGo(this)">Sign up</a>';
    }

    if (!atDoor && me()) {
      rows += '<div class="cwtb-row cwtb-row-me" data-row="me"></div>';
    }

    function fillMine() {
      var mine = '';
      mine += anchor('My profile', myProfileUrl(), 'cwtb-item');
      mine += anchor('My messages', 'https://2gather.network/messages', 'cwtb-item');
      if (hasEvents()) { mine += anchor('My events', link(MYEVENTS, 'memberCard'), 'cwtb-item'); }
      if (hasAGroup()) { mine += anchor('My groups', link(MYGROUPS, 'memberCard'), 'cwtb-item'); }
      if (hasBookmarks()) { mine += anchor('My bookmarks', 'https://2gather.network/network/', 'cwtb-item'); }
      mine += anchor('My account', link(ACCOUNT,  'CWid'),       'cwtb-item');
      mine += anchor('Support',    link(SUPPORT,  'memberCard'), 'cwtb-item');
      mine += '<a role="link" tabindex="0" class="cwtb-item" data-signout="1">Sign out</a>';
      return mine;
    }

    var _home = onCreatingWorks() ? 'https://creating.works/' : link(EVENTS, 'memberCard');
    var el = document.createElement('div');
    el.id = 'cw-topbar';
    el.innerHTML =
      '<div class="cwtb-bar">' +
        '<a role="link" tabindex="0" class="cwtb-mark" href="' + _home + '" data-nav="' + _home +
          '" onclick="return _safeNavGo(this)">' +
          '<span class="cwtb-glyph"><img src="' + (onCreatingWorks() ? CW_LOGO : onAppear() ? '/logo.png' : LOGO) + '" alt=""></span>' +
          '<span class="cwtb-word">' + (onCreatingWorks() ? 'Because creating works.' : onAppear() ? 'Appear and be seen.' : 'Gathering for the common good.') + '</span></a>' +
        '<div class="cwtb-tabs">' + tabs + '</div>' +
        photo +
      '</div>' + rows;

    document.body.insertBefore(el, document.body.firstChild);
    document.documentElement.className += ' cwtb-drawn';

    var triggers = el.querySelectorAll('[data-menu]');
    function place(t, r) {
      var bar = el.querySelector('.cwtb-bar');
      r.style.top = (bar.offsetHeight + 8) + 'px';
      r.style.left = '0px';
      var want = t.getBoundingClientRect().left - el.getBoundingClientRect().left;
      if (r.getAttribute('data-row') === 'me') {
        want = (t.getBoundingClientRect().right - el.getBoundingClientRect().left) - r.offsetWidth;
      }
      var room = el.clientWidth - r.offsetWidth - 8;
      r.style.left = Math.max(8, Math.min(want, room)) + 'px';
    }
    function show(key) {
      var t, r, k;
      el.className = key ? 'cwtb-menuing' : '';
      for (var a = 0; a < triggers.length; a++) {
        t = triggers[a];
        k = t.getAttribute('data-menu');
        r = el.querySelector('[data-row="' + k + '"]');
        var on = (k === key);
        t.setAttribute('aria-expanded', on ? 'true' : 'false');
        t.className = t.className.replace(/ ?cwtb-lit/, '') + (on ? ' cwtb-lit' : '');
        if (r) {
          if (on && k === 'me') { r.innerHTML = fillMine(); wireSignOut(r); }
          r.className = 'cwtb-row' + (k === 'me' ? ' cwtb-row-me' : '') + (on ? ' cwtb-open' : '');
          if (on) { place(t, r); }
        }
      }
    }
    function wireSignOut(root) {
      var outs = root.querySelectorAll('[data-signout]');
      for (var o = 0; o < outs.length; o++) {
        outs[o].addEventListener('click', function () {
          if (window.CW && window.CW.forget) { window.CW.forget(); }
          window.location.href = 'https://2gather.network/signin/?out=1';
        });
      }
    }
    wireSignOut(el);
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

  function fullBleed() {
    var host = document.getElementById('cw-topbar');
    if (!host) return;
    var p  = host.parentElement || document.body;
    var cs = window.getComputedStyle(p);
    host.style.alignSelf = 'stretch';
    host.style.width     = 'auto';
    host.style.marginLeft  = '-' + (parseFloat(cs.paddingLeft) || 0) + 'px';
    host.style.marginRight = '-' + (parseFloat(cs.paddingRight) || 0) + 'px';
    var docEl = (typeof document !== 'undefined') ? document.documentElement : null;
    var reserved = docEl ? (parseFloat(
      window.getComputedStyle(docEl).getPropertyValue('--cw-adminbar')
    ) || 0) : 0;
    var wantNew = false;
    try { wantNew = new URLSearchParams(window.location.search).get('bar') === '1'; } catch (e) {}
    if (!wantNew) return;                       
    host.style.marginTop   = '-' + Math.max(0, (parseFloat(cs.paddingTop) || 0) - reserved) + 'px';
    host.style.marginBottom = '0px';            
    var bar = host.querySelector('.cwtb-bar');
    if (bar) bar.style.boxShadow = 'none';
  }
  function applyFullBleed() {
    try {
      fullBleed();
      window.addEventListener('resize', fullBleed);
    } catch (e) {}
  }

  function loadFont() {
    try {
      if (document.querySelector('link[href*="Nunito+Sans"]')) { return; }
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap';
      document.head.appendChild(l);
    } catch (e) {}
  }

  function style() {
    loadFont();
    var css =
      '#cw-topbar{font-family:"Nunito Sans","DM Sans","Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
        'position:sticky;top:var(--cw-adminbar,0px);z-index:1000;}' +
      '@media (max-width:700px){#cw-viewas{font-size:11.5px !important;gap:6px 8px !important;' +
        'padding:calc(5px + env(safe-area-inset-top, 0px)) 8px 5px !important;}' +
        '#cw-viewas button{padding:3px 8px !important;font-size:11.5px !important;}' +
        '#cw-viewas a{font-size:11.5px !important;}}' +
      '.cwtb-bar{background:#1F699E;display:flex;align-items:center;gap:14px;padding:0 16px;height:58px;' +
        'box-shadow:0 2px 0 rgba(0,0,0,.10),0 6px 14px rgba(15,45,70,.18);}' +
      '.cwtb-mark{display:flex;align-items:center;gap:10px;flex-shrink:0;text-decoration:none;cursor:pointer;}' +
      '.cwtb-glyph{width:38px;height:38px;border-radius:10px;background:#fff;display:flex;' +
        'align-items:center;justify-content:center;}' +
      '.cwtb-glyph img{width:30px;height:30px;object-fit:contain;display:block;}' +
      '.cwtb-word{color:rgba(255,255,255,.85);font-size:13px;font-weight:400;}' +
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
      '.cwtb-seed{display:inline-block;vertical-align:-3px;}' +
      '@media(max-width:700px){.cwtb-me{background:none;padding:0;gap:0;}' +
        '.cwtb-me-name{display:none;}' +
        '.cwtb-me .cwtb-face{width:36px;height:36px;box-shadow:0 0 0 2px rgba(255,255,255,.55);}}' +
      '.cwtb-signin{flex-shrink:0;background:#fff;color:#1F699E;font-size:14px;font-weight:700;' +
        'padding:9px 18px;border-radius:22px;text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-signin:hover{background:#F7FBFF;}' +
      '.cwtb-ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.55);margin-left:8px;}' +
      '.cwtb-ghost:hover{background:rgba(255,255,255,.12);}' +
      '.cwtb-signin.cwtb-ghost{color:#fff;}' +
      '.cwtb-ask{padding:48px 20px;display:flex;justify-content:center;}' +
      '.cwtb-ask-card{background:#fff;border-radius:16px;padding:34px 34px 30px;max-width:460px;width:100%;}' +
      '.cwtb-ask-card h1{font-size:22px;font-weight:800;color:#1A2E42;margin:0 0 8px;line-height:1.3;}' +
      '.cwtb-ask-card p{font-size:15px;color:#4B5A6D;line-height:1.55;margin:0 0 22px;}' +
      '.cwtb-ask-row{display:flex;gap:10px;flex-wrap:wrap;}' +
      '.cwtb-ask-go{background:#1F699E !important;color:#fff !important;font-size:15px;font-weight:700;' +
        'padding:12px 24px;border-radius:24px;text-decoration:none !important;cursor:pointer;' +
        'display:inline-block;line-height:1.2;}' +
      '.cwtb-ask-ghost{background:#fff !important;color:#1F699E !important;' +
        'box-shadow:inset 0 0 0 1.5px #C9DFF3;}' +
      '@media(max-width:700px){.cwtb-signin{padding:8px 13px;font-size:13px;}.cwtb-ghost{margin-left:6px;}}' +
      '.cwtb-row{display:none;position:absolute;min-width:236px;background:#fff;border-radius:14px;' +
        'padding:10px 0;box-shadow:0 14px 34px rgba(15,45,70,.28);z-index:20;}' +
      '.cwtb-row.cwtb-open{display:block;}' +
      '.cwtb-me{cursor:pointer;}' +
      '.cwtb-tab[data-menu="thisgroup"]{font-weight:800;}' +
      '.cwtb-item{display:block;padding:13px 22px;font-size:16px;font-weight:500;color:#1A2E42;' +
        'text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-item:hover{background:#F7FBFF;}' +
      '.cwtb-drawn .cw-dupe-brand{display:none !important;}' +
      '.cwtb-lit:not(.cwtb-me){background:rgba(255,255,255,.20);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);}' +
      '#cw-topbar.cwtb-menuing .cwtb-tab.cwtb-on:not(.cwtb-lit){background:transparent;box-shadow:none;}' +
      '@media(max-width:700px){.cwtb-bar{gap:8px;padding:0 10px;height:54px;}' +
        '.cwtb-word{display:none;}.cwtb-tabs{margin-left:auto;}' +
        '.cwtb-tab{padding:8px 10px;font-size:13px;letter-spacing:.3px;}}' +
      '@media(max-width:560px){' +
        '.cwtb-bar{flex-wrap:wrap;height:auto;min-height:54px;padding:6px 10px 8px;row-gap:4px;}' +
        '.cwtb-mark{margin-right:auto;}' +
        '.cwtb-tabs{order:3;width:100%;margin:0;justify-content:space-between;overflow-x:visible;}' +
        '.cwtb-tab{padding:8px 12px;font-size:13.5px;letter-spacing:.4px;}' +
      '}' +
      'body{overflow-x:clip;overflow-wrap:break-word;}' +
      '@media(max-width:768px){' +
        'input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea' +
        '{font-size:16px !important;}' +
      '}';
    var s = document.createElement('style');
    s.id = 'cw-topbar-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function adopt() {
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
      face.innerHTML = (nm2 ? '<span class="cwtb-me-name">' + esc3(nm2) + ' ' + SEED_SVG + '</span>' : '')
                     + '<span class="cwtb-face"><img src="' + src + '" alt=""></span>';
      return true;
    }
    return false;
  }

  function fetchPhotoOnce() {
    var who = me();
    if (!who) return;
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
    if (!_tbProved() || _tbQuiet('lookupProfile')) return;
    try {
      fetch('https://cw-api-gate.jessieupp.workers.dev/?action=lookupProfile&appearId=' +
            encodeURIComponent(who))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || d.status === 'error') { _tbHush('lookupProfile', 5); return; }
          try {
            if (d.name) {
              window.CW_NAME = d.name;
              localStorage.setItem('cw-name', d.name);
              localStorage.setItem('cw-name-for', who);
            }
          } catch (e) {}
          if (!d.photo) { _tbHush('lookupProfile', 60); if (d.name) { adoptName(d.name); } return; }
          window.CW_TOPBAR_PHOTO = d.photo;
          try { if (window.CW_REDRAW_ADMIN) { window.CW_REDRAW_ADMIN(); } } catch (e) {}
          try {
            localStorage.setItem('cw-photo', d.photo);
            localStorage.setItem('cw-photo-for', who);
            localStorage.setItem('cw-photo-at', String(Date.now()));
          } catch (e) {}
          adopt();
        })
        .catch(function () { _tbHush('lookupProfile', 5); });
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

  var MASK_BY_DEFAULT = true;
  var WHO_PARAMS = ['CWid', 'memberCard', 'appearId', 'me'];

  function remember(id) {
    if (!id) return;
    try {
      var seen = (window.CW && window.CW.viewingAs)
        ? String(window.CW.viewingAs() || '').trim()
        : String(sessionStorage.getItem('cw-view-as') || '').trim();   
      if (seen) { return; }
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
    var shown = p.get('show');
    if (shown && String(shown).split('.').join('').toLowerCase() ===
                 String(id).split('.').join('').toLowerCase()) { p.delete('show'); }
    p.delete('mask');
    var rest = p.toString();
    var clean = window.location.pathname + (rest ? '?' + rest : '') + window.location.hash;
    try { window.history.replaceState(null, '', clean); } catch (e) {}
  }

  var MINE_ONLY = [
    '/mygroups', '/myevents',
    '/groups/create', '/groups/invite', '/groups/host', '/groups/request',
    '/commons', '/attendees'
  ];

  function askToSignIn() {
    var path = (window.location.pathname || '').toLowerCase();
    var gated = MINE_ONLY.some(function (p) { return path.indexOf(p) === 0; });
    if (!gated && (path.indexOf('/me') === 0 || path.indexOf('/ikigai') === 0)) {
      var _q = ''; try { var _sp = new URLSearchParams(window.location.search);
        _q = ['show', 'id', 'CWid', 'me', 'memberCard', 'appearId', 'p'].map(function (k) { return _sp.get(k) || ''; }).join(''); } catch (e) {}
      gated = !_q;
    }
    if (!gated || me()) return;

    var go = window.CW_SIGNIN || '';
    if (go.indexOf('/signin') > -1) {
      try { window.location.replace(go); return; } catch (e) {}
    }

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
      else if (host.indexOf('appear') > -1) { href = '/logo.png'; }
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

    try {
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

(function (w, d) {
  'use strict';
  if (!w.CW || !w.CW.realMe) { return; }

  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var me = w.CW.atKeyboard ? w.CW.atKeyboard() : w.CW.realMe();
  if (!me.known) { return; }

  function ls(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }

  function _supportHere() {
    var here = '';
    try { here = String(w.location.pathname || '').trim(); } catch (e) {}
    return here
      ? 'https://2gather.network/support?from=' + encodeURIComponent(here)
      : 'https://2gather.network/support';
  }

  function paint() {
    var old = d.getElementById('cw-viewas'); if (old) { old.remove(); }
    if (_starEl) { _starEl.remove(); _starEl = null; }
    var out = !!(w.CW.signedOutView && w.CW.signedOutView());
    var seen = w.CW.viewingAs();
    var name = ls(function () { return w.sessionStorage.getItem('cw-view-as-name') || ''; }, '');

    var bar = d.createElement('div');
    bar.id = 'cw-viewas';
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;display:flex;align-items:center;gap:10px;'
      + 'flex-wrap:wrap;gap:10px 16px;padding:calc(7px + env(safe-area-inset-top, 0px)) 14px 7px;'
      + 'font:600 13px/1.4 "Nunito Sans","DM Sans",system-ui,sans-serif;'
      + 'background:#fff;color:#1A2E42;border-bottom:1px solid #E3EAF0;'
      + ((seen || out) ? 'box-shadow:inset 4px 0 0 #B8862F;' : '');

    var left = d.createElement('div');
    left.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0;';
    var right = d.createElement('div');
    right.style.cssText = 'display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-left:auto;';
    bar.appendChild(left); bar.appendChild(right);
    var reserving = false;
    function reserve() {
      if (reserving) { return; }
      reserving = true;
      try {
        var h = bar.getBoundingClientRect().height;
        if (!h) { return; }
        d.documentElement.style.setProperty('--cw-adminbar', h + 'px');
        var hp = 0; try { hp = parseFloat(w.getComputedStyle(d.documentElement).paddingTop) || 0; } catch (e3) {}
        d.body.style.paddingTop = Math.max(0, h - hp) + 'px';
        try { fullBleed(); } catch (e2) {}
        w.dispatchEvent(new Event('resize'));
      } catch (e) {
      } finally {
        reserving = false;
      }
    }
    setTimeout(reserve, 0);
    try { if (d.fonts && d.fonts.ready) { d.fonts.ready.then(reserve); } } catch (e) {}
    setTimeout(reserve, 400);
    w.addEventListener('resize', reserve);
    w.addEventListener('orientationchange', reserve);

    var says;
    if (out) {
      says = d.createElement('span');
      says.textContent = 'Viewing signed out';
      says.style.color = '#8A6220';
    } else if (seen) {
      says = d.createElement('span');
      says.textContent = 'Viewing as ' + (name || seen);
      says.style.color = '#8A6220';
    } else {
      var mine = '';
      try {
        var nameFor = String(w.localStorage.getItem('cw-name-for') || '').trim();
        var realNow = String((w.CW && w.CW.realMe && w.CW.realMe().id) || '').trim();
        var _flat = function (x) { return String(x || '').split('.').join('').toLowerCase(); };
        if (nameFor && realNow && _flat(nameFor) === _flat(realNow)) {
          mine = String(w.localStorage.getItem('cw-name') || '').trim();
        }
      } catch (e) {}
      says = d.createElement('button');
      says.type = 'button';
      says.textContent = mine || '';
      says.style.cssText = 'font:inherit;padding:0;border:0;background:transparent;color:#1A2E42;'
        + 'cursor:pointer;text-align:left;';
      says.onclick = function () { try { w.CW.stopViewing(); } catch (e) {} w.location.reload(); };
    }
    left.appendChild(says);

    var pick = d.createElement('button');
    pick.type = 'button';
    pick.textContent = 'Change view';
    pick.style.cssText = 'font:inherit;padding:4px 12px;border-radius:14px;cursor:pointer;'
      + 'border:1px solid #C3D0DB;background:transparent;color:#1A2E42;';
    pick.onclick = function () { open(bar); };
    left.appendChild(pick);

    if (seen || out) {
      var stop = d.createElement('button');
      stop.type = 'button';
      stop.textContent = 'Back to me';
      stop.style.cssText = 'font:inherit;padding:4px 12px;border-radius:14px;cursor:pointer;'
        + 'border:0;background:#1A2E42;color:#fff;font-weight:800;';
      stop.onclick = function () { w.CW.stopViewing(); w.location.reload(); };
      left.appendChild(stop);
    }

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

    if (operatorOk) {
      var pw = adminLink(wordsLabel(), '#', false);
      pw.id = 'cw-words-link';
      pw.onclick = function (ev) { ev.preventDefault(); openWords(bar); };
      wordCountLoad();
    }

    var fold = d.createElement('button');
    fold.type = 'button';
    fold.textContent = 'Hide';
    fold.style.cssText = 'font:inherit;font-size:12.5px;padding:4px 11px;border-radius:14px;'
      + 'cursor:pointer;border:1px solid #C3D0DB;background:transparent;color:#4B5A6D;';
    fold.onclick = function () { setFolded(true); };
    right.appendChild(fold);

    d.body.insertBefore(bar, d.body.firstChild);
  }

  w.CW_ADMIN_HIDDEN = false;

  var FOLD_KEY = 'cw-admin-folded';
  function folded() { return ls(function () { return w.localStorage.getItem(FOLD_KEY) === '1'; }, false); }
  function setFolded(v) {
    ls(function () {
      if (v) { w.localStorage.setItem(FOLD_KEY, '1'); } else { w.localStorage.removeItem(FOLD_KEY); }
    });
    drawAdminBar();
  }

  var _starEl = null;
  function paintFolded() {
    var old = d.getElementById('cw-viewas'); if (old) { old.remove(); }
    if (_starEl) { _starEl.remove(); _starEl = null; }
    try {
      d.documentElement.style.setProperty('--cw-adminbar', '0px');
      d.body.style.paddingTop = '';
      w.dispatchEvent(new Event('resize'));
    } catch (e) {}
    var star = d.createElement('button');
    star.type = 'button';
    star.id = 'cw-adminstar';
    star.textContent = '\u2B50';
    star.setAttribute('aria-label', 'Show the admin bar');
    star.title = 'Show the admin bar';
    star.style.cssText = 'flex:0 0 auto;font-size:20px;line-height:1;background:none;border:0;padding:4px 8px;cursor:pointer;position:relative;left:5px;';
    star.onclick = function () { setFolded(false); };
    _starEl = star;
    var place = function () {
      try {
        if (_starEl !== star) { return; }
        var me = d.querySelector('.cwtb-me, .cwtb-signin');
        if (me && me.parentNode && star.nextSibling !== me) { me.parentNode.insertBefore(star, me); }
      } catch (e) {}
    };
    place();
    var tries = 0, tick = setInterval(function () { place(); if (++tries > 120 || _starEl !== star) { clearInterval(tick); } }, 500);
  }

  var superOk = false;
  var operatorOk = false;
  var wordsLeft = null;
  var WORDS_KEY = 'cw-wordcount';
  function wordsLabel() { return (wordsLeft === null ? '' : '(' + wordsLeft + ') ') + 'Proposed words'; }
  function wordsSet(n) {
    wordsLeft = n;
    ls(function () { w.localStorage.setItem(WORDS_KEY, JSON.stringify({ n: n, at: Date.now(), who: realMeId })); });
    var a = d.getElementById('cw-words-link'); if (a) { a.textContent = wordsLabel(); }
  }
  w.CW_WORDS_REFRESH = function () { if (!operatorOk) { return; } ls(function () { w.localStorage.removeItem(WORDS_KEY); }); wordCountLoad(); };
  function wordCountLoad() {
    var c = ls(function () { return JSON.parse(w.localStorage.getItem(WORDS_KEY) || 'null'); }, null);
    if (c && c.who === realMeId && typeof c.n === 'number') {
      wordsLeft = c.n;
      var a0 = d.getElementById('cw-words-link'); if (a0) { a0.textContent = wordsLabel(); }
      if (Date.now() - (c.at || 0) < 300000) { return; }
    }
    var auth = '&appearId=' + encodeURIComponent(realMeId)
      + '&meToken=' + encodeURIComponent(String(ls(function () { return w.localStorage.getItem('cw-token'); }, '') || ''));
    fetch(GS + '?action=getWordReview' + auth + '&t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (r) { if (r && r.status === 'ok' && Array.isArray(r.items)) { wordsSet(r.items.length); } })
      .catch(function () {});
  }
  function drawAdminBar() { if (w.CW_ADMIN_HIDDEN || !superOk) { return; } if (folded()) { paintFolded(); } else { paint(); } }

  w.CW_REDRAW_ADMIN = function () { try { drawAdminBar(); } catch (e) {} };

  var KINDOF_READY = true;
  var _wordRows = null;
  function wordRows(done) {
    if (_wordRows) { done(_wordRows); return; }
    var kept = ls(function () { return JSON.parse(w.localStorage.getItem('cw-words-v3') || 'null'); }, null);
    if (kept && kept.rows && kept.rows.length) { _wordRows = kept.rows; done(_wordRows); return; }
    fetch(GS + '?action=getCategories&words=1')
      .then(function (r) { return r.json(); })
      .then(function (r) { _wordRows = (r && r.words) || []; done(_wordRows); })
      .catch(function () { _wordRows = []; done(_wordRows); });
  }
  function openWords(bar) {
    var old = d.getElementById('cw-viewas-words'); if (old) { old.remove(); return; }
    var other = d.getElementById('cw-viewas-pick'); if (other) { other.remove(); }
    var panel = d.createElement('div');
    panel.id = 'cw-viewas-words';
    var top = 34; try { top = Math.round(bar.getBoundingClientRect().bottom) || 34; } catch (e) {}
    panel.style.cssText = 'position:fixed;left:0;right:0;top:' + top + 'px;max-height:70vh;overflow:auto;'
      + 'box-shadow:0 6px 18px rgba(26,46,66,.12);z-index:100000;background:#fff;color:#1A2E42;'
      + 'border-bottom:1px solid #DDE3EA;padding:12px 14px;font:400 14px/1.4 "Nunito Sans","DM Sans",system-ui,sans-serif;';
    var head = d.createElement('div');
    head.style.cssText = 'font-weight:800;margin-bottom:8px;';
    head.textContent = 'Looking for proposed words…';
    var list = d.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:8px;max-width:640px;';
    panel.appendChild(head); panel.appendChild(list);
    d.body.appendChild(panel);
    var auth = '&appearId=' + encodeURIComponent(realMeId)
      + '&meToken=' + encodeURIComponent(String(ls(function () { return w.localStorage.getItem('cw-token'); }, '') || ''));
    var left = 0, stampAt = 0, cachedN = null;
    var c0 = ls(function () { return JSON.parse(w.localStorage.getItem(WORDS_KEY) || 'null'); }, null);
    if (c0 && c0.who === realMeId && typeof c0.n === 'number') { cachedN = c0.n; stampAt = Number(c0.at) || 0; }
    function when(t) {
      try { return new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; }
    }
    function countLine(n) {
      return (n ? n + ' proposed ' + (n === 1 ? 'word' : 'words') + ' to review' : 'No proposed words waiting') + (stampAt ? ' \u00B7 Last updated ' + when(stampAt) : '');
    }
    function count() { head.textContent = countLine(left); }
    function say(t) { head.textContent = cachedN !== null ? countLine(cachedN) + ' \u00B7 ' + t : t; }
    if (cachedN !== null) { head.textContent = countLine(cachedN) + ' \u00B7 Checking again\u2026'; }
    function line(it) {
      var row = d.createElement('div');
      row.style.cssText = 'border:1px solid #E3EAF0;border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;gap:6px;';
      var shown = it.kind === 'word' ? it.word : (it.word + ' › ' + it.value);
      var what = it.kind === 'word'
        ? [(it.categories && it.categories.length ? 'Categories: ' + it.categories.join(', ') : ''),
           (it.kindOf && it.kindOf.length ? 'Kind of: ' + it.kindOf.join(', ') : '')].filter(String).join(' · ')
        : ('Added ' + (it.added === 'otherName' ? 'another name' : it.added === 'kindOf' ? 'a kind of' : 'a category') + ' to ' + it.word);
      var t = d.createElement('div');
      t.style.cssText = 'font-weight:700;';
      t.textContent = shown + (it.looksLikeName ? ' (may be a first name)' : '');
      var m = d.createElement('div');
      m.style.cssText = 'font-size:13px;color:#4B5A6D;';
      m.textContent = what || 'No categories chosen';
      var kindId = '';
      var kindBox = null;
      if (KINDOF_READY && !/^a\d+$/.test(String(it.ref))) {
        kindBox = d.createElement('div');
        kindBox.style.cssText = 'display:flex;flex-direction:column;gap:4px;max-width:420px;';
        var kl = d.createElement('div');
        kl.style.cssText = 'font-size:13px;font-weight:700;';
        kl.textContent = 'Is a kind of (optional)';
        var kin = d.createElement('input');
        kin.type = 'text'; kin.placeholder = 'Search the words, for example Endurance sports';
        kin.setAttribute('aria-label', 'Is a kind of');
        kin.style.cssText = 'font:inherit;border:1.5px solid #DDE3EA;border-radius:10px;padding:7px 10px;outline:none;';
        var kres = d.createElement('div');
        kres.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';
        var kchip = d.createElement('div');
        kchip.style.cssText = 'font-size:13px;color:#1A2E42;';
        kin.addEventListener('input', function () {
          var q = kin.value.trim().toLowerCase(); kres.textContent = '';
          if (q.length < 2) { return; }
          wordRows(function (rows) {
            var hits = rows.filter(function (r) { return String(r[1] || '').toLowerCase().indexOf(q) > -1 && String(r[0]) !== String(it.ref); }).slice(0, 8);
            hits.forEach(function (r) {
              var b = d.createElement('button'); b.type = 'button'; b.textContent = r[1];
              b.style.cssText = 'font:inherit;font-size:13px;padding:4px 10px;border-radius:14px;cursor:pointer;border:1px solid #C3D0DB;background:#F7FBFF;color:#1A2E42;';
              b.onclick = function () { kindId = String(r[0]); kin.value = ''; kres.textContent = ''; kchip.textContent = 'Will be a kind of: ' + r[1]; };
              kres.appendChild(b);
            });
          });
        });
        kindBox.appendChild(kl); kindBox.appendChild(kin); kindBox.appendChild(kres); kindBox.appendChild(kchip);
      }
      var btns = d.createElement('div');
      btns.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
      var ok = d.createElement('button'), no = d.createElement('button'), msg = d.createElement('span');
      ok.type = 'button'; no.type = 'button';
      ok.textContent = 'Approve'; no.textContent = 'Reject';
      ok.style.cssText = 'font:inherit;font-weight:800;padding:5px 14px;border-radius:14px;cursor:pointer;border:0;background:#1A2E42;color:#fff;';
      no.style.cssText = 'font:inherit;padding:5px 14px;border-radius:14px;cursor:pointer;border:1px solid #C3D0DB;background:transparent;color:#1A2E42;';
      msg.style.cssText = 'font-size:13px;color:#8A6220;';
      function decide(dec) {
        ok.disabled = no.disabled = true; msg.textContent = 'Saving…';
        fetch(GS + '?action=reviewWord' + auth + '&ref=' + encodeURIComponent(it.ref) + '&decision=' + dec + (dec === 'keep' && kindId ? '&kindOf=' + encodeURIComponent(kindId) : '') + '&t=' + Date.now())
          .then(function (r) { return r.json(); })
          .then(function (r) {
            if (r && r.status === 'ok') { row.remove(); left--; count(); wordsSet(left); return; }
            ok.disabled = no.disabled = false; msg.textContent = (r && r.message) || 'Could not save. Try again.';
          })
          .catch(function () { ok.disabled = no.disabled = false; msg.textContent = 'Could not reach the server. Try again.'; });
      }
      ok.onclick = function () { decide('keep'); };
      no.onclick = function () { decide('remove'); };
      btns.appendChild(ok); btns.appendChild(no); btns.appendChild(msg);
      row.appendChild(t); row.appendChild(m); if (kindBox) { row.appendChild(kindBox); } row.appendChild(btns);
      return row;
    }
    fetch(GS + '?action=getWordReview' + auth + '&t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r || r.status !== 'ok' || !Array.isArray(r.items)) { say((r && r.message) || 'The list did not come back. Try again.'); return; }
        left = r.items.length; stampAt = Date.now(); count(); wordsSet(left);
        r.items.forEach(function (it) { list.appendChild(line(it)); });
      })
      .catch(function () { say('Could not reach the server. Try again.'); });
  }

  function open(bar) {
    var oldW = d.getElementById('cw-viewas-words'); if (oldW) { oldW.remove(); }
    var old = d.getElementById('cw-viewas-pick'); if (old) { old.remove(); return; }
    var panel = d.createElement('div');
    panel.id = 'cw-viewas-pick';
    var _pTop = 34; try { _pTop = Math.round(bar.getBoundingClientRect().bottom) || 34; } catch (e) {}
    panel.style.cssText = 'position:fixed;left:0;right:0;top:' + _pTop + 'px;max-height:70vh;overflow:auto;box-shadow:0 6px 18px rgba(26,46,66,.12);z-index:100000;background:#fff;color:#1A2E42;'
      + 'border-bottom:1px solid #DDE3EA;padding:12px 14px;font:400 14px/1.4 "Nunito Sans","DM Sans",system-ui,sans-serif;';

    var _faSeq = 0;   
    var inp = d.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Name or email';
    inp.style.cssText = 'width:100%;max-width:420px;border:1.5px solid #DDE3EA;border-radius:10px;'
      + 'padding:9px 12px;font:inherit;outline:none;';
    var out = d.createElement('div');
    out.style.cssText = 'margin-top:8px;display:flex;flex-direction:column;gap:5px;max-width:420px;';
    if (w.CW && w.CW.viewSignedOut) {
      var outLine = d.createElement('div');
      outLine.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px;';
      var asOut = d.createElement('button');
      asOut.type = 'button';
      asOut.textContent = 'Signed out';
      asOut.style.cssText = 'font:inherit;font-weight:700;padding:6px 14px;border-radius:14px;cursor:pointer;'
        + 'border:1px solid #DDE3EA;background:#F7FBFF;color:#1A2E42;';
      asOut.onclick = function () { w.CW.viewSignedOut(); w.location.reload(); };
      outLine.appendChild(asOut);
      panel.appendChild(outLine);
    }
    panel.appendChild(inp); panel.appendChild(out);
    bar.parentNode.insertBefore(panel, bar.nextSibling);
    inp.focus();

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
        +   (email ? '<span style="display:block;font-size:12px;color:#4B5A6D;overflow:hidden;'
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
      var seq = (++_faSeq);
      timer = setTimeout(function () {
        fetch(GS + '?action=findAnyone&appearId=' + encodeURIComponent(me.id)
              + '&meToken=' + encodeURIComponent(String(w.localStorage.getItem('cw-token') || ''))
              + '&q=' + encodeURIComponent(q))
          .then(function (r) { return r.json(); })
          .then(function (dd) {
            if (seq !== _faSeq) { return; }
            if (inp.value.trim() !== q) { return; }   
            var list = (dd && dd.status === 'ok' && dd.matches) ? dd.matches : [];
            out.innerHTML = '';
            list.forEach(function (p) {
              out.appendChild(row(p.appearId, (p.name || p.appearId), p.email, p.photo));
            });
            if (!list.length) {
              out.appendChild(row(q, q));
              var note = d.createElement('div');
              note.textContent = 'No name matched. Press it to view as that id.';
              note.style.cssText = 'font-size:12px;color:#4B5A6D;padding:2px 2px 0;';
              out.appendChild(note);
            }
          })
          .catch(function () {});
      }, 350);
    });
  }

  function provenSelf(id) {
    try {
      var t = String(w.localStorage.getItem('cw-token') || '');
      if (!t) return false;
      var exp = parseInt(t.split('.')[1], 10);
      if (!exp || Date.now() > (exp - 60000)) return false;
      var who  = String(w.localStorage.getItem('cw-id') || '').split('.').join('').toLowerCase();
      var mine = String(id || '').split('.').join('').toLowerCase();
      return !!who && !!mine && who === mine;
    } catch (e) { return false; }
  }
  var CW_ADMIN_OFF = false;
  if (CW_ADMIN_OFF) {
    ls(function () { w.localStorage.removeItem('cw-super'); });
    return;
  }

  var realMeId = (function () { try { return String((w.CW && w.CW.realMe && w.CW.realMe().id) || me.id || ''); } catch (e) { return String(me.id || ''); } })();
  if (!provenSelf(realMeId)) {
    ls(function () { w.localStorage.removeItem('cw-super'); });
    return;
  }
  var whoKey = realMeId.split('.').join('').toLowerCase();
  var stamp = ls(function () { return JSON.parse(w.localStorage.getItem('cw-super-for') || 'null'); }, null);
  var mine = stamp && typeof stamp === 'object' && stamp.v === 3 && stamp.who === whoKey;
  var fresh = mine && (Date.now() - (stamp.at || 0)) < 3600000 && (stamp.yes !== true || typeof stamp.op === 'boolean');
  if (!mine) { ls(function () { w.localStorage.removeItem('cw-super'); w.localStorage.removeItem('cw-super-for'); }); }
  if (mine) { ls(function () { w.localStorage.setItem('cw-super', stamp.yes === true ? 'yes' : 'no'); }); }
  if (mine && stamp.yes === true) { superOk = true; operatorOk = stamp.op === true; drawAdminBar(); }
  if (fresh) { return; }
  fetch(GS + '?action=amISuper&appearId=' + encodeURIComponent(realMeId)
        + '&meToken=' + encodeURIComponent(String(w.localStorage.getItem('cw-token') || '')))
    .then(function (r) { return r.json(); })
    .then(function (dd) {
      if (!dd || dd.status !== 'ok') { return; }
      var yes = !!dd.isSuper;
      var opYes = yes && dd.isOperator === true;
      ls(function () { w.localStorage.setItem('cw-super', yes ? 'yes' : 'no'); w.localStorage.setItem('cw-super-for', JSON.stringify({ v: 3, who: whoKey, yes: yes, op: opYes, at: Date.now() })); });
      if (yes) { superOk = true; operatorOk = opYes; drawAdminBar(); }
      else { superOk = false; var had = d.getElementById('cw-viewas'); if (had) { had.remove(); } var hadF = d.getElementById('cw-viewas-folded'); if (hadF) { hadF.remove(); } }
    })
    .catch(function () {});
})(window, document);
