/* Copyright 2026 DayBalancer LLC. All rights reserved. */
(function () {
  var w = window, d = document;
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var BODY = 'People whose profile answers match yours can see what you share. Your name and photo is shared only when you both say yes to contacting each other.';
  function me() { try { var m = w.CW && CW.me(); return m && m.id && !m.viewing ? String(m.id).trim() : ''; } catch (e) { return ''; } }
  function viewing() { try { var m = w.CW && CW.me(); return !!(m && m.viewing); } catch (e) { return true; } }
  function token() { try { return w.localStorage.getItem('cw-token') || ''; } catch (e) { return ''; } }
  function key(id) { return 'cw-fm-told-' + String(id).toLowerCase(); }
  function told(id) { try { return w.localStorage.getItem(key(id)) === '1'; } catch (e) { return false; } }
  function markTold(id) { try { w.localStorage.setItem(key(id), '1'); } catch (e) {} }
  function send(id, action, params) {
    var body = { action: action, appearId: id, meToken: token() };
    Object.keys(params || {}).forEach(function (k) { body[k] = String(params[k]); });
    return fetch(GS + '?action=' + action + '&meToken=&t=' + Date.now(), { method: 'POST', cache: 'no-store', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  }
  function css() {
    if (d.getElementById('fm-css')) { return; }
    var s = d.createElement('style'); s.id = 'fm-css';
    s.textContent = '#fm-notice{max-width:960px;margin:0 auto 18px;background:#F7FBFF;border:1.5px solid #C9DFF3;border-radius:12px;padding:14px 16px;font-family:\'Nunito Sans\',\'DM Sans\',system-ui,sans-serif;color:#1A2E42;display:flex;gap:14px;align-items:center;flex-wrap:wrap;}'
      + '#fm-notice .fm-t{flex:1;min-width:220px;font-size:14.5px;line-height:1.5;}'
      + '#fm-notice .fm-h{font-weight:800;font-size:15px;margin:0 0 2px;}'
      + '#fm-notice p{margin:0 0 4px;}'
      + '.fm-cap{display:inline-flex;flex:0 0 auto;min-width:0;width:auto;border:1.5px solid #1F699E;border-radius:24px;overflow:hidden;background:#fff;}'
      + '.fm-cap button{font:700 13px \'Nunito Sans\',sans-serif;padding:8.5px 16px;border-radius:24px;border:0;background:#fff;color:#1F699E;cursor:pointer;}'
      + '.fm-cap button[aria-pressed="true"],.fm-cap button[aria-pressed="true"]:hover,.fm-cap button[aria-pressed="true"]:focus{background:#1F699E;color:#fff;}'
      + '.fm-cap button[aria-pressed="false"]:hover{background:#EEF2F7;}'
      + '.fm-cap button[disabled]{cursor:default;}'
      + '@media(max-width:767px){.fm-cap button{padding:8.5px 10px;}}';
    d.head.appendChild(s);
  }
  function capsule(id, on, after) {
    css();
    var cap = d.createElement('span'); cap.className = 'fm-cap'; cap.setAttribute('role', 'group'); cap.setAttribute('aria-label', 'Let people find me');
    var yes = d.createElement('button'), no = d.createElement('button');
    yes.type = no.type = 'button'; yes.textContent = 'On'; no.textContent = 'Off';
    var paint = function (v) { yes.setAttribute('aria-pressed', v ? 'true' : 'false'); no.setAttribute('aria-pressed', v ? 'false' : 'true'); };
    paint(on);
    var pick = function (v) {
      if (yes.getAttribute('aria-pressed') === (v ? 'true' : 'false')) { return; }
      yes.disabled = no.disabled = true; paint(v);
      send(id, 'setFindMe57b', { on: v ? '1' : '0' }).then(function (r) {
        var now = r && r.findMe === 'on'; paint(now); if (after) { after(now); }
      }).catch(function () { paint(!v); }).then(function () { yes.disabled = no.disabled = false; });
    };
    yes.onclick = function () { pick(true); }; no.onclick = function () { pick(false); };
    cap.appendChild(yes); cap.appendChild(no);
    return cap;
  }
  function draw(id, on) {
    css();
    var box = d.createElement('div'); box.id = 'fm-notice'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Anonymous matching');
    var t = d.createElement('div'); t.className = 'fm-t';
    var h = d.createElement('p'); h.className = 'fm-h';
    var head = function (v) { h.textContent = v ? 'Anonymous matching is on' : 'Anonymous matching is off'; };
    head(on);
    var b = d.createElement('p'); b.textContent = BODY;
    var o = d.createElement('p'); o.textContent = 'You can turn this off anytime.';
    t.appendChild(h); t.appendChild(b); t.appendChild(o);
    box.appendChild(t); box.appendChild(capsule(id, on, head));
    var wrap = d.querySelector('.wrap') || d.body;
    wrap.insertBefore(box, wrap.firstChild);
    return box;
  }
  w.CWFindMe = { capsule: capsule };
  var tries = 0;
  function start() {
    if (viewing()) { return; }
    var id = me();
    if (!id) { if (tries++ < 40) { setTimeout(start, 300); } return; }
    if (told(id) || !token()) { return; }
    send(id, 'getFindMe57b', {}).then(function (r) {
      if (!r || r.status !== 'ok') { return; }
      if (r.told) { markTold(id); return; }
      var box = draw(id, true);
      w.requestAnimationFrame(function () {
        if (!box.isConnected) { return; }
        send(id, 'fpNoticeSeen57b', {}).then(function (x) { if (x && x.status === 'ok' && x.told) { markTold(id); } });
      });
    }).catch(function () {});
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
