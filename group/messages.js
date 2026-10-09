(function () {
  var API = 'https://cw-messages.jessieupp.workers.dev';
  var devAs = '';
  try {
    var qs = new URLSearchParams(location.search);
    if (location.hostname === 'localhost' && qs.get('msgapi') === 'local') { API = 'http://localhost:8788'; devAs = qs.get('devAs') || ''; }
  } catch (e) {}

  var ctx = null, box = null, session = '', me = '', poll = null, openId = '';
  var enterSends = true;

  function typing(ta, send) {
    ta.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' || ev.shiftKey || ev.isComposing || enterSends !== true) return;
      ev.preventDefault();
      send.click();
    });
  }
  function choiceCard() {
    return null;
    var c = el('div', 'border:1.5px solid #C9DFF3;background:#F7FBFF;border-radius:14px;padding:12px 14px;margin:0 0 12px;');
    c.appendChild(el('div', 'font-size:15px;font-weight:800;color:#1A2E42;margin-bottom:4px;', 'What should Enter do when you write a message?'));
    var row = el('div', 'display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;');
    var done = el('div', 'font-size:13px;color:#4B5A6D;line-height:1.45;');
    [[true, 'Enter sends', 'Shift and Enter start a new line'], [false, 'Enter starts a new line', 'use the Send button to send']].forEach(function (o) {
      var b = btn(o[1], o[0] ? '' : 'ghost');
      b.title = o[2];
      b.onclick = function () {
        b.disabled = true;
        api('/prefs', { body: { enterSends: o[0] } }).then(function (d) {
          if (!d || d.status !== 'ok') { b.disabled = false; done.textContent = 'That did not save. Try again.'; return; }
          enterSends = o[0];
          c.innerHTML = '';
          c.appendChild(el('div', 'font-size:14px;color:#1E6B3A;font-weight:700;', 'Saved. You can change this any time in your Group settings.'));
          setTimeout(function () { if (c.parentNode) c.remove(); }, 6000);
        }).catch(function () { b.disabled = false; done.textContent = 'That did not reach the server. Try again.'; });
      };
      row.appendChild(b);
    });
    done.textContent = 'Enter sends: Shift and Enter start a new line. Enter starts a new line: you use the Send button. You can change it later in Group settings.';
    c.appendChild(row); c.appendChild(done);
    return c;
  }

  function el(tag, style, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }
  function btn(label, kind) {
    var b = el('button', 'font:inherit;font-size:14px;font-weight:700;border-radius:22px;padding:8px 18px;cursor:pointer;border:1.5px solid #1F699E;'
      + (kind === 'ghost' ? 'background:#fff;color:#1F699E;' : kind === 'quiet' ? 'background:#fff;color:#4B5A6D;border-color:#DDE4EE;' : 'background:#1F699E;color:#fff;'), label);
    b.type = 'button';
    return b;
  }
  function smallPill(b) {
    b.style.fontSize = '12.5px';
    b.style.padding = '3px 10px';
    b.style.border = '1.5px solid ' + (b.style.borderColor || '#B5D3EA');
    b.style.lineHeight = '1.4';
    b.style.height = '26px'; b.style.boxSizing = 'border-box'; b.style.display = 'inline-flex'; b.style.alignItems = 'center';
    return b;
  }
  function gatherLink() {
    var a = el('a', 'display:inline-flex;align-items:center;gap:7px;background:#1F699E;color:#fff;font-size:14px;font-weight:700;padding:9px 18px;border-radius:22px;text-decoration:none;margin-left:auto;flex-shrink:0;white-space:nowrap;order:99;', '');
    var ic = el('span', 'font-size:14px;line-height:1;', '\u2600\uFE0E');
    ic.setAttribute('aria-hidden', 'true');
    a.appendChild(ic);
    a.appendChild(document.createTextNode(' Gather'));
    a.href = 'https://2gather.network/commons/';
    a.style.fontSize = '12.5px'; a.style.padding = '3px 10px'; a.style.lineHeight = '1.4'; a.style.gap = '5px'; a.style.height = '26px'; a.style.boxSizing = 'border-box'; a.style.border = '1.5px solid #1F699E';
    return a;
  }
  var SCROLL_TEST = false;
  try { SCROLL_TEST = new URLSearchParams(location.search).get('scroll') === '1'; } catch (e) {}
  function scrollKit(box) {
    if (!SCROLL_TEST || !box.parentNode) return null;
    box.style.maxHeight = 'none';
    box.style.height = 'calc(100dvh - 340px)';
    box.style.minHeight = '240px';
    box.style.overscrollBehavior = 'contain';
    box.style.overflowAnchor = 'none';
    box.style.webkitOverflowScrolling = 'touch';
    var wrap = el('div', 'position:relative;');
    box.parentNode.insertBefore(wrap, box);
    wrap.appendChild(box);
    var pill = el('button', 'position:absolute;left:50%;bottom:12px;transform:translateX(-50%);display:none;font:inherit;font-size:13.5px;font-weight:700;background:#1F699E;color:#fff;border:0;border-radius:20px;padding:7px 16px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.22);', 'Latest messages');
    pill.type = 'button';
    wrap.appendChild(pill);
    var kit = {
      near: function () { return box.scrollHeight - box.scrollTop - box.clientHeight < 80; },
      bottom: function () { box.scrollTop = box.scrollHeight; pill.style.display = 'none'; },
      pill: function () { pill.style.display = 'block'; }
    };
    pill.onclick = function () { kit.bottom(); };
    box.addEventListener('scroll', function () { if (kit.near()) pill.style.display = 'none'; }, { passive: true });
    box.addEventListener('load', function () { if (box._stuck) kit.bottom(); }, true);
    try {
      if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { if (kit.near() || box._stuck) kit.bottom(); });
    } catch (e) {}
    return kit;
  }
  function photoCircle(src, size) {
    var c = el('div', 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;flex:none;overflow:hidden;background:linear-gradient(135deg,#C9DFF3,#7FB6E2);');
    if (src && String(src).indexOf('https://cw-photos.jessieupp.workers.dev/') === 0) {
      var im = document.createElement('img');
      im.alt = ''; im.width = size; im.height = size; im.loading = 'lazy';
      im.setAttribute('style', 'width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;display:block;');
      im.onerror = function () { if (im.parentNode) im.parentNode.removeChild(im); };
      c.appendChild(im); im.src = src;
    }
    return c;
  }
  function waitPill(text) {
    var p = document.createElement('span');
    p.className = 'cw-loading';
    p.textContent = text;
    return p;
  }
  function say(where, text, bad) {
    where.textContent = text || '';
    where.style.color = bad ? '#7A2410' : '#1E6B3A';
  }
  function when(at) {
    try {
      var d = new Date(at), now = new Date();
      if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) { return ''; }
  }
  function skey() { return 'cw-msg-session-' + String(ctx.meId || ''); }
  function keptSession() {
    try {
      var s = sessionStorage.getItem(skey()) || '';
      var exp = parseInt(s.split('.')[1] || '0', 10);
      if (s && exp > Date.now() + 60000) return s;
    } catch (e) {}
    return '';
  }
  function api(path, opts) {
    opts = opts || {};
    var h = { 'Content-Type': 'application/json' };
    if (session) h['x-msg-session'] = session;
    return fetch(API + path, { method: opts.body ? 'POST' : 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) { return r.json().then(function (d) { d._http = r.status; return d; }); });
  }
  function token() { return devAs || (ctx.token ? ctx.token() : ''); }
  function start() {
    session = keptSession();
    if (session) { me = session.split('.')[0]; return Promise.resolve(true); }
    return api('/session', { body: { id: ctx.meId, token: token() } }).then(function (d) {
      if (!d || d.status !== 'ok') return false;
      session = d.session; me = d.me;
      try { sessionStorage.setItem(skey(), session); } catch (e) {}
      return true;
    });
  }
  function again(d) {
    if (d && d._http === 401 && d.code === 'session') {
      try { sessionStorage.removeItem(skey()); } catch (e) {}
      session = '';
      return true;
    }
    return false;
  }

  function people() {
    var g = ctx.group() || {}, list = ctx.people() || [];
    var hosts = {};
    [].concat(g.hostCodes || [], g.coHostCodes || []).forEach(function (c) { if (c) hosts[String(c)] = 1; });
    var out = [];
    list.forEach(function (p) {
      var c = String(p.code || '');
      if (!c || c === me) return;
      var isHost = !!hosts[c];
      if (!isHost && !g.memberMessaging && !ctx.iHost()) return;
      out.push({ code: c, name: p.name || p.first || 'Someone', host: isHost });
    });
    out.sort(function (a, b) { return (b.host - a.host) || a.name.localeCompare(b.name); });
    return out;
  }

  function frame(title) {
    box.innerHTML = '';
    var head = el('div', 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px;');
    if (title === 'Messages') {
      head.appendChild(el('div', 'font-size:17px;font-weight:800;color:#1A2E42;', title));
      head.appendChild(gatherLink());
    } else head.appendChild(el('div', 'font-size:17px;font-weight:800;color:#1A2E42;', title));
    box.appendChild(head);
    return head;
  }

  function drawList() {
    stopPoll();
    openId = '';
    var head = frame('Messages');
    var ppl = people();
    if (ppl.length) {
      var nb = btn(ppl.length === 1 || ppl.every(function (p) { return p.host; }) ? 'Message the host' : 'New message');
      smallPill(nb);
      nb.onclick = function () { drawNew(); };
      head.appendChild(nb);
    }
    var list = el('div', 'display:flex;flex-direction:column;gap:0;');
    var wait = el('div', 'font-size:14px;color:#4B5A6D;', 'Looking for your messages…');
    box.appendChild(wait);
    box.appendChild(list);
    api('/threads').then(function (d) {
      if (again(d)) return start().then(drawList);
      if (!d || d.status !== 'ok') { say(wait, 'Your messages did not load. Reload the page to try again.', true); return; }
      wait.remove();
      var ts = d.threads || [];
      tile(ts.reduce(function (n, t) { return n + (t.unread || 0); }, 0));
      if (!ts.length) {
        list.appendChild(el('div', 'font-size:14px;color:#4B5A6D;line-height:1.5;', 'No messages yet.'
          + (ppl.length ? ' Start one above.' : '')));
        return;
      }
      list.style.gap = '10px';
      ts.forEach(function (t) {
        var asking = t.status === 'request' && !t.iStarted;
        var base = 'display:flex;gap:14px;align-items:center;padding:14px 16px;border:1.5px solid #DDE4EE;border-radius:14px;background:#fff;cursor:pointer;transition:border-color .12s,background .12s,box-shadow .12s;';
        var row = el('div', base + (t.unread ? 'border-color:#B5D3EA;background:#F7FBFF;' : ''));
        row.setAttribute('role', 'button'); row.tabIndex = 0;
        var on = function () { row.style.borderColor = '#1F699E'; row.style.background = '#F7FBFF'; row.style.boxShadow = '0 2px 10px rgba(31,105,158,.14)'; };
        var off = function () { row.style.borderColor = t.unread ? '#B5D3EA' : '#DDE4EE'; row.style.background = t.unread ? '#F7FBFF' : '#fff'; row.style.boxShadow = 'none'; };
        row.addEventListener('mouseenter', on); row.addEventListener('mouseleave', off);
        row.addEventListener('focus', on); row.addEventListener('blur', off);
        var nm = t.other.name || 'Someone';
        row.appendChild(photoCircle(t.other.photo, 44));
        var txt = el('div', 'flex:1;min-width:0;');
        var top = el('div', 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;');
        top.appendChild(el('b', 'font-size:16px;color:#1A2E42;' + (t.unread ? '' : 'font-weight:700;'), nm));
        if (t.last) top.appendChild(el('span', 'font-size:12.5px;color:#6B7A8D;margin-left:auto;', when(t.last.at)));
        txt.appendChild(top);
        var line = asking ? 'Wants to message you' : (t.status === 'request' ? 'Waiting for them to accept' : (t.status === 'pending' ? 'Delivering\u2026' : (t.status === 'refused' ? 'Did not go through' : (t.status === 'closed' ? 'Closed' : ''))));
        var prev = t.last ? (t.last.mine ? 'You: ' : '') + t.last.body : '';
        txt.appendChild(el('div', 'font-size:14px;margin-top:2px;color:' + (t.unread ? '#1A2E42' : '#4B5A6D') + ';font-weight:' + (t.unread ? '700' : '400') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', line ? line + (prev && asking ? ': ' + prev : '') : prev));
        row.appendChild(txt);
        if (t.unread) row.appendChild(el('span', 'min-width:22px;height:22px;border-radius:11px;background:#1F699E;color:#fff;font-size:12px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;padding:0 6px;flex:none;', String(t.unread > 99 ? '99+' : t.unread)));
        row.appendChild(el('span', 'font-size:22px;line-height:1;color:#7FB6E2;flex:none;', '\u203a'));
        var openIt = function () { drawThread(t.id); };
        row.onclick = openIt;
        row.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openIt(); } });
        list.appendChild(row);
      });
    }).catch(function () { say(wait, 'Your messages did not load. Reload the page to try again.', true); });
  }

  function drawNew(pick) {
    stopPoll();
    var head = frame('New message');
    var back = smallPill(btn('All messages', 'quiet'));
    back.onclick = drawList;
    head.appendChild(back);
    var ppl = people();
    var lab = el('div', 'font-size:16px;font-weight:700;color:#1A2E42;margin:4px 0 6px;', 'To');
    box.appendChild(lab);
    var chosen = null;
    var field = el('div', 'position:relative;');
    var inp = el('input', 'width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:10px 14px;border:1.5px solid #DDE4EE;border-radius:12px;background:#fff;color:#1A2E42;');
    inp.type = 'text'; inp.id = 'msg-to'; inp.placeholder = 'Type a name'; inp.autocomplete = 'off';
    var chip = el('div', 'display:none;align-items:center;gap:8px;padding:8px 14px;border:1.5px solid #1F699E;background:#E6F1FB;border-radius:12px;font-size:15px;font-weight:700;color:#1A2E42;');
    var list = el('div', 'display:none;position:absolute;left:0;right:0;top:100%;margin-top:4px;background:#fff;border:1.5px solid #DDE4EE;border-radius:12px;box-shadow:0 6px 18px rgba(26,46,66,.12);max-height:240px;overflow:auto;z-index:5;');
    field.appendChild(inp); field.appendChild(chip); field.appendChild(list);
    box.appendChild(field);
    function choose(p) {
      chosen = p; inp.style.display = 'none'; list.style.display = 'none';
      chip.style.display = 'flex'; chip.innerHTML = '';
      chip.appendChild(el('span', 'flex:1;', p.name + (p.host ? ' (host)' : '')));
      var x = el('button', 'font:inherit;font-size:14px;font-weight:700;border:0;background:none;color:#1F699E;cursor:pointer;', 'Change');
      x.type = 'button';
      x.onclick = function () { chosen = null; chip.style.display = 'none'; inp.style.display = ''; inp.value = ''; inp.focus(); };
      chip.appendChild(x);
      try { api('/precheck', { body: { id: ctx.meId, token: token(), to: p.code } }).catch(function () {}); } catch (e) {}
      setTimeout(function () { if (ta) ta.focus(); }, 0);
    }
    function suggest() {
      var q = inp.value.trim().toLowerCase();
      list.innerHTML = '';
      if (!q) { list.style.display = 'none'; return; }
      var hits = ppl.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1; }).slice(0, 8);
      if (!hits.length) {
        list.appendChild(el('div', 'padding:10px 14px;font-size:14px;color:#6B7A8D;', 'No one in this group matches that name.'));
      } else {
        hits.forEach(function (p) {
          var r = el('div', 'padding:10px 14px;font-size:15px;color:#1A2E42;cursor:pointer;', p.name + (p.host ? ' (host)' : ''));
          r.onmousedown = function (ev) { ev.preventDefault(); choose(p); };
          r.ontouchstart = function () { choose(p); };
          list.appendChild(r);
        });
      }
      list.style.display = 'block';
    }
    inp.addEventListener('input', suggest);
    inp.addEventListener('blur', function () { setTimeout(function () { list.style.display = 'none'; }, 150); });
    var exact = pick && ppl.filter(function (p) { return p.code === pick; })[0];
    if (exact) choose(exact);
    else if (pick) {
      field.style.display = 'none'; lab.style.display = 'none';
      var wp = el('div', 'margin:6px 0 12px;');
      wp.appendChild(waitPill('Opening your conversation\u2026'));
      box.insertBefore(wp, field);
      api('/who', { body: { id: ctx.meId, token: token(), to: pick } }).then(function (d) {
        if (again(d)) return start().then(function () { drawNew(pick); });
        wp.remove();
        if (d && d.status === 'ok' && d.allowed && d.threadId) { drawThread(d.threadId); return; }
        field.style.display = ''; lab.style.display = '';
        if (d && d.status === 'ok' && d.allowed && d.name) { choose({ code: d.code || pick, name: d.name, host: d.role === 'host' || d.role === 'cohost' }); }
        else say(note, 'You can message people you share a group with who are taking messages.', true);
      }).catch(function () { wp.remove(); field.style.display = ''; lab.style.display = ''; say(note, 'That did not load. Reload the page to try again.', true); });
    }
    var ta = el('textarea', 'width:100%;box-sizing:border-box;margin-top:12px;font:inherit;font-size:15px;color:#1A2E42;border:1.5px solid #DDE4EE;border-radius:12px;padding:10px 12px;min-height:110px;resize:vertical;');
    ta.placeholder = 'Say hello, and what you would like to talk about';
    ta.maxLength = 2000;
    var pick2 = choiceCard();
    if (pick2) box.appendChild(pick2);
    box.appendChild(ta);
    box.appendChild(el('div', 'font-size:13px;color:#6B7A8D;margin-top:6px;line-height:1.45;', 'They see it as a request first and choose whether to reply. A host sees it straight away.'));
    var bar = el('div', 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;');
    var send = btn('Send');
    typing(ta, send);
    var note = el('span', 'font-size:14px;font-weight:700;');
    bar.appendChild(send); bar.appendChild(note);
    box.appendChild(bar);
    send.onclick = function () {
      var text = ta.value.trim();
      if (!chosen) {
        var q = inp.value.trim().toLowerCase();
        var one = q ? ppl.filter(function (p) { return p.name.toLowerCase() === q; }) : [];
        if (one.length === 1) choose(one[0]); else { say(note, 'Pick who it is for first.', true); inp.focus(); return; }
      }
      if (!text) { say(note, 'Write something first.', true); return; }
      send.disabled = true; say(note, '');
      var slow = setTimeout(function () { say(note, 'Still sending. The first message can take up to a minute.'); }, 12000);
      api('/start', { body: { id: ctx.meId, token: token(), to: chosen.code, body: text } }).then(function (d) {
        clearTimeout(slow);
        send.disabled = false;
        if (again(d)) { return start().then(function () { send.onclick(); }); }
        if (!d || d.status !== 'ok') { say(note, (d && d.message) || 'That did not go through. Try again in a moment.', true); return; }
        if (!d.sent) { say(note, d.message || 'That did not go through.', true); return; }
        drawThread(d.threadId);
      }).catch(function () { clearTimeout(slow); send.disabled = false; say(note, 'That did not reach the server. Try again in a moment.', true); });
    };
    (exact ? ta : inp).focus();
  }

  function drawThread(id) {
    openId = id;
    try { api('/warm', { body: { threadId: id, id: ctx.meId, token: token() } }).catch(function () {}); } catch (e) {}
    var head = frame('Messages');
    var back = smallPill(btn('All messages', 'quiet'));
    back.onclick = drawList;
    head.appendChild(back);
    var curName = '', curDrawn = '', sharedLoaded = false;
    var sub = el('div', 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:15px;color:#1A2E42;margin:0;', '');
    if (head.firstChild) head.removeChild(head.firstChild);
    head.insertBefore(sub, head.firstChild);
    var rightSide = el('div', 'display:flex;align-items:center;gap:10px;flex:none;');
    var gl = null;
    Array.prototype.slice.call(head.children).forEach(function (c) { if (c !== sub && c !== back) gl = c; });
    rightSide.appendChild(back);
    if (gl) { gl.style.marginLeft = '0'; gl.style.order = '0'; rightSide.appendChild(gl); }
    head.appendChild(rightSide);
    var groupsList = el('div', 'display:none;border:1.5px solid #C9DFF3;background:#F7FBFF;border-radius:12px;padding:10px 14px;margin-bottom:12px;');
    box.appendChild(groupsList);
    function drawSub(t) {
      sub.innerHTML = '';
      var nm = (t.other && t.other.name) || 'Someone';
      var code = (t.other && t.other.code) || '';
      if (code) {
        var a = el('a', 'font-size:12.5px;font-weight:700;color:#1F699E;text-decoration:underline;cursor:pointer;', nm);
        a.href = 'https://2gather.network/me/?v=' + encodeURIComponent(code);
        sub.appendChild(a);
      } else sub.appendChild(el('b', 'font-size:12.5px;', nm));
      if (code) {
        var gp = el('button', 'font:inherit;font-size:12.5px;font-weight:700;color:#1F699E;background:#fff;border:1.5px solid #B5D3EA;border-radius:22px;padding:3px 10px;height:26px;box-sizing:border-box;display:inline-flex;align-items:center;line-height:1.4;cursor:pointer;', 'Shared groups');
        gp.type = 'button';
        gp.onclick = function () {
          if (groupsList.style.display !== 'none') { groupsList.style.display = 'none'; return; }
          groupsList.style.display = '';
          if (sharedLoaded) return;
          groupsList.textContent = 'Looking for your shared groups…';
          api('/shared', { body: { id: ctx.meId, token: token(), to: code } })
            .then(function (d) {
              if (again(d)) return start().then(function () { sharedLoaded = false; groupsList.style.display = 'none'; });
              groupsList.innerHTML = '';
              var gl = (d && d.groups) || [];
              if (!gl.length) { groupsList.textContent = 'No shared groups to show.'; return; }
              sharedLoaded = true;
              groupsList.appendChild(el('div', 'font-size:12px;font-weight:800;color:#4B5A6D;letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px;', 'Groups you share with ' + nm));
              gl.forEach(function (g) {
                var ga = el('a', 'display:block;font-size:14.5px;font-weight:700;color:#1F699E;text-decoration:none;padding:4px 0;cursor:pointer;', g.name || 'Group');
                ga.href = g.slug ? 'https://2gather.network/group/' + encodeURIComponent(String(g.slug).split(',')[0].trim()) : 'https://2gather.network/group/?id=' + encodeURIComponent(g.id || '');
                groupsList.appendChild(ga);
              });
            }).catch(function () { groupsList.textContent = 'That did not load. Try again in a moment.'; });
        };
        sub.appendChild(gp);
      }
    }
    var asks = el('div', '');
    box.appendChild(asks);
    var msgs = el('div', 'display:flex;flex-direction:column;max-height:460px;overflow:auto;padding-right:4px;min-height:80px;');
    box.appendChild(msgs);
    var sk = scrollKit(msgs);
    var bar = el('div', 'display:flex;gap:8px;margin-top:14px;align-items:flex-end;');
    var ta = el('textarea', 'flex:1;min-width:0;font:inherit;font-size:15px;color:#1A2E42;border:1.5px solid #DDE4EE;border-radius:18px;padding:9px 14px;min-height:42px;resize:vertical;');
    ta.placeholder = 'Write a reply';
    ta.maxLength = 2000;
    var send = btn('Send');
    typing(ta, send);
    var pick1 = choiceCard();
    if (pick1) box.appendChild(pick1);
    bar.appendChild(ta); bar.appendChild(send);
    if (SCROLL_TEST) {
      bar.style.flexDirection = 'column'; bar.style.alignItems = 'stretch';
      ta.style.flex = 'none'; ta.style.width = '100%'; ta.style.boxSizing = 'border-box'; ta.style.minHeight = '112px'; ta.style.fontSize = '16px';
      send.style.alignSelf = 'flex-end';
    }
    box.appendChild(bar);
    var note = el('div', 'font-size:14px;font-weight:700;margin-top:6px;');
    box.appendChild(note);
    var seen = '';
    function load(first) {
      return api('/thread?id=' + encodeURIComponent(id)).then(function (d) {
        if (openId !== id) return;
        if (again(d)) return start().then(function () { return load(first); });
        if (!d || d.status !== 'ok') { if (first) say(sub, (d && d.message) || 'This conversation did not load.', true); return; }
        var t = d.thread;
        var drawKey = ((t.other && t.other.code) || '') + '|' + ((t.other && t.other.name) || '') + '|' + ((t.other && t.other.role) || '');
        curName = (t.other && t.other.name) || '';
        if (drawKey !== curDrawn) { curDrawn = drawKey; drawSub(t); }
        asks.innerHTML = '';
        var asking = t.status === 'request' && !t.iStarted;
        if (asking) {
          var a = el('div', 'border:1.5px solid #C9DFF3;background:#F7FBFF;border-radius:14px;padding:12px 14px;margin-bottom:12px;');
          a.appendChild(el('div', 'font-size:14.5px;color:#1A2E42;margin-bottom:8px;', (t.other.name || 'Someone') + ' from ' + (t.groupName || 'this group') + ' wants to message you.'));
          var row = el('div', 'display:flex;gap:8px;flex-wrap:wrap;');
          [['Accept', '', 'accept'], ['Decline', 'ghost', 'decline'], ['Mute', 'quiet', 'block']].forEach(function (x) {
            var b = btn(x[0], x[1]);
            b.onclick = function () {
              b.disabled = true;
              api('/respond', { body: { threadId: id, action: x[2] } }).then(function (r) {
                if (!r || r.status !== 'ok') { b.disabled = false; say(note, (r && r.message) || 'That did not go through.', true); return; }
                if (x[2] === 'accept') load(false); else drawList();
              });
            };
            row.appendChild(b);
          });
          a.appendChild(row);
          a.appendChild(el('div', 'font-size:12.5px;color:#6B7A8D;margin-top:8px;line-height:1.45;', 'Decline is quiet: they are not told why. Mute stops them messaging you in any group. You can unmute them in your Settings.'));
          asks.appendChild(a);
        }
        var waiting = t.status === 'request' && t.iStarted;
        var closed = t.status === 'closed';
        var refused = t.status === 'refused';
        var delivering = t.status === 'pending';
        bar.style.display = (waiting || closed || refused) ? 'none' : 'flex';
        if (waiting) say(note, 'Sent. Waiting for ' + (t.other.name || 'them') + ' to accept.');
        else if (delivering) say(note, 'Sent. Delivering\u2026');
        else if (refused) say(note, 'This did not go through. Not taking messages through this group right now.', true);
        else if (closed) say(note, 'This conversation is closed.', true);
        else if (note.textContent.indexOf('Waiting') === 0) say(note, '');
        var photoKey = d.messages.length + '|' + (t.myPhoto || '') + '|' + ((t.other && t.other.photo) || '');
        if (photoKey === seen) return;
        seen = photoKey;
        var firstDraw = !msgs.firstChild;
        var wasNear = sk ? sk.near() : true;
        var lastMine = d.messages.length && d.messages[d.messages.length - 1].mine;
        var keepTop = msgs.scrollTop;
        msgs.innerHTML = '';
        var otherName = (t.other && t.other.name) || 'Someone';
        d.messages.forEach(function (m) {
          var row = el('div', 'display:flex;gap:10px;align-items:flex-start;padding:6px 0;');
          var nameShown = m.mine ? 'You' : otherName;
          row.appendChild(photoCircle(m.mine ? t.myPhoto : (t.other && t.other.photo), 32));
          var mb = el('div', 'min-width:0;flex:1;');
          var who = el('div', 'font-size:13.5px;font-weight:800;color:#1A2E42;', nameShown);
          who.appendChild(el('span', 'font-weight:600;color:#6B7A8D;margin-left:6px;font-size:12.5px;', when(m.at)));
          mb.appendChild(who);
          mb.appendChild(el('div', 'font-size:14.5px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;margin-top:2px;color:#1A2E42;', m.body));
          row.appendChild(mb);
          row.title = new Date(m.at).toLocaleString();
          msgs.appendChild(row);
        });
        if (sk) {
          if (firstDraw || wasNear || lastMine) { sk.bottom(); msgs._stuck = true; }
          else { msgs.scrollTop = keepTop; msgs._stuck = false; sk.pill(); }
        } else msgs.scrollTop = msgs.scrollHeight;
        if (!first) return;
        tileRefresh();
      }).catch(function () { if (first) say(sub, 'This conversation did not load. Reload the page to try again.', true); });
    }
    send.onclick = function () {
      var text = ta.value.trim();
      if (!text) return;
      send.disabled = true; ta.readOnly = true;
      say(note, '');
      var slow = setTimeout(function () { say(note, 'Still sending. The first reply in a while can take up to a minute.'); }, 6000);
      api('/reply', { body: { threadId: id, body: text, id: ctx.meId, token: token() } }).then(function (d) {
        clearTimeout(slow); ta.readOnly = false;
        send.disabled = false;
        if (!d || d.status !== 'ok') { say(note, (d && d.message) || 'That did not go through.', true); return; }
        if (!d.sent) { say(note, d.message || 'That did not go through.', true); return; }
        ta.value = ''; say(note, '');
        load(false);
      }).catch(function () { clearTimeout(slow); ta.readOnly = false; send.disabled = false; say(note, 'That did not reach the server. Try again in a moment.', true); });
    };
    load(true);
    stopPoll();
    poll = setInterval(function () { if (!document.hidden && openId === id) load(false); }, 30000);
    var quick = setInterval(function () { if (openId !== id) { clearInterval(quick); return; } if (note.textContent.indexOf('Delivering') > -1) load(false); else clearInterval(quick); }, 4000);
  }
  function stopPoll() { if (poll) { clearInterval(poll); poll = null; } }

  function tile(n) {
    var s = document.getElementById('gp-tile-msg-sub');
    if (s) s.textContent = n ? (n === 1 ? '1 new message' : n + ' new messages') : 'No new messages';
  }
  function tileRefresh() {
    if (!session) return;
    api('/unread').then(function (d) { if (d && d.status === 'ok') tile(d.unread); }).catch(function () {});
  }

  try {
    if (window.CW && typeof CW.forget === 'function' && !CW.forget._msg) {
      var f = CW.forget;
      CW.forget = function () {
        try { Object.keys(sessionStorage).forEach(function (k) { if (k.indexOf('cw-msg-session-') === 0) sessionStorage.removeItem(k); }); } catch (e) {}
        return f.apply(this, arguments);
      };
      CW.forget._msg = 1;
    }
  } catch (e) {}

  var chat = { box: null, poll: null, last: 0, first: 0, role: '', ctx: null, open: false };
  function chatGroupId() { return chat.ctx ? String(chat.ctx.groupId || '') : ''; }
  function chatTime(at) { return when(at); }
  function chatRow(m) {
    var isHost = chat.role === 'host' || chat.role === 'cohost';
    var row = el('div', 'display:flex;gap:10px;align-items:flex-start;padding:6px 0;');
    row.setAttribute('data-mid', String(m.id));
    var av = el('div', 'width:32px;height:32px;border-radius:50%;flex:none;background:' + (m.removed ? '#E7ECF2' : 'linear-gradient(135deg,#C9DFF3,#7FB6E2)') + ';');
    if (!m.removed && m.photo && String(m.photo).indexOf('https://cw-photos.jessieupp.workers.dev/') === 0) {
      var im = document.createElement('img');
      im.alt = ''; im.width = 32; im.height = 32; im.loading = 'lazy';
      im.setAttribute('style', 'width:32px;height:32px;border-radius:50%;object-fit:cover;display:block;');
      im.onerror = function () { if (im.parentNode) im.parentNode.removeChild(im); };
      av.appendChild(im); im.src = m.photo;
      av.style.overflow = 'hidden';
    }
    var mb = el('div', 'min-width:0;flex:1;');
    var who = el('div', 'font-size:13.5px;font-weight:800;color:' + (m.removed ? '#6B7A8D' : '#1A2E42') + ';');
    who.textContent = m.removed ? 'Removed by ' + (m.removedBy || 'a host') : (m.mine ? 'You' : (m.name || 'Someone'));
    if (!m.removed && (m.role === 'host' || m.role === 'cohost')) who.appendChild(el('span', 'font-size:11.5px;font-weight:800;color:#1F699E;background:#E6F1FB;border-radius:8px;padding:0 6px;margin-left:6px;', m.role === 'cohost' ? 'Co-host' : 'Host'));
    who.appendChild(el('span', 'font-weight:600;color:#6B7A8D;margin-left:6px;font-size:12.5px;', chatTime(m.at)));
    if (isHost && !m.removed && chat.onPin) {
      var pl = el('a', 'font-weight:700;color:#1F699E;margin-left:8px;font-size:12.5px;cursor:pointer;', 'Pin');
      pl.setAttribute('role', 'button'); pl.tabIndex = 0;
      pl.onclick = function () { chat.onPin(m); };
      who.appendChild(pl);
    }
    if (m.mine && !m.removed && chat.onDelete) {
      var dl = el('a', 'font-weight:700;color:#6B7A8D;margin-left:8px;font-size:12.5px;cursor:pointer;', 'Delete');
      dl.setAttribute('role', 'button'); dl.tabIndex = 0;
      dl.onclick = function () { chat.onDelete(m, row); };
      who.appendChild(dl);
    }
    mb.appendChild(who);
    var p = el('div', 'font-size:14.5px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;margin-top:2px;' + (m.removed ? 'color:#6B7A8D;font-style:italic;' : 'color:#1A2E42;'), m.removed ? 'This message was removed.' : m.body);
    mb.appendChild(p);
    row.appendChild(av); row.appendChild(mb);
    return row;
  }
  function chatStop() { if (chat.poll) { clearInterval(chat.poll); chat.poll = null; } chat.open = false; }
  function chatBadge(n, muted) {
    var b = document.getElementById('gp-chat-badge');
    if (!b) return;
    b.textContent = (n && !muted) ? String(n > 99 ? '99+' : n) : '';
    b.style.display = (n && !muted) ? 'inline-flex' : 'none';
  }
  function chatDraw() {
    var box = chat.box;
    box.innerHTML = '';
    var gname = chat.ctx.groupName() || 'This group';
    var head = el('div', 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px;');
    var titleBox = el('div', '');
    titleBox.appendChild(el('div', 'font-size:17px;font-weight:800;color:#1A2E42;', gname + ' Group Chat'));
    head.appendChild(titleBox);
    var muteBtn = el('button', 'width:40px;height:40px;border-radius:50%;border:1.5px solid #DDE4EE;background:#fff;color:#4B5A6D;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;', '');
    muteBtn.type = 'button';
    var headBtns = el('div', 'display:flex;gap:8px;flex-wrap:wrap;');
    headBtns.appendChild(muteBtn);
    head.appendChild(headBtns);
    head.appendChild(gatherLink());
    box.appendChild(head);
    var welcomeBox = el('div', 'display:none;background:#E6F1FB;border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.45;color:#1A2E42;margin-bottom:10px;');
    box.appendChild(welcomeBox);
    var pinBox = el('div', 'display:none;background:#FFF8E1;border-radius:12px;padding:10px 14px;font-size:13.5px;line-height:1.45;color:#1A2E42;margin-bottom:10px;');
    box.appendChild(pinBox);
    var older = el('button', 'display:none;align-self:center;margin:0 auto 6px;font:inherit;font-size:13px;color:#1F699E;font-weight:700;cursor:pointer;background:none;border:0;', 'Show earlier messages');
    older.type = 'button';
    box.appendChild(older);
    var feed = el('div', 'display:flex;flex-direction:column;max-height:460px;overflow:auto;padding-right:4px;');
    box.appendChild(feed);
    var fk = scrollKit(feed);
    var empty = el('div', 'font-size:14px;color:#4B5A6D;padding:8px 0;', '');
    empty.appendChild(waitPill('Opening the chat…'));
    feed.appendChild(empty);
    var bar = el('div', 'display:flex;gap:8px;margin-top:12px;align-items:flex-end;');
    var ta = el('textarea', 'flex:1;min-width:0;font:inherit;font-size:15px;color:#1A2E42;border:1.5px solid #DDE4EE;border-radius:18px;padding:9px 14px;min-height:42px;resize:vertical;');
    ta.placeholder = 'Write to members of ' + gname; ta.maxLength = 1500;
    var send = btn('Send');
    typing(ta, send);
    var pick = choiceCard();
    if (pick) box.appendChild(pick);
    bar.appendChild(ta); bar.appendChild(send);
    if (SCROLL_TEST) {
      bar.style.flexDirection = 'column'; bar.style.alignItems = 'stretch';
      ta.style.flex = 'none'; ta.style.width = '100%'; ta.style.boxSizing = 'border-box'; ta.style.minHeight = '112px'; ta.style.fontSize = '16px';
      send.style.alignSelf = 'flex-end';
    }
    box.appendChild(bar);
    var note = el('div', 'font-size:14px;font-weight:700;margin-top:6px;');
    box.appendChild(note);
    var muted = false;
    function paintMute() {
      var label = muted ? 'Unmute this chat' : 'Mute this chat';
      muteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>' + (muted ? '<path d="M3 3l18 18"/>' : '') + '</svg>';
      muteBtn.title = label; muteBtn.setAttribute('aria-label', label);
      muteBtn.style.background = muted ? '#1A2E42' : '#fff';
      muteBtn.style.borderColor = muted ? '#1A2E42' : '#DDE4EE';
      muteBtn.style.color = muted ? '#fff' : '#4B5A6D';
    }
    paintMute();
    var muteAsk = el('div', 'display:none;background:#F7FBFF;border:1.5px solid #C9DFF3;border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.45;color:#1A2E42;margin-bottom:10px;');
    head.parentNode.insertBefore(muteAsk, head.nextSibling);
    function setMuted(want) {
      muteBtn.disabled = true;
      api('/chat/prefs', { body: { groupId: chatGroupId(), muted: want, id: chat.ctx.meId, token: token() } }).then(function (d) {
        muteBtn.disabled = false;
        if (d && d.status === 'ok') { muted = d.muted; paintMute(); muteAsk.style.display = 'none'; }
      }).catch(function () { muteBtn.disabled = false; });
    }
    muteBtn.onclick = function () {
      if (muted) { setMuted(false); return; }
      if (muteAsk.style.display !== 'none') { muteAsk.style.display = 'none'; return; }
      muteAsk.innerHTML = '';
      muteAsk.appendChild(el('div', 'font-weight:800;margin-bottom:4px;', 'Mute this chat?'));
      muteAsk.appendChild(el('div', '', 'The rail will stop notifying you of this group\u2019s chat messages by email. You can still open the chat and read everything. Tap the moon again any time to unmute.'));
      var row = el('div', 'display:flex;gap:8px;margin-top:10px;');
      var yes = btn('Yes, mute it'), no = btn('No', 'quiet');
      yes.onclick = function () { yes.disabled = true; setMuted(true); };
      no.onclick = function () { muteAsk.style.display = 'none'; };
      row.appendChild(yes); row.appendChild(no); muteAsk.appendChild(row);
      muteAsk.style.display = '';
    };
    var isHostNow = function () { return chat.role === 'host' || chat.role === 'cohost'; };
    function paintWelcome(w) {
      welcomeBox.innerHTML = '';
      if (!w || !w.note) { welcomeBox.style.display = 'none'; return; }
      welcomeBox.style.display = '';
      welcomeBox.appendChild(el('div', 'font-size:12px;font-weight:800;color:#1F699E;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;', 'Welcome from ' + (w.by || 'the host')));
      welcomeBox.appendChild(el('div', 'white-space:pre-wrap;overflow-wrap:anywhere;', w.note));
      var got = btn('Got it');
      got.style.marginTop = '10px';
      got.onclick = function () {
        got.disabled = true;
        api('/chat/welcome/seen', { body: { groupId: chatGroupId(), id: chat.ctx.meId, token: token() } }).then(function (d) {
          if (d && d.status === 'ok') { welcomeBox.style.display = 'none'; chat.welcomeGone = true; } else got.disabled = false;
        }).catch(function () { got.disabled = false; });
      };
      welcomeBox.appendChild(got);
    }
    function paintPin(pin) {
      pinBox.innerHTML = '';
      if (!pin) { pinBox.style.display = 'none'; return; }
      pinBox.style.display = '';
      pinBox.appendChild(el('div', 'font-size:12px;font-weight:800;color:#8A6200;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;', '📌 Pinned by ' + (pin.by || 'a host')));
      var line = el('div', 'white-space:pre-wrap;overflow-wrap:anywhere;');
      if (pin.from) line.appendChild(el('b', '', pin.from + ': '));
      line.appendChild(document.createTextNode(pin.body));
      pinBox.appendChild(line);
      if (isHostNow()) {
        var un = el('a', 'display:inline-block;margin-top:6px;font-size:13px;font-weight:700;color:#1F699E;cursor:pointer;', 'Unpin');
        un.setAttribute('role', 'button'); un.tabIndex = 0;
        un.onclick = function () { setPin(0); };
        pinBox.appendChild(un);
      }
    }
    function setPin(mid) {
      api('/chat/pin', { body: { groupId: chatGroupId(), messageId: mid, id: chat.ctx.meId, token: token() } }).then(function (d) {
        if (d && d.status === 'ok') { say(note, ''); paintPin(d.pin); } else say(note, (d && d.message) || 'That did not save.', true);
      }).catch(function () { say(note, 'That did not reach the server. Try again in a moment.', true); });
    }
    chat.onPin = function (m) { setPin(m.id); };
    chat.onDelete = function (m, rowEl) {
      var old = rowEl.querySelector('.gp-del-ask');
      if (old) { old.remove(); return; }
      var ask = el('div', 'margin-top:6px;');
      ask.className = 'gp-del-ask';
      ask.appendChild(el('div', 'font-size:13.5px;color:#1A2E42;margin-bottom:6px;', 'Delete this message? It disappears for everyone in the chat.'));
      var r2 = el('div', 'display:flex;gap:8px;');
      var yes = btn('Yes, delete'), no = btn('No', 'quiet');
      yes.onclick = function () {
        yes.disabled = true;
        api('/chat/delete', { body: { groupId: chatGroupId(), messageId: m.id, id: chat.ctx.meId, token: token() } }).then(function (d) {
          if (d && d.status === 'ok') { add([{ id: m.id, mine: true, name: '', role: '', body: '', at: m.at, removed: true, removedBy: 'the sender' }]); }
          else { yes.disabled = false; say(note, (d && d.message) || 'That did not go through.', true); }
        }).catch(function () { yes.disabled = false; say(note, 'That did not reach the server. Try again in a moment.', true); });
      };
      no.onclick = function () { ask.remove(); };
      r2.appendChild(yes); r2.appendChild(no); ask.appendChild(r2);
      rowEl.querySelector('div > div:last-child').appendChild(ask);
    };
    function add(list, atTop) {
      if (empty.parentNode) empty.remove();
      var nearBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 80;
      if (atTop) {
        var h0 = feed.scrollHeight;
        list.slice().reverse().forEach(function (m) { feed.insertBefore(chatRow(m), feed.firstChild); });
        feed.scrollTop = feed.scrollHeight - h0;
      } else {
        list.forEach(function (m) {
          var have = feed.querySelector('[data-mid="' + m.id + '"]');
          if (have) have.replaceWith(chatRow(m)); else feed.appendChild(chatRow(m));
        });
        if (nearBottom || list.some(function (m) { return m.mine; })) { feed.scrollTop = feed.scrollHeight; if (fk) { feed._stuck = true; fk.bottom(); } }
        else if (fk && list.length) { feed._stuck = false; fk.pill(); }
      }
      list.forEach(function (m) { if (m.id > chat.last) chat.last = m.id; if (!chat.first || m.id < chat.first) chat.first = m.id; });
    }
    older.onclick = function () {
      older.textContent = 'Loading…';
      api('/chat/open', { body: { groupId: chatGroupId(), before: chat.first, id: chat.ctx.meId, token: token() } }).then(function (d) {
        older.textContent = 'Show earlier messages';
        if (!d || d.status !== 'ok' || !d.allowed) return;
        add(d.messages, true);
        older.style.display = d.more ? '' : 'none';
      }).catch(function () { older.textContent = 'Show earlier messages'; });
    };
    send.onclick = function () {
      var text = ta.value.trim();
      if (!text) return;
      send.disabled = true; ta.readOnly = true; say(note, '');
      api('/chat/send', { body: { groupId: chatGroupId(), body: text, id: chat.ctx.meId, token: token() } }).then(function (d) {
        send.disabled = false; ta.readOnly = false;
        if (!d || d.status !== 'ok' || !d.sent) { say(note, (d && d.message) || 'That did not go through.', true); return; }
        ta.value = ''; say(note, ''); add([d.message]); ta.focus();
      }).catch(function () { send.disabled = false; ta.readOnly = false; say(note, 'That did not reach the server. Try again in a moment.', true); });
    };
    api('/chat/open', { body: { groupId: chatGroupId(), id: chat.ctx.meId, token: token() } }).then(function (d) {
      if (again(d)) return start().then(chatDraw);
      say(note, '');
      if (!d || d.status !== 'ok') { empty.textContent = (d && d.message) || 'The chat did not open. Reload the page to try again.'; return; }
      if (!d.allowed) { empty.textContent = d.reason === 'chat-off' ? 'The host has turned the group chat off.' : ''; bar.style.display = 'none'; muteBtn.style.display = 'none'; return; }
      chat.role = d.role || '';
      muted = !!d.muted; paintMute(); paintPin(d.pin); paintWelcome(d.welcome);
      if (!d.messages.length) empty.textContent = 'No messages yet. Say hello.';
      else add(d.messages);
      feed.scrollTop = feed.scrollHeight;
      older.style.display = d.more ? '' : 'none';
      chatBadge(0, true);
      chatStop(); chat.open = true;
      chat.poll = setInterval(function () {
        if (document.hidden || !chat.open) return;
        fetch(API + '/chat/new?group=' + encodeURIComponent(chatGroupId()) + '&after=' + chat.last, { headers: { 'x-msg-session': session } })
          .then(function (r) { return r.json().then(function (x) { x._http = r.status; return x; }); })
          .then(function (x) {
            if (x && x._http === 409) { api('/chat/warm', { body: { groupId: chatGroupId(), id: chat.ctx.meId, token: token() } }).catch(function () {}); return; }
            if (x && x.status === 'ok') { if (x.messages.length) add(x.messages); paintPin(x.pin); }
          }).catch(function () {});
      }, 20000);
    }).catch(function () { say(note, ''); empty.textContent = 'The chat did not open. Reload the page to try again.'; });
  }
  window.cwGroupWelcome = {
    call: function (meId, tok, path, body) {
      var MSG = API, k = 'cw-msg-session-' + String(meId || '');
      var sess = function () {
        try { var kept = sessionStorage.getItem(k) || ''; if (kept && parseInt(kept.split('.')[1] || '0', 10) > Date.now() + 60000) return Promise.resolve(kept); } catch (e) {}
        return fetch(MSG + '/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: meId, token: devAs || tok }) })
          .then(function (x) { return x.json(); })
          .then(function (d) { if (!d || d.status !== 'ok') throw new Error('no'); try { sessionStorage.setItem(k, d.session); } catch (e) {} return d.session; });
      };
      return sess().then(function (sk) {
        return fetch(MSG + path, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', 'x-msg-session': sk }, body: body ? JSON.stringify(body) : undefined }).then(function (x) { return x.json(); });
      });
    },
    get: function (meId, tok, groupId) { return this.call(meId, tok, '/chat/welcome?group=' + encodeURIComponent(groupId)); },
    getHistory: function (meId, tok, groupId) { return this.call(meId, tok, '/chat/history?group=' + encodeURIComponent(groupId)); },
    saveHistory: function (meId, tok, groupId, yes) { return this.call(meId, tok, '/chat/history', { groupId: groupId, historyForNew: !!yes, id: meId, token: devAs || tok }); },
    save: function (meId, tok, groupId, note) { return this.call(meId, tok, '/chat/welcome', { groupId: groupId, note: note, id: meId, token: devAs || tok }); }
  };

  function railPeek(gid, tries) {
    fetch(API + '/chat/peek?group=' + encodeURIComponent(gid), { headers: { 'x-msg-session': session } })
      .then(function (r) { return r.json().then(function (x) { x._http = r.status; return x; }); })
      .then(function (d) {
        if (d && d._http === 409 && tries > 0) { setTimeout(function () { railPeek(gid, tries - 1); }, 4000); return; }
        if (!d || d.status !== 'ok') return;
        chatBadge(d.unread, d.muted);
        var body = document.getElementById('gp-rs-chat-body');
        if (!body) return;
        body.innerHTML = '';
        var line = function (m, pinned) {
          var w = el('div', 'font-size:13.5px;line-height:1.4;color:#1A2E42;margin-bottom:8px;' + (pinned ? 'background:#FFF8E1;border-radius:8px;padding:6px 8px;' : ''));
          var c2 = el('div', 'display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;');
          c2.appendChild(el('b', '', (pinned ? '\u{1F4CC} ' : '') + (m.mine ? 'You' : (m.name || 'Someone')) + ': '));
          c2.appendChild(document.createTextNode(m.body || ''));
          w.appendChild(c2);
          body.appendChild(w);
          if (c2.scrollHeight > c2.clientHeight + 2) {
            var more = el('a', 'font-size:12.5px;font-weight:700;color:#1F699E;cursor:pointer;', 'Read more...');
            more.setAttribute('role', 'link'); more.tabIndex = 0;
            more.onclick = function () { if (window.gpShow) window.gpShow('chat'); };
            w.appendChild(more);
          }
        };
        if (d.pin) line({ name: d.pin.from, body: d.pin.body }, true);
        (d.recent || []).forEach(function (m) { if (!d.pin || m.id !== d.pin.messageId) line(m, false); });
        if (!body.children.length) body.appendChild(el('div', 'font-size:13.5px;color:#4B5A6D;', 'No messages yet.'));
      }).catch(function () {});
  }
  window.cwGroupChat = {
    init: function (c) {
      chat.ctx = c;
      if (!ctx) ctx = c;
      var gid = String(c.groupId || '');
      var warmAndPeek = function () {
        api('/chat/warm', { body: { groupId: gid, id: c.meId, token: c.token ? c.token() : '' } }).catch(function () {});
        railPeek(gid, 3);
      };
      var k = keptSession();
      if (k) { session = session || k; me = me || k.split('.')[0]; warmAndPeek(); }
      else start().then(function (ok) { if (ok) warmAndPeek(); }).catch(function () {});
      if (window._gpView === 'chat' && !chat.box) this.open();
    },
    open: function () {
      if (!chat.ctx) return;
      if (!ctx) ctx = chat.ctx;
      chat.box = document.getElementById(chat.ctx.chatBoxId || 'gp-chat');
      if (!chat.box) return;
      chat.box.innerHTML = '';
      var w = el('div', 'font-size:14px;color:#4B5A6D;', '');
      w.appendChild(waitPill('Opening the chat…'));
      chat.box.appendChild(w);
      start().then(function (ok) {
        if (!ok) { say(w, 'Sign in again to see the chat.', true); return; }
        return api('/prefs').then(function (d) { if (d && d.status === 'ok') enterSends = d.enterSends === false ? false : true; }).catch(function () {}).then(chatDraw);
      }).catch(function () { say(w, 'The chat did not open. Reload the page to try again.', true); });
    },
    close: chatStop
  };

  window.cwGroupMessages = {
    init: function (c) {
      ctx = c;
      var s = document.getElementById('gp-tile-msg-sub');
      if (s) s.textContent = 'Your conversations';
      session = keptSession();
      if (session) { me = session.split('.')[0]; tileRefresh(); }
      if (window._gpView === 'messages' && !box) { var t = ''; try { t = new URLSearchParams(location.search).get('to') || ''; } catch (e) {} this.open(t); }
    },
    open: function (to) {
      if (!ctx) return;
      box = document.getElementById(ctx.boxId || 'gp-messages');
      if (!box) return;
      box.innerHTML = '';
      var w = el('div', 'font-size:14px;color:#4B5A6D;', '');
      w.appendChild(waitPill('Opening your messages…'));
      box.appendChild(w);
      start().then(function (ok) {
        if (!ok) { say(w, 'Sign in again to see your messages.', true); return; }
        return api('/prefs').then(function (d) { if (d && d.status === 'ok') enterSends = d.enterSends === false ? false : true; }).catch(function () {}).then(function () {
          if (to) drawNew(to); else drawList();
        });
      }).catch(function () { say(w, 'Your messages did not load. Reload the page to try again.', true); });
    },
    close: stopPoll
  };
})();
