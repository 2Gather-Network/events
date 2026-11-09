(function (w, d) {
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  function ls(k) { try { return w.localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function me() { try { return (w.CW && w.CW.realMe) ? String(w.CW.realMe().id || '') : ''; } catch (e) { return ''; } }
  function auth() { return '&appearId=' + encodeURIComponent(me()) + '&meToken=' + encodeURIComponent(ls('cw-token')); }
  function get(q) { return fetch(GS + '?' + q + auth() + '&t=' + Date.now()).then(function (r) { return r.json(); }); }
  function el(tag, css, text) { var x = d.createElement(tag); if (css) { x.style.cssText = css; } if (text) { x.textContent = text; } return x; }
  function when(t) { try { return new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; } }
  var RED = '#A32D2D', INK = '#1A2E42', SOFT = '#2F3D4F';
  var BTN = 'font:inherit;font-size:14px;font-weight:700;padding:9px 18px;border-radius:24px;cursor:pointer;';

  function dot() {
    if (d.getElementById('cw-ban-dot')) { return; }
    var b = el('button', 'position:fixed;right:16px;bottom:16px;z-index:9000;display:inline-flex;align-items:center;gap:8px;'
      + 'background:#fff;border:1.5px solid #F09595;border-radius:20px;padding:6px 12px;cursor:pointer;'
      + 'font:700 13px/1.2 "Nunito Sans","DM Sans",system-ui,sans-serif;color:' + RED + ';');
    b.id = 'cw-ban-dot'; b.type = 'button'; b.setAttribute('aria-label', 'Ban someone');
    b.appendChild(el('span', 'width:12px;height:12px;border-radius:50%;background:#E24B4A;display:inline-block;'));
    b.appendChild(d.createTextNode('Ban someone'));
    b.onclick = open;
    d.body.appendChild(b);
  }

  function open() {
    var old = d.getElementById('cw-ban-panel'); if (old) { old.remove(); return; }
    var shade = el('div', 'position:fixed;inset:0;z-index:100002;background:rgba(26,46,66,.45);display:flex;align-items:flex-start;justify-content:center;padding:56px 16px;overflow:auto;');
    shade.id = 'cw-ban-panel';
    var card = el('div', 'background:#fff;border-radius:16px;max-width:560px;width:100%;padding:18px 20px;color:' + INK + ';font:400 14.5px/1.5 "Nunito Sans","DM Sans",system-ui,sans-serif;');
    shade.appendChild(card);
    var top = el('div', 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;');
    top.appendChild(el('div', 'font-size:18px;font-weight:800;', 'Ban someone'));
    var x = el('button', BTN + 'border:1px solid #C3D0DB;background:#fff;color:' + SOFT + ';padding:6px 14px;font-size:13px;', 'Cancel');
    x.type = 'button'; x.onclick = function () { shade.remove(); };
    top.appendChild(x); card.appendChild(top);

    var inp = el('input', 'width:100%;box-sizing:border-box;font:inherit;font-size:14px;font-weight:600;padding:8px 16px;min-height:38px;border:1.5px solid #DDE4EE;border-radius:22px;outline:none;color:' + INK + ';');
    inp.type = 'search'; inp.placeholder = 'Search by name or email'; inp.setAttribute('aria-label', 'Search by name or email');
    card.appendChild(inp);
    var found = el('div', 'margin:8px 0;display:flex;flex-direction:column;gap:6px;');
    card.appendChild(found);
    var pick = el('div', 'display:none;margin:10px 0;');
    card.appendChild(pick);
    var say = el('div', 'font-size:13.5px;color:' + SOFT + ';min-height:18px;margin:6px 0;');
    card.appendChild(say);
    var listH = el('div', 'font-size:12px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:' + SOFT + ';margin:14px 0 6px;', 'Banned now');
    var list = el('div', 'display:flex;flex-direction:column;gap:6px;');
    card.appendChild(listH); card.appendChild(list);
    d.body.appendChild(shade);
    try { inp.focus(); } catch (e) {}

    function loadList() {
      list.textContent = 'Looking…';
      get('action=getBans').then(function (r) {
        list.textContent = '';
        if (!r || r.status !== 'ok') { list.textContent = (r && r.message) || 'The list did not load.'; return; }
        if (!r.bans.length) { list.appendChild(el('div', 'color:' + SOFT + ';', 'Nobody is banned.')); return; }
        r.bans.forEach(function (b) {
          var row = el('div', 'display:flex;justify-content:space-between;gap:10px;align-items:center;border:1px solid #E3EAF0;border-radius:10px;padding:8px 10px;');
          var l = el('div', 'min-width:0;');
          l.appendChild(el('div', 'font-weight:700;', b.name));
          l.appendChild(el('div', 'font-size:12.5px;color:' + SOFT + ';', when(b.at) + ' · by ' + b.by + (b.reason ? ' · ' + b.reason : '')));
          var u = el('button', BTN + 'border:1.5px solid #1F699E;background:#fff;color:#1F699E;padding:6px 14px;font-size:13px;', 'Undo');
          u.type = 'button';
          u.onclick = function () {
            u.disabled = true; u.textContent = 'Undoing…';
            get('action=unbanPerson&banId=' + encodeURIComponent(b.banId)).then(function (r2) {
              if (r2 && r2.status === 'ok') { say.textContent = (r2.name || b.name) + ' can sign in again.'; loadList(); }
              else { u.disabled = false; u.textContent = 'Undo'; say.textContent = (r2 && r2.message) || 'That did not go through.'; }
            }).catch(function () { u.disabled = false; u.textContent = 'Undo'; say.textContent = 'That did not go through.'; });
          };
          row.appendChild(l); row.appendChild(u); list.appendChild(row);
        });
      }).catch(function () { list.textContent = 'The list did not load.'; });
    }

    function choose(p) {
      found.textContent = ''; pick.textContent = ''; pick.style.display = 'block'; say.textContent = '';
      var who = el('div', 'border:1px solid #E3EAF0;border-radius:10px;padding:10px 12px;margin-bottom:10px;');
      who.appendChild(el('div', 'font-weight:700;', p.name || 'A member'));
      who.appendChild(el('div', 'font-size:12.5px;color:' + SOFT + ';', p.email || ''));
      pick.appendChild(who);
      var why = el('textarea', 'width:100%;box-sizing:border-box;font:inherit;font-size:14px;padding:10px 14px;border:1.5px solid #DDE4EE;border-radius:12px;min-height:60px;outline:none;color:' + INK + ';');
      why.placeholder = 'Reason (only super admin plus support see it)'; why.setAttribute('aria-label', 'Reason');
      pick.appendChild(why);
      var go = el('button', BTN + 'border:0;background:' + RED + ';color:#fff;margin-top:10px;', 'Ban ' + (p.name || 'this person') + ' now');
      go.type = 'button';
      var armed = false;
      go.onclick = function () {
        if (!armed) { armed = true; go.textContent = 'Yes, ban ' + (p.name || 'them'); say.textContent = 'They are signed out on every device within a minute. You can undo it below.'; return; }
        go.disabled = true; go.textContent = 'Banning…';
        get('action=banPerson&target=' + encodeURIComponent(p.appearId) + '&reason=' + encodeURIComponent(why.value.trim())).then(function (r) {
          if (r && r.status === 'ok') { pick.style.display = 'none'; inp.value = ''; say.textContent = (r.name || p.name) + ' is banned. Super admins were emailed.'; loadList(); }
          else { go.disabled = false; armed = false; go.textContent = 'Ban ' + (p.name || 'this person') + ' now'; say.textContent = (r && r.message) || 'That did not go through.'; }
        }).catch(function () { go.disabled = false; armed = false; go.textContent = 'Ban ' + (p.name || 'this person') + ' now'; say.textContent = 'That did not go through.'; });
      };
      pick.appendChild(go);
    }

    var timer = null, seq = 0;
    inp.addEventListener('input', function () {
      var q = inp.value.trim();
      if (timer) { clearTimeout(timer); }
      found.textContent = ''; pick.style.display = 'none';
      if (q.length < 2) { return; }
      var mine = ++seq;
      timer = setTimeout(function () {
        found.textContent = 'Looking…';
        get('action=findAnyone&q=' + encodeURIComponent(q)).then(function (r) {
          if (mine !== seq) { return; }
          found.textContent = '';
          var m = (r && r.matches) || [];
          if (!m.length) { found.appendChild(el('div', 'color:' + SOFT + ';', 'Nobody matches.')); return; }
          m.slice(0, 8).forEach(function (p) {
            var b = el('button', 'text-align:left;font:inherit;background:#fff;border:1px solid #E3EAF0;border-radius:10px;padding:8px 10px;cursor:pointer;color:' + INK + ';');
            b.type = 'button';
            b.appendChild(el('div', 'font-weight:700;', p.name || 'A member'));
            b.appendChild(el('div', 'font-size:12.5px;color:' + SOFT + ';', p.email || ''));
            b.onclick = function () { choose(p); };
            found.appendChild(b);
          });
        }).catch(function () { if (mine === seq) { found.textContent = 'The search did not go through.'; } });
      }, 400);
    });
    loadList();
  }

  function check() {
    if (!me() || !ls('cw-token')) { return; }
    get('action=amISuper').then(function (r) { if (r && r.isOperator === true) { dot(); } }).catch(function () {});
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', check); } else { check(); }
})(window, document);
