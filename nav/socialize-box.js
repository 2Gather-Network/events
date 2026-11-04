(function(){
  var GS = "https://cw-api-gate.jessieupp.workers.dev";
  var NOTE = 'When sharing this event link, your photo and name show on this event under "Socialized by", and for those signed in, it includes a link to your profile.';

  window.cwSocBoxHTML = function (o) {
    var me = !!o.me;
    return '<div class="card-body">'
      + '<button type="button" class="cw-soc-x" onclick="' + o.on.done + '" aria-label="Close">×</button>'
      + '<h2 class="cw-soc-h">' + (me ? 'Socialize' : 'Share this event') + '</h2>'
      + '<p class="cw-soc-lede">' + (me ? 'Help socialize this event in the way you want.' : 'Help share this event in the way you want.') + (o.hosted ? ' The host stays the host.' : '') + '</p>'
      + '<div class="cw-soc-acts">'
      +   '<button type="button" class="btn btn-outline copy-btn-el" onclick="' + o.on.copy + '">Copy link</button>'
      +   (!o.cancelled ? '<button type="button" class="btn btn-outline" onclick="' + o.on.share + '">Share</button>' : '')
      +   '<button type="button" class="btn btn-outline" onclick="' + o.on.qr + '">QR</button>'
      + '</div>'
      + '<div id="cw-soc-qr-slot"></div>'
      + (o.ask
        ? '<label class="cw-soc-switch' + (o.listed ? ' on' : '') + '" id="cw-soc-switch">'
          +   '<input type="checkbox" id="cw-soc-list"' + (o.listed ? ' checked' : '') + ' onchange="' + o.on.list + '">'
          +   '<span class="cw-soc-track"><span class="cw-soc-knob"></span></span>'
          +   '<span>List me as socializing</span>'
          + '</label>'
          + '<p class="cw-soc-note">' + NOTE + '</p>'
        : (!me ? (o.signinHTML || '') : ''))
      + '<p class="cw-soc-say" id="cw-soc-say" hidden></p>'
      + '<div class="cw-soc-foot"><button type="button" class="btn btn-primary" onclick="' + o.on.done + '">Done</button></div>'
      + (o.extra || '')
      + '</div>';
  };

  var css = document.createElement('style');
  css.textContent = ''
    + '.cw-soc-inline{margin:12px 0 0;border:1.5px solid #9FB4C9;border-radius:12px;background:#fff;box-shadow:0 4px 16px rgba(16,40,70,.14);cursor:default;text-align:left;}'
    + '.cw-soc-inline .card-body{padding:18px 16px 18px;position:relative;}'
    + '.cw-soc-inline .cw-soc-x{position:absolute;top:8px;right:8px;width:34px;height:34px;border:0;border-radius:50%;background:transparent;color:#6B7A8D;font:inherit;font-size:24px;line-height:1;cursor:pointer;padding:0;}'
    + '.cw-soc-inline .cw-soc-x:hover{background:#F1F5F9;color:#1A2E42;}'
    + '.cw-soc-inline .cw-soc-h{font-size:18px;font-weight:700;line-height:1.3;margin:0 0 6px;padding-right:34px;color:#1A2E42;}'
    + '.cw-soc-inline .cw-soc-lede{font-size:14.5px;line-height:1.55;color:#374151;margin:0 0 14px;}'
    + '.cw-soc-inline .cw-soc-acts{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 6px;}'
    + '.cw-soc-inline .cw-soc-acts .btn{flex:1 1 72px;justify-content:center;min-width:0;padding:9px 8px;background:#fff;color:#1F699E;border:1.5px solid #1F699E;border-radius:8px;font:inherit;font-size:14px;font-weight:700;white-space:nowrap;cursor:pointer;}'
    + '.cw-soc-inline .cw-soc-q{font-size:14px;line-height:1.55;color:#1A2E42;margin:16px 0 8px;}'
    + '.cw-soc-inline .cw-soc-say{font-size:14px;color:#c0392b;margin:8px 0 0;}'
    + '.cw-soc-inline .cw-soc-foot{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0;}'
    + '.cw-soc-inline .cw-soc-foot .btn{background:#1F699E;color:#fff;border:0;border-radius:8px;font:inherit;font-size:14px;font-weight:700;padding:9px 18px;cursor:pointer;}'
    + '.cw-soc-inline .cw-soc-switch{position:relative;display:flex;align-items:center;gap:10px;margin:16px 0 4px;font-size:15px;font-weight:600;color:#1A2E42;cursor:pointer;}'
    + '.cw-soc-inline .cw-soc-switch input{position:absolute;opacity:0;width:0;height:0;}'
    + '.cw-soc-inline .cw-soc-track{width:40px;height:22px;border-radius:12px;background:#DDE4EE;position:relative;flex-shrink:0;transition:background .15s;}'
    + '.cw-soc-inline .cw-soc-knob{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .15s;}'
    + '.cw-soc-inline .cw-soc-switch.on .cw-soc-track{background:#1F699E;}'
    + '.cw-soc-inline .cw-soc-switch.on .cw-soc-knob{left:20px;}'
    + '.cw-soc-inline .cw-soc-switch input:focus-visible + .cw-soc-track{outline:2px solid #1F699E;outline-offset:2px;}'
    + '.cw-soc-inline .cw-soc-note{font-size:13px;color:#6B7A8D;line-height:1.5;margin:0 0 4px;}'
    + '.cw-soc-inline #cw-soc-qr-slot{text-align:center;}'
    + '.cw-soc-inline #cw-soc-qr-slot canvas{display:block;margin:10px auto 6px;max-width:100%;height:auto;}'
    + '.cw-soc-inline #cw-soc-qr-slot p{font-size:12.5px;color:#6B7A8D;margin:0 0 6px;word-break:break-all;}'
    + '.cw-soc-inline #cw-soc-qr-slot input{width:100%;box-sizing:border-box;border:1.5px solid #D5E1EC;border-radius:6px;padding:7px 10px;font-size:12px;margin:8px 0 0;}';
  document.head.appendChild(css);

  var cur = null;
  function who() {
    var real = '', viewing = false, me = '';
    try {
      if (window.CW && CW.realMe) real = String(CW.realMe().id || '').trim();
      viewing = !!(window.CW && ((CW.viewingAs && String(CW.viewingAs() || '').trim()) || (CW.me && CW.me().viewing)));
      if (window.CW && CW.signedOutView && CW.signedOutView()) real = '';
      if (window.CW && CW.me && CW.me().known) me = String(CW.me().id || '');
    } catch (e) { real = ''; }
    return { real: real, viewing: viewing, me: me };
  }
  function mine() {
    try { var m = JSON.parse(localStorage.getItem('cw-soc-mine') || '{}'); return (m && typeof m === 'object' && !Array.isArray(m)) ? m : {}; } catch (e) { return {}; }
  }
  function remember(eid, me, listed) {
    try { var m = mine(); m[eid + '|' + me] = listed ? 2 : 1; localStorage.setItem('cw-soc-mine', JSON.stringify(m)); } catch (e) {}
    try {
      var r = JSON.parse(sessionStorage.getItem('cw-soc-done') || '{}') || {};
      r[eid + '|' + me] = Date.now();
      sessionStorage.setItem('cw-soc-done', JSON.stringify(r));
      sessionStorage.setItem('cw-wrote-at', String(Date.now()));
    } catch (e) {}
  }
  function tell(m) { var s = cur && cur.box.querySelector('#cw-soc-say'); if (s) { s.textContent = m || ''; s.hidden = !m; } }
  function base() { return 'https://2gather.network/event/?id=' + encodeURIComponent(cur.ev.id); }
  function link() {
    var u = cur.short || base();
    return (cur.listed && window.CW && CW.withRef) ? CW.withRef(u) : u;
  }
  function close() {
    if (!cur) return;
    var c = cur; cur = null;
    if (c.box && c.box.parentNode) c.box.parentNode.removeChild(c.box);
    if (c.btn) c.btn.setAttribute('aria-expanded', 'false');
  }
  async function save() {
    var c = cur;
    if (!c || c.ev.cancelled) return;
    var w = who();
    if (!w.real) return;
    if (w.viewing) { tell('You are looking at this as somebody else, so nothing was saved.'); return; }
    if (c.saving) { c.pending = true; return; }
    c.saving = true;
    var want = c.listed, ok = null;
    try {
      try { await c.shortJob; } catch (e) {}
      var soId = (c.ev.seriesId && String(c.ev.id).indexOf('recurring-') === 0) ? String(c.ev.seriesId) : String(c.ev.id);
      var r = await fetch(GS + '?action=socialize&id=' + encodeURIComponent(soId) + '&appearId=' + encodeURIComponent(w.real) + '&shown=' + (want ? 'yes' : 'no'));
      var d = null; try { d = JSON.parse(await r.text()); } catch (e) {}
      if (d && d.status === 'ok' && d.socializing === true) ok = d;
    } catch (e) {}
    c.saving = false;
    if (cur !== c) return;
    if (!ok) { tell('That did not save. Try again.'); c.pending = false; return; }
    c.done = true;
    remember(String(c.ev.id), w.me || w.real, ok.shown === true);
    tell('');
    if (c.pending) { c.pending = false; if (c.listed !== want) save(); }
  }
  function copyText(url, btn) {
    var orig = btn ? btn.innerHTML : '';
    var fallback = function () {
      var slot = cur && cur.box.querySelector('#cw-soc-qr-slot');
      if (slot) { slot.innerHTML = '<input readonly value="' + url.replace(/"/g, '&quot;') + '">'; var i = slot.querySelector('input'); if (i) i.select(); }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { if (btn) { btn.innerHTML = '✓ Copied!'; setTimeout(function () { btn.innerHTML = orig; }, 2000); } }, fallback);
      } else { fallback(); }
    } catch (e) { fallback(); }
  }
  function qr() {
    var slot = cur.box.querySelector('#cw-soc-qr-slot');
    if (!slot) return;
    if (slot.querySelector('canvas')) { slot.innerHTML = ''; return; }
    var url = cur.short || base();
    slot.innerHTML = '<canvas width="220" height="220"></canvas><p>' + url.replace(/</g, '&lt;') + '</p>';
    var draw = function () { try { new QRious({ element: slot.querySelector('canvas'), value: url, size: 220, foreground: '#1a1a2e', background: '#ffffff', level: 'H', padding: 12 }); } catch (e) {} };
    if (window.QRious) { draw(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
    s.onload = draw;
    s.onerror = function () { slot.innerHTML = '<p>Could not load the QR code. Copy link works.</p>'; };
    document.head.appendChild(s);
  }

  window.cwSocInline = {
    toggle: function (btn) {
      var card = btn.closest('.event-card'), id = btn.getAttribute('data-ev');
      if (!card || !id) return;
      if (cur && cur.card === card) { close(); return; }
      close();
      var w = who();
      var v = mine()[id + '|' + (w.me || w.real)];
      var ev = { id: id, title: btn.getAttribute('data-title') || '', seriesId: btn.getAttribute('data-series') || '', cancelled: btn.getAttribute('data-cancelled') === '1' };
      var box = document.createElement('div');
      box.className = 'cw-soc-inline';
      box.addEventListener('click', function (e) { e.stopPropagation(); });
      cur = { card: card, btn: btn, box: box, ev: ev, listed: v === undefined ? true : v === 2, done: v !== undefined, short: null, saving: false, pending: false };
      cur.shortJob = fetch(GS + '?action=getShortCode&id=' + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (d) { if (d && d.status === 'ok' && d.code && cur && cur.ev.id === id) cur.short = 'https://go.2gather.network/' + d.code; }).catch(function () {});
      box.innerHTML = cwSocBoxHTML({
        me: !!w.me, hosted: btn.getAttribute('data-hosted') === '1', cancelled: ev.cancelled, ask: !!w.me && !ev.cancelled, listed: cur.listed,
        signinHTML: '<p class="cw-soc-q"><a href="https://2gather.network/signin/" style="font-weight:700;">Sign in</a> to be listed as somebody helping spread it.</p>',
        on: { done: 'cwSocInline.close()', copy: "cwSocInline.act('copy', this)", share: "cwSocInline.act('share', this)", qr: "cwSocInline.act('qr', this)", list: 'cwSocInline.list(this.checked)' }
      });
      var top = card.querySelector('.event-card-top') || card;
      top.appendChild(box);
      btn.setAttribute('aria-expanded', 'true');
      try { var r = box.getBoundingClientRect(); if (r.bottom > window.innerHeight) box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
    },
    close: function () {
      var c = cur;
      if (!c) return;
      var t0 = Date.now();
      (function wait() { if ((c.saving || c.pending) && Date.now() - t0 < 6000) { setTimeout(wait, 150); return; } if (cur === c) close(); })();
    },
    act: async function (what, btn) {
      if (!cur) return;
      if (what === 'qr') { try { await cur.shortJob; } catch (e) {} if (cur) qr(); }
      else {
        var url = link();
        if (what === 'share' && navigator.share) {
          navigator.share({ title: cur.ev.title || '2Gather event', url: url }).catch(function (err) { if (err && err.name !== 'AbortError') copyText(url, null); });
        } else { copyText(url, what === 'copy' ? btn : null); }
      }
      if (cur && !cur.done) save();
    },
    list: function (on) {
      if (!cur) return;
      cur.listed = !!on;
      var sw = cur.box.querySelector('#cw-soc-switch');
      if (sw) sw.classList.toggle('on', cur.listed);
      save();
    }
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) window.cwSocInline.close(); });
})();
