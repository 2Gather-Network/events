/*
  Copyright 2026 DayBalancer LLC. All rights reserved.

  The code and the content here power Creating.Works, DayBalancer, Appear Network,
  and 2Gather. They are published so they can be read, audited, and dated.

  Running either as a separate offering requires a license, whether you brand it as
  ours or as your own, and whether or not money changes hands.

  hello@creating.works
*/
/*  Version: V3.11 | Date: 2026-08-26 | LAST CHANGE: only the tab you opened stays lit.

    ONE FILE, EVERY PAGE. Each 2Gather page loads /nav/topbar.js and nothing else.
    Change a label, a link or the order here and every page changes with it.

    The rule the bar follows: a tab names a place, and its menu is what you do there.
    ?topbar=0 hides the bar on a page, for when something needs looking at without it.
*/
(function () {
  'use strict';

  var SHOW_EVERYWHERE   = true;   // the bar draws on every page that loads this file
  var HIDE_INSIDE_GLIDE = true;   // inside the Glide frame Glide already draws its own bar

  // ---- addresses, all of them, in one place ---------------------------------
  var LOGO     = 'https://gather.2gather.network/images/2gather_logo.png';
  var EVENTS   = 'https://gather.2gather.network/events.html';
  var MYEVENTS = 'https://gather.2gather.network/myevents.html';
  var POST     = 'https://gather.2gather.network/events.html?action=post';
  var MYGROUPS = 'https://gather.2gather.network/mygroups.html';
  var START    = 'https://gather.2gather.network/groups/create.html';
  var JOIN     = 'https://gather.2gather.network/mygroups.html?join=1';
  var FINDTIME = 'https://gather.2gather.network/find-a-time.html';
  var COMMONS  = 'https://events.2gather.network/events/yvrgej/zkxbzq';   // The Commons room
  var PROFILE  = 'https://creating.works/profile.html';
  var EDITME   = 'https://creating.works/profile-edit.html';
  var ACCOUNT  = 'https://creating.works/account.html';
  var ABOUT    = 'https://2gather.network/dl/about';      // until 2gather.network/about.html exists
  var SUPPORT  = 'https://2gather.network/dl/support';    // until 2gather.network/support.html exists

  // carry says which name that destination reads the person by.
  var NAV = [
    { key: 'events', label: 'Events', items: [
      { label: 'Calendar of events', url: EVENTS,   carry: 'memberCard' },
      { label: 'My events',          url: MYEVENTS, carry: 'memberCard' },
      { label: 'Post an event',      url: POST,     carry: 'memberCard' },
      { label: 'My event profile',   url: PROFILE,  carry: 'CWid' }
    ]},
    { key: 'groups', label: 'Groups', items: [
      { label: 'My groups',    url: MYGROUPS, carry: 'CWid' },
      { label: 'Start a group', url: START,   carry: 'CWid' },
      { label: 'Join a group',  url: JOIN,    carry: 'CWid' }
    ]},
    { key: 'commons', label: 'Commons', url: COMMONS },
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
  function me() {
    try {
      var p = new URLSearchParams(window.location.search);
      return String(p.get('CWid') || p.get('memberCard') || p.get('me') || p.get('appearId') || '').trim();
    } catch (e) { return ''; }
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

    var photo = '<a role="link" tabindex="0" class="cwtb-face" title="My profile" data-nav="' +
                link(EDITME, 'CWid') + '" onclick="return _safeNavGo(this)">' +
                (window.CW_TOPBAR_PHOTO ? '<img src="' + window.CW_TOPBAR_PHOTO + '" alt="">' : '') + '</a>';

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
      '.cwtb-row{display:none;position:absolute;min-width:236px;background:#fff;border-radius:14px;' +
        'padding:10px 0;box-shadow:0 14px 34px rgba(15,45,70,.28);z-index:20;}' +
      '.cwtb-row.cwtb-open{display:block;}' +
      '.cwtb-item{display:block;padding:13px 22px;font-size:16px;font-weight:500;color:#1A2E42;' +
        'text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-item:hover{background:#F7FBFF;}' +
      '.cwtb-lit{background:rgba(255,255,255,.20);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);}' +
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
    var face = document.querySelector('#cw-topbar .cwtb-face');
    if (!face) return true;

    var pill = document.getElementById('gp-myprofile-pill');
    if (pill) { pill.style.display = 'none'; }

    var src = window.CW_TOPBAR_PHOTO || '';
    if (!src) {
      var img = document.querySelector('#gp-myprofile-avatar img, #gp-myprofile-pill img, .cw-me-photo img');
      if (img && img.getAttribute('src')) { src = img.getAttribute('src'); }
    }
    if (src) { face.innerHTML = '<img src="' + src + '" alt="">'; return true; }
    return false;
  }

  function watchForPhoto() {
    if (adopt()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (adopt() || tries > 40) { clearInterval(t); }
    }, 400);
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
    if (document.getElementById('cw-topbar') || hidden() || !SHOW_EVERYWHERE) return;
    var framed = false;
    try { framed = (window.self !== window.top); } catch (e) { framed = true; }
    if (framed && HIDE_INSIDE_GLIDE) return;
    style();
    draw();
    watchForPhoto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else { go(); }
})();
