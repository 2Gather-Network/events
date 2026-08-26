/*
  Copyright 2026 DayBalancer LLC. All rights reserved.

  The code and the content here power Creating.Works, DayBalancer, Appear Network,
  and 2Gather. They are published so they can be read, audited, and dated.

  Running either as a separate offering requires a license, whether you brand it as
  ours or as your own, and whether or not money changes hands.

  hello@creating.works
*/
/*  Version: V1.00 | Date: 2026-08-26 | LAST CHANGE: first build of the shared 2Gather top bar.

    ONE FILE, EVERY PAGE. Each 2Gather page loads /nav/topbar.js and nothing else.
    Change a label, a link or the order here and every page changes with it.

    SHOWING IT: today the bar draws only when the URL carries ?topbar=1.
    Flip SHOW_EVERYWHERE to true below and it draws on every page that loads this file.
*/
(function () {
  'use strict';

  var SHOW_EVERYWHERE = false;          // <-- the one switch. true = live on every page.
  var HIDE_INSIDE_GLIDE = true;         // inside the Glide frame Glide already draws its own bar.

  // ---- the bar, in one place ------------------------------------------------
  var EVENTS   = 'https://gather.2gather.network/events.html';
  var MYEVENTS = 'https://gather.2gather.network/myevents.html';
  var MYGROUPS = 'https://gather.2gather.network/mygroups.html';
  var FINDTIME = 'https://gather.2gather.network/find-a-time.html';
  var COMMONS  = 'https://2gather.network';                        // CONFIRM: the commons page.
  var PROFILE  = 'https://creating.works/profile.html';
  var EDITME   = 'https://creating.works/profile-edit.html';
  var ACCOUNT  = 'https://creating.works/account.html';
  var APPEAR   = 'https://appear.network/dl/network';
  var ABOUT    = 'https://appear.network/dl/about';
  var SUPPORT  = 'https://appear.network/dl/support';

  // key = which tab lights up. carry = which name this destination reads the person by.
  var TABS = [
    { key: 'events', label: 'Events', url: EVENTS,   carry: 'memberCard' },
    { key: 'groups', label: 'Groups', url: MYGROUPS, carry: 'CWid' },
    { key: 'commons', label: 'Commons', url: COMMONS, carry: '' }
  ];

  var MORE = [
    { label: 'My events',        url: MYEVENTS, carry: 'memberCard' },
    { label: 'My event profile', url: PROFILE,  carry: 'CWid' },
    { label: 'My account',       url: ACCOUNT,  carry: 'CWid' },
    { label: 'Find a Time',      url: FINDTIME, carry: '' },
    { label: 'About',            url: ABOUT,    carry: '' },
    { label: 'Support',          url: SUPPORT,  carry: '' }
  ];

  // ---- who is looking -------------------------------------------------------
  // Only these names carry a person. `id` is a group id on group.html and an event
  // id on event.html, so it is never read here.
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

  // ---- which tab is open ----------------------------------------------------
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

  function a(label, url, cls) {
    return '<a role="link" tabindex="0" class="' + cls + '" data-nav="' + url +
           '" onclick="return _safeNavGo(this)">' + label + '</a>';
  }

  // ---- draw -----------------------------------------------------------------
  function draw() {
    var open = here();
    var caret = '<svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden="true"' +
                ' style="margin-left:3px;vertical-align:middle;"><path d="M1 1.5L5.5 5.5L10 1.5"' +
                ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var tabs = '';
    for (var i = 0; i < TABS.length; i++) {
      var t = TABS[i];
      tabs += a(t.label, link(t.url, t.carry), 'cwtb-tab' + (t.key === open ? ' cwtb-on' : ''));
    }
    tabs += '<span class="cwtb-tab" id="cwtb-more" role="button" tabindex="0">More' + caret + '</span>';

    var more = '';
    for (var j = 0; j < MORE.length; j++) {
      more += a(MORE[j].label, link(MORE[j].url, MORE[j].carry), 'cwtb-item');
    }

    var photo = '<a role="link" tabindex="0" class="cwtb-face" title="My profile" data-nav="' +
                link(EDITME, 'CWid') + '" onclick="return _safeNavGo(this)">' +
                (window.CW_TOPBAR_PHOTO
                  ? '<img src="' + window.CW_TOPBAR_PHOTO + '" alt="">'
                  : '<span>&#9679;</span>') + '</a>';

    var el = document.createElement('div');
    el.id = 'cw-topbar';
    el.innerHTML =
      '<div class="cwtb-bar">' +
        '<a role="link" tabindex="0" class="cwtb-mark" data-nav="' + link(EVENTS, 'memberCard') +
          '" onclick="return _safeNavGo(this)">' +
          '<span class="cwtb-glyph"><svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true">' +
          '<path d="M50 4 C56 30 70 44 96 50 C70 56 56 70 50 96 C44 70 30 56 4 50 C30 44 44 30 50 4 Z"' +
          ' fill="#E8791F"/></svg></span>' +
          '<span class="cwtb-word">2Gather</span></a>' +
        '<div class="cwtb-tabs">' + tabs + '</div>' +
        '<span class="cwtb-div"></span>' +
        a('Appear', APPEAR, 'cwtb-tab cwtb-away') +
        photo +
      '</div>' +
      '<div class="cwtb-more" id="cwtb-more-row">' + more + '</div>';

    document.body.insertBefore(el, document.body.firstChild);

    var btn = document.getElementById('cwtb-more');
    var row = document.getElementById('cwtb-more-row');
    function toggle() {
      var on = row.classList.toggle('cwtb-open');
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  }

  function style() {
    var css =
      '#cw-topbar{font-family:"DM Sans","Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}' +
      '.cwtb-bar{background:#1F699E;display:flex;align-items:center;gap:14px;padding:0 16px;height:58px;}' +
      '.cwtb-mark{display:flex;align-items:center;gap:9px;flex-shrink:0;text-decoration:none;cursor:pointer;}' +
      '.cwtb-glyph{width:28px;height:28px;border-radius:7px;background:#fff;display:flex;align-items:center;justify-content:center;}' +
      '.cwtb-word{color:#fff;font-size:18px;font-weight:800;}' +
      '.cwtb-tabs{display:flex;align-items:center;gap:4px;margin:0 auto;overflow-x:auto;' +
        'scrollbar-width:none;-ms-overflow-style:none;}' +
      '.cwtb-tabs::-webkit-scrollbar{display:none;}' +
      '.cwtb-tab{color:#fff;font-size:14.5px;font-weight:600;padding:9px 15px;border-radius:9px;' +
        'text-decoration:none;white-space:nowrap;cursor:pointer;}' +
      '.cwtb-tab:hover{background:rgba(255,255,255,.12);}' +
      '.cwtb-on{background:rgba(255,255,255,.20);box-shadow:inset 0 0 0 1px rgba(255,255,255,.45);font-weight:700;}' +
      '.cwtb-away{color:rgba(255,255,255,.78);flex-shrink:0;}' +
      '.cwtb-div{width:1px;height:22px;background:rgba(255,255,255,.28);flex-shrink:0;}' +
      '.cwtb-face{width:36px;height:36px;border-radius:50%;flex-shrink:0;overflow:hidden;cursor:pointer;' +
        'background:linear-gradient(135deg,#7DD3FC,#1F699E);color:#fff;display:flex;align-items:center;' +
        'justify-content:center;box-shadow:0 0 0 2px rgba(255,255,255,.55);text-decoration:none;}' +
      '.cwtb-face img{width:100%;height:100%;object-fit:cover;}' +
      '.cwtb-more{display:none;background:#1F699E;border-top:1px solid rgba(255,255,255,.18);padding:4px 12px 10px;' +
        'flex-wrap:wrap;gap:4px;}' +
      '.cwtb-more.cwtb-open{display:flex;}' +
      '.cwtb-item{color:#fff;font-size:14px;font-weight:600;padding:8px 14px;border-radius:9px;' +
        'text-decoration:none;cursor:pointer;white-space:nowrap;}' +
      '.cwtb-item:hover{background:rgba(255,255,255,.14);}' +
      '@media(max-width:700px){.cwtb-bar{gap:8px;padding:0 10px;height:54px;}' +
        '.cwtb-word{display:none;}.cwtb-tabs{margin:0;}.cwtb-tab{padding:8px 11px;font-size:13.5px;}}';
    var s = document.createElement('style');
    s.id = 'cw-topbar-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function asked() {
    try { return new URLSearchParams(window.location.search).get('topbar') === '1'; }
    catch (e) { return false; }
  }

  function go() {
    if (document.getElementById('cw-topbar')) return;
    var framed = false;
    try { framed = (window.self !== window.top); } catch (e) { framed = true; }
    if (!asked()) {
      if (!SHOW_EVERYWHERE) return;
      if (framed && HIDE_INSIDE_GLIDE) return;
    }
    style();
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else { go(); }
})();
