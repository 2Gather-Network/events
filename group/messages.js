(function () {
  var API = 'https://cw-messages.jessieupp.workers.dev';
  var devAs = '';
  try {
    var qs = new URLSearchParams(location.search);
    if (location.hostname === 'localhost' && qs.get('msgapi') === 'local') { API = 'http://localhost:8788'; devAs = qs.get('devAs') || ''; }
  } catch (e) {}

  var ctx = null, box = null, session = '', me = '', poll = null, openId = '';
  var enterSends = null;

  function typing(ta, send) {
    ta.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter' || ev.shiftKey || ev.isComposing || enterSends !== true) return;
      ev.preventDefault();
      send.click();
    });
  }
  function choiceCard() {
    if (enterSends !== null) return null;
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
    if (title === 'Messages') title = (ctx.groupName() ? ctx.groupName() + ' messages' : 'Messages');
    box.innerHTML = '';
    var head = el('div', 'display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px;');
    head.appendChild(el('div', 'font-size:17px;font-weight:800;color:#1A2E42;', title));
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
      nb.onclick = function () { drawNew(); };
      head.appendChild(nb);
    }
    var list = el('div', 'display:flex;flex-direction:column;gap:0;');
    var wait = el('div', 'font-size:14px;color:#4B5A6D;', 'Looking for your messages…');
    box.appendChild(wait);
    box.appendChild(list);
    api('/threads?group=' + encodeURIComponent(ctx.groupId)).then(function (d) {
      if (again(d)) return start().then(drawList);
      if (!d || d.status !== 'ok') { say(wait, 'Your messages did not load. Reload the page to try again.', true); return; }
      wait.remove();
      var ts = d.threads || [];
      tile(ts.reduce(function (n, t) { return n + (t.unread || 0); }, 0));
      if (!ts.length) {
        list.appendChild(el('div', 'font-size:14px;color:#4B5A6D;line-height:1.5;', 'No messages in ' + (ctx.groupName() || 'this group') + ' yet.'
          + (ppl.length ? ' Start one above.' : '')));
        return;
      }
      ts.forEach(function (t) {
        var asking = t.status === 'request' && !t.iStarted;
        var row = el('div', 'display:flex;gap:12px;align-items:flex-start;padding:12px 4px;border-top:1px solid #EEF1F5;cursor:pointer;');
        var txt = el('div', 'flex:1;min-width:0;');
        var top = el('div', 'display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;');
        top.appendChild(el('b', 'font-size:15px;color:#1A2E42;', t.other.name || 'Someone'));
        if (t.other.role && t.other.role !== 'member') top.appendChild(el('span', 'font-size:12px;font-weight:700;color:#1F699E;background:#E6F1FB;border-radius:10px;padding:1px 8px;', t.other.role === 'cohost' ? 'Co-host' : 'Host'));
        if (t.last) top.appendChild(el('span', 'font-size:12.5px;color:#6B7A8D;margin-left:auto;', when(t.last.at)));
        txt.appendChild(top);
        var line = asking ? 'Wants to message you' : (t.status === 'request' ? 'Waiting for them to accept' : (t.status === 'pending' ? 'Delivering\u2026' : (t.status === 'refused' ? 'Did not go through' : (t.status === 'closed' ? 'Closed' : ''))));
        var prev = t.last ? (t.last.mine ? 'You: ' : '') + t.last.body : '';
        txt.appendChild(el('div', 'font-size:13.5px;color:#4B5A6D;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', line ? line + (prev && asking ? ': ' + prev : '') : prev));
        row.appendChild(txt);
        if (t.unread) row.appendChild(el('span', 'width:10px;height:10px;border-radius:50%;background:#1F699E;flex:none;margin-top:6px;'));
        row.onclick = function () { drawThread(t.id); };
        list.appendChild(row);
      });
    }).catch(function () { say(wait, 'Your messages did not load. Reload the page to try again.', true); });
  }

  function drawNew(pick) {
    stopPoll();
    var head = frame('New message');
    var back = btn('All messages', 'quiet');
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
      try { api('/precheck', { body: { id: ctx.meId, token: token(), to: p.code, groupId: ctx.groupId } }).catch(function () {}); } catch (e) {}
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
      send.disabled = true; say(note, 'Sending…');
      var slow = setTimeout(function () { say(note, 'Still sending. The first message can take up to a minute.'); }, 12000);
      api('/start', { body: { id: ctx.meId, token: token(), to: chosen.code, groupId: ctx.groupId, body: text } }).then(function (d) {
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
    var back = btn('All messages', 'quiet');
    back.onclick = drawList;
    head.appendChild(back);
    var sub = el('div', 'font-size:14px;color:#4B5A6D;margin:-6px 0 12px;', '');
    box.appendChild(sub);
    var asks = el('div', '');
    box.appendChild(asks);
    var msgs = el('div', 'display:flex;flex-direction:column;gap:8px;min-height:80px;');
    box.appendChild(msgs);
    var bar = el('div', 'display:flex;gap:8px;margin-top:14px;align-items:flex-end;');
    var ta = el('textarea', 'flex:1;min-width:0;font:inherit;font-size:15px;color:#1A2E42;border:1.5px solid #DDE4EE;border-radius:18px;padding:9px 14px;min-height:42px;resize:vertical;');
    ta.placeholder = 'Write a reply';
    ta.maxLength = 2000;
    var send = btn('Send');
    typing(ta, send);
    var pick1 = choiceCard();
    if (pick1) box.appendChild(pick1);
    bar.appendChild(ta); bar.appendChild(send);
    box.appendChild(bar);
    var note = el('div', 'font-size:14px;font-weight:700;margin-top:6px;');
    box.appendChild(note);
    var seen = -1;
    function load(first) {
      return api('/thread?id=' + encodeURIComponent(id)).then(function (d) {
        if (openId !== id) return;
        if (again(d)) return start().then(function () { return load(first); });
        if (!d || d.status !== 'ok') { if (first) say(sub, (d && d.message) || 'This conversation did not load.', true); return; }
        var t = d.thread;
        sub.textContent = '';
        sub.appendChild(el('b', 'color:#1A2E42;', t.other.name || 'Someone'));
        sub.appendChild(document.createTextNode(' · ' + (t.groupName || ctx.groupName() || '')));
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
        if (d.messages.length === seen) return;
        seen = d.messages.length;
        msgs.innerHTML = '';
        d.messages.forEach(function (m) {
          var b = el('div', 'max-width:80%;padding:9px 13px;border-radius:14px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere;'
            + (m.mine ? 'align-self:flex-end;background:#1F699E;color:#fff;' : 'align-self:flex-start;background:#F7F9FC;border:1px solid #DDE4EE;color:#1A2E42;'), m.body);
          b.title = new Date(m.at).toLocaleString();
          msgs.appendChild(b);
        });
        if (!first) return;
        tileRefresh();
      }).catch(function () { if (first) say(sub, 'This conversation did not load. Reload the page to try again.', true); });
    }
    send.onclick = function () {
      var text = ta.value.trim();
      if (!text) return;
      send.disabled = true; ta.readOnly = true;
      say(note, 'Sending\u2026');
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
    api('/unread?group=' + encodeURIComponent(ctx.groupId)).then(function (d) { if (d && d.status === 'ok') tile(d.unread); }).catch(function () {});
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

  window.cwGroupMessages = {
    init: function (c) {
      ctx = c;
      var s = document.getElementById('gp-tile-msg-sub');
      if (s) s.textContent = 'Your conversations in this group';
      session = keptSession();
      if (session) { me = session.split('.')[0]; tileRefresh(); }
      if (window._gpView === 'messages' && !box) { var t = ''; try { t = new URLSearchParams(location.search).get('to') || ''; } catch (e) {} this.open(t); }
    },
    open: function (to) {
      if (!ctx) return;
      box = document.getElementById(ctx.boxId || 'gp-messages');
      if (!box) return;
      box.innerHTML = '';
      var w = el('div', 'font-size:14px;color:#4B5A6D;', 'Opening your messages…');
      box.appendChild(w);
      start().then(function (ok) {
        if (!ok) { say(w, 'Sign in again to see your messages.', true); return; }
        return api('/prefs').then(function (d) { if (d && d.status === 'ok') enterSends = d.enterSends; }).catch(function () {}).then(function () {
          if (to) drawNew(to); else drawList();
        });
      }).catch(function () { say(w, 'Your messages did not load. Reload the page to try again.', true); });
    },
    close: stopPoll
  };
})();
