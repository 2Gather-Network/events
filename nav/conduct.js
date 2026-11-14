(function (w, d) {
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var COC = w.location.origin + '/code-of-conduct.html';
  var INK = '#1A2E42', SOFT = '#2F3D4F', BRAND = '#1F699E';
  var FONT = '"Nunito Sans","DM Sans",system-ui,sans-serif';
  var BTN = 'font:inherit;font-size:15px;font-weight:700;padding:11px 20px;border-radius:24px;cursor:pointer;';
  function ls(k) { try { return w.localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function el(tag, css, text) { var x = d.createElement(tag); if (css) { x.style.cssText = css; } if (text) { x.textContent = text; } return x; }
  function link(text, css) { var a = el('a', css, text); a.href = COC; a.target = '_blank'; a.rel = 'noopener'; return a; }

  function backTo() {
    try {
      var r = d.referrer || '';
      if (r && r.indexOf(w.location.href.split('#')[0]) !== 0) { return r; }
    } catch (e) {}
    return w.location.origin + '/events/';
  }

  function ask(site) {
    if (d.getElementById('cw-coc')) { return; }
    var shade = el('div', 'position:fixed;inset:0;z-index:100003;background:rgba(26,46,66,.55);display:flex;align-items:flex-start;justify-content:center;padding:56px 16px;overflow:auto;');
    shade.id = 'cw-coc';
    var card = el('div', 'background:#fff;border-radius:18px;max-width:520px;width:100%;box-sizing:border-box;padding:26px 24px 22px;color:' + INK + ';font:400 16px/1.55 ' + FONT + ';');
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true'); card.setAttribute('aria-labelledby', 'cw-coc-h');
    var h = el('h2', 'font-size:22px;font-weight:800;margin:0 0 12px;line-height:1.25;', 'Before you meet people on ' + site);
    h.id = 'cw-coc-h'; h.tabIndex = -1;
    card.appendChild(h);
    card.appendChild(el('p', 'margin:0 0 18px;', site + ' is you engaging with other people. Because of that, we have a Code of Conduct for how we treat each other here. We would love you to read it. When you have, tell us below.'));
    var row = el('div', 'display:flex;flex-wrap:wrap;gap:10px;align-items:center;');
    var OUT = BTN + 'display:inline-block;text-decoration:none;border:1.5px solid ' + BRAND + ';background:#fff;color:' + BRAND + ';';
    var FILL = BTN + 'display:inline-block;text-decoration:none;border:1.5px solid ' + BRAND + ';background:' + BRAND + ';color:#fff;';
    var read = link('Take me to Code of Conduct', OUT);
    read.addEventListener('click', function () { read.style.cssText = FILL; });
    var yes = el('button', OUT, 'I agree to the Code of Conduct');
    yes.type = 'button';
    var done = el('button', OUT, 'Done');
    done.type = 'button'; done.style.display = 'none';
    done.onclick = function () { close(); };
    row.appendChild(read); row.appendChild(yes);
    card.appendChild(row);
    var say = el('div', 'font-size:14px;color:#A32D2D;min-height:20px;margin-top:10px;');
    say.setAttribute('role', 'status');
    card.appendChild(say);
    var foot = el('div', 'display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:14px;');
    var later = el('a', 'font-size:14px;font-weight:700;color:' + BRAND + ';text-decoration:underline;', 'Not now, take me back');
    later.href = backTo();
    foot.appendChild(later); foot.appendChild(done);
    card.appendChild(foot);
    shade.appendChild(card);
    d.body.appendChild(shade);
    var tb = d.getElementById('cw-topbar'), tbZ = tb ? tb.style.zIndex : '';
    if (tb) {
      tb.style.zIndex = '100004';
      try { shade.style.paddingTop = Math.max(56, Math.round(tb.getBoundingClientRect().bottom) + 16) + 'px'; } catch (e) {}
    }
    function close() { shade.remove(); if (tb) { tb.style.zIndex = tbZ; } }
    try { h.focus(); } catch (e) {}

    yes.onclick = function () {
      var id = ls('cw-id'), token = ls('cw-token');
      if (!id || !token) { say.textContent = 'Sign in again, then press this once more.'; return; }
      yes.disabled = true; yes.style.cssText = FILL; yes.textContent = 'Saving...'; say.textContent = '';
      w.fetch(GS + '?action=saveAccount&ackConduct=1&secure=1&appearId=' + encodeURIComponent(id) + '&editToken=' + encodeURIComponent(token), { referrerPolicy: 'no-referrer' })
        .then(function (r) { return r.json(); })
        .then(function (r) {
          if (r && r.status === 'ok' && r.conductOk) {
            try { w.localStorage.setItem('cw-conduct', 'yes'); } catch (e) {}
            yes.textContent = 'I agree to the Code of Conduct';
            done.style.display = 'inline-block';
            return;
          }
          yes.disabled = false; yes.style.cssText = OUT; yes.textContent = 'I agree to the Code of Conduct';
          say.textContent = (r && r.message) || 'That did not save. Try again.';
        })
        .catch(function () { yes.disabled = false; yes.style.cssText = OUT; yes.textContent = 'I agree to the Code of Conduct'; say.textContent = 'That did not save. Try again.'; });
    };
  }

  function carry(site, from) {
    if (d.getElementById('cw-coc-carry')) { return; }
    var box = el('div', 'position:fixed;left:16px;right:16px;bottom:16px;z-index:100001;max-width:420px;margin:0 auto;background:#fff;border:1px solid #C3D0DB;border-radius:14px;box-shadow:0 6px 24px rgba(26,46,66,.18);padding:14px 16px;color:' + INK + ';font:400 15px/1.5 ' + FONT + ';');
    box.id = 'cw-coc-carry'; box.setAttribute('role', 'status');
    box.appendChild(el('div', 'margin-bottom:10px;', 'You read the Code of Conduct on 2' + from + '. It applies here on ' + site + ' too.'));
    var row = el('div', 'display:flex;gap:14px;align-items:center;flex-wrap:wrap;');
    row.appendChild(link('Read it again', 'font-size:14px;font-weight:700;color:' + BRAND + ';'));
    var ok = el('button', BTN + 'font-size:14px;padding:8px 18px;border:0;background:' + BRAND + ';color:#fff;', 'Got it');
    ok.type = 'button'; ok.onclick = function () { box.remove(); };
    row.appendChild(ok);
    box.appendChild(row);
    d.body.appendChild(box);
  }

  w.CW_conduct = function (nm, mode, from) {
    var site = '2' + nm;
    var go = function () { if (mode === 'ask') { ask(site); } else if (mode === 'carry' && from) { carry(site, from); } };
    if (d.body) { go(); } else { d.addEventListener('DOMContentLoaded', go); }
  };
})(window, document);
