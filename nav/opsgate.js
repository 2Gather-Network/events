/*
  Copyright 2026 DayBalancer LLC. All rights reserved.

  The code and the content here power Creating.Works, DayBalancer, Appear Network,
  and 2Gather. They are published so they can be read, audited, and dated.

  Running either as a separate offering requires a license, whether you brand it as
  ours or as your own, and whether or not money changes hands.

  hello@creating.works
*/
/* V1.00 */
(function (w, d) {
  'use strict';
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var KEY = 'cw-ops-session';
  var WHO = 'cw-ops-who';

  function ls(fn, dflt) { try { return fn(); } catch (e) { return dflt; } }
  function recall() {
    return ls(function () {
      var v = JSON.parse(w.localStorage.getItem(KEY) || 'null');
      return (v && v.tok && v.until > Date.now()) ? v : null;
    }, null);
  }
  function remember(id, tok) {
    ls(function () { w.localStorage.setItem(KEY, JSON.stringify({ id: id, tok: tok, until: Date.now() + 55 * 60 * 1000 })); });
  }
  function forget() { ls(function () { w.localStorage.removeItem(KEY); }); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function show() {
    var g = d.getElementById('cw-opsgate'); if (g) { g.remove(); }
    d.documentElement.removeAttribute('data-cw-ops-shut');
    w.CW_OPS_OK = true;
    try { w.dispatchEvent(new Event('cw-ops-open')); } catch (e) {}
  }

  function draw(msg) {
    if (d.getElementById('cw-opsgate')) { return; }
    var box = d.createElement('div');
    box.id = 'cw-opsgate';
    box.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#1F699E;overflow:auto;'
      + "font-family:'DM Sans','Inter',system-ui,-apple-system,sans-serif;display:flex;"
      + 'align-items:center;justify-content:center;padding:24px;';
    box.innerHTML =
      '<div style="background:#fff;border-radius:16px;max-width:430px;width:100%;padding:26px 26px 24px;">'
      + '<div style="font-size:20px;font-weight:800;color:#1A2E42;margin-bottom:4px;">This page is for the people who run Creating.Works</div>'
      + '<div style="font-size:14.5px;color:#4B5A6D;line-height:1.55;margin-bottom:18px;">Put in the address on your record and we will send you a six digit code. It lasts fifteen minutes.</div>'
      + '<input id="cw-og-who" type="email" autocomplete="email" placeholder="you@example.com" style="width:100%;box-sizing:border-box;border:1.5px solid #DDE3EA;background:#F7FBFF;border-radius:10px;padding:11px 13px;font:inherit;font-size:16px;color:#1A2E42;">'
      + '<button id="cw-og-send" type="button" style="margin-top:12px;width:100%;font:inherit;font-size:15px;font-weight:700;padding:12px 18px;border-radius:24px;border:0;background:#1F699E;color:#fff;cursor:pointer;">Send my code</button>'
      + '<div id="cw-og-pinrow" style="display:none;margin-top:14px;">'
      +   '<input id="cw-og-pin" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="Six digits" style="width:100%;box-sizing:border-box;border:1.5px solid #DDE3EA;background:#F7FBFF;border-radius:10px;padding:11px 13px;font:inherit;font-size:16px;color:#1A2E42;">'
      +   '<button id="cw-og-go" type="button" style="margin-top:10px;width:100%;font:inherit;font-size:15px;font-weight:700;padding:12px 18px;border-radius:24px;border:1.5px solid #1F699E;background:#fff;color:#1F699E;cursor:pointer;">Confirm</button>'
      + '</div>'
      + '<div id="cw-og-say" style="font-size:13.5px;color:#4B5A6D;margin-top:12px;min-height:18px;"></div>'
      + '</div>';
    d.body.appendChild(box);

    var say = function (t, bad) {
      var n = d.getElementById('cw-og-say');
      if (n) { n.textContent = t || ''; n.style.color = bad ? '#7A2410' : '#4B5A6D'; }
    };
    if (msg) { say(msg); }
    var who = d.getElementById('cw-og-who');
    var was = ls(function () { return w.localStorage.getItem(WHO) || ''; }, '');
    if (was) { who.value = was; }

    var addr = function () { return (who.value || '').trim(); };

    d.getElementById('cw-og-send').onclick = function () {
      if (!addr()) { say('Put your address in first.', true); return; }
      say('Sending a code…');
      ls(function () { w.localStorage.setItem(WHO, addr()); });
      fetch(GS + '?action=sendOpsPin&email=' + encodeURIComponent(addr()) + '&t=' + Date.now())
        .then(function (r) { return r.json(); })
        .then(function () {
          d.getElementById('cw-og-pinrow').style.display = 'block';
          say('If that address can open this, a code is on its way. It lasts fifteen minutes.');
          d.getElementById('cw-og-pin').focus();
        })
        .catch(function () { say('Could not reach the server. Try again.', true); });
    };

    d.getElementById('cw-og-go').onclick = function () {
      var pin = (d.getElementById('cw-og-pin').value || '').trim();
      if (pin.length < 6) { say('Six digits.', true); return; }
      var btn = d.getElementById('cw-og-go');
      btn.disabled = true; say('Checking…');
      fetch(GS + '?action=verifyOpsPin&email=' + encodeURIComponent(addr())
            + '&code=' + encodeURIComponent(pin) + '&t=' + Date.now())
        .then(function (r) { return r.json(); })
        .then(function (dd) {
          btn.disabled = false;
          if (!dd || dd.status !== 'ok' || !dd.sessionToken) {
            say((dd && dd.message) || 'That code did not work.', true); return;
          }
          remember(dd.appearId || '', dd.sessionToken);
          w.CW_OPS_ID = dd.appearId || '';
          w.CW_OPS_TOKEN = dd.sessionToken;
          show();
        })
        .catch(function () { btn.disabled = false; say('Could not reach the server. Try again.', true); });
    };
  }

  var back = recall();
  if (!back) { draw(''); return; }

  fetch(GS + '?action=opsCheck&appearId=' + encodeURIComponent(back.id)
        + '&sessionToken=' + encodeURIComponent(back.tok) + '&t=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (dd) {
      if (dd && dd.status === 'ok' && dd.ok === true) {
        w.CW_OPS_ID = back.id; w.CW_OPS_TOKEN = back.tok; show(); return;
      }
      forget();
      draw('That sign-in has run out. Ask for a new code.');
    })
    .catch(function () { draw('We could not check that just now. Ask for a new code.'); });
})(window, document);
