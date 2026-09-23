(function () {
  var CLIENT_ID = '702611145180-r2f9ntdg8sg7u3o7ktdfnvdgaafukm9n.apps.googleusercontent.com';
  var GS_URL = 'https://cw-api-gate.jessieupp.workers.dev';

  function wanted() {
    try { return new URLSearchParams(location.search).get('google') !== '0'; } catch (e) { return true; }
  }
  function refParam() {
    try {
      var k = JSON.parse(localStorage.getItem('cw-ref') || 'null');
      if (!k || !k.r || !/^[0-9a-z]{6}$/.test(k.r) || !(Date.now() - Number(k.at) < 30 * 86400000)) return '';
      return '&ref=' + encodeURIComponent(k.r) + (k.eventId ? '&refEvent=' + encodeURIComponent(k.eventId) : '');
    } catch (e) { return ''; }
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function finish(d, next) {
    try {
      localStorage.setItem('cw-id', d.appearId);
      localStorage.setItem('appear-id', d.appearId);
      if (d.name) { localStorage.setItem('cw-first', String(d.name).split(' ')[0]); }
      if (d.editToken) {
        localStorage.setItem('cw-token', d.editToken);
        var norm = String(d.appearId).split('.').join('').toLowerCase();
        var exp = parseInt(String(d.editToken).split('.')[1], 10);
        if (!exp || exp < Date.now()) { exp = Date.now() + 60 * 60 * 1000; }
        localStorage.setItem('cw-edit-' + norm, JSON.stringify({ t: d.editToken, exp: exp }));
      }
    } catch (e) {}
    var go = function (where) {
      window.location.href = where;
    };
    try { CW.firstStop(d.appearId, next, go); } catch (e) { go(next); }
  }

  function styles() {
    if (document.getElementById('cw-g-css')) return;
    var st = document.createElement('style');
    st.id = 'cw-g-css';
    st.textContent = '.cw-g-btn{display:flex;justify-content:center;min-height:44px;}'
      + '.cw-g-or{display:flex;align-items:center;gap:10px;color:#8A97A6;font-size:13px;margin:16px 0;}'
      + '.cw-g-or::before,.cw-g-or::after{content:"";flex:1;height:1px;background:#DDE3EA;}'
      + '.cw-g-new .tick{display:flex;align-items:flex-start;gap:10px;font-size:14px;font-weight:500;margin:0 0 10px;line-height:1.45;cursor:pointer;}'
      + '.cw-g-new .tick a{color:#1F699E;font-weight:700;}'
      + '.cw-g-new .tick input{width:18px;height:18px;flex-shrink:0;margin:1px 0 0;accent-color:#1F699E;}'
      + '.cw-g-new .cw-g-other{background:#fff;color:#1F699E;box-shadow:inset 0 0 0 1.5px #1F699E;margin-top:10px;}'
      + '.cw-g-wait{display:none;justify-content:center;margin-top:12px;}'
      + '.cw-g-pill{display:inline-flex;align-items:center;gap:8px;background:#1F699E;color:#fff;font-size:13px;font-weight:700;'
      +   'padding:8px 16px;border-radius:20px;white-space:nowrap;animation:cw-g-breathe 1.6s ease-in-out infinite;}'
      + '@keyframes cw-g-breathe{0%,100%{opacity:1}50%{opacity:.62}}'
      + '@media (prefers-reduced-motion: reduce){.cw-g-pill{animation:none;}}';
    document.head.appendChild(st);
  }

  window.cwGoogleMount = function (opts) {
    if (!wanted()) return;
    styles();
    var slot = opts && opts.slot;
    if (!slot) return;
    slot.hidden = false;
    var say = function (m) {
      var el = slot.querySelector('.cw-g-say');
      if (el) { el.textContent = m || ''; el.style.display = m ? 'block' : 'none'; }
    };
    slot.innerHTML = '<div class="cw-g-btn"></div><div class="say bad cw-g-say" style="display:none"></div>'
                   + '<div class="cw-g-or">or</div>';
    if (!CLIENT_ID) { say('Sign in with Google is not set up yet: it needs its Client ID. Use the emailed code.'); return; }

    var credential = '';
    function ask(action, extra) {
      return fetch(GS_URL + '?action=' + action + '&credential=' + encodeURIComponent(credential) + (extra || '') + refParam())
        .then(function (r) { return r.json(); });
    }
    function handle(resp) {
      credential = String((resp && resp.credential) || '');
      if (!credential) { say('Google did not answer. Try again.'); return; }
      say('');
      var btn = slot.querySelector('.cw-g-btn');
      if (btn) btn.style.opacity = '.5';
      waiting(true);
      ask('googleSignin').then(function (d) {
        if (d && d.status === 'ok' && d.appearId) { finish(d, opts.next || '/events/'); return; }
        waiting(false);
        if (btn) btn.style.opacity = '';
        if (d && d.status === 'new') { askNew(d); return; }
        say((d && d.message) || 'That did not go through. Try again, or use the emailed code.');
      }).catch(function () {
        waiting(false);
        if (btn) btn.style.opacity = '';
        say('That did not go through. Try again, or use the emailed code.');
      });
    }
    function waiting(on) {
      var w = slot.querySelector('.cw-g-wait');
      if (!w) {
        w = document.createElement('div');
        w.className = 'cw-g-wait';
        w.innerHTML = '<span class="cw-g-pill">Signing you in...</span>';
        slot.insertBefore(w, slot.querySelector('.cw-g-or'));
      }
      w.style.display = on ? 'flex' : 'none';

      var or = slot.querySelector('.cw-g-or');
      if (or) { if (on) { or.setAttribute('data-cw-g-was', or.style.display || ''); or.style.display = 'none'; }
                else if (or.hasAttribute('data-cw-g-was')) { or.style.display = or.getAttribute('data-cw-g-was'); or.removeAttribute('data-cw-g-was'); } }

      var sib = slot.nextElementSibling;
      while (sib) {
        if (on) {
          if (!sib.hasAttribute('data-cw-g-below')) {
            sib.setAttribute('data-cw-g-below', sib.style.display || '');
            sib.style.display = 'none';
          }
        } else if (sib.hasAttribute('data-cw-g-below')) {
          sib.style.display = sib.getAttribute('data-cw-g-below');
          sib.removeAttribute('data-cw-g-below');
        }
        sib = sib.nextElementSibling;
      }

      [].slice.call(document.querySelectorAll('.say')).forEach(function (el) {
        if (slot.contains(el)) return;
        if (on) { if (el.style.display !== 'none') { el.setAttribute('data-cw-g-was', el.style.display || ''); el.style.display = 'none'; } }
        else if (el.hasAttribute('data-cw-g-was')) { el.style.display = el.getAttribute('data-cw-g-was'); el.removeAttribute('data-cw-g-was'); }
      });
    }

    function askNew(d) {
      var card = opts.card || slot.parentNode;
      var box = document.createElement('div');
      box.className = 'cw-g-new';
      box.innerHTML =
          '<h1>Welcome to 2Gather</h1>'
        + '<p class="lede">We do not have ' + esc(d.email) + ' yet.</p>'
        + '<label class="tick"><input type="checkbox" class="cw-g-agree"><span>I agree to the <a href="https://2gather.network/terms-of-service.html">Terms of Service</a>, <a href="https://2gather.network/privacy-policy.html">Privacy Policy</a> and <a href="https://2gather.network/code-of-conduct.html">Code of Conduct</a>.</span></label>'
        + '<label class="tick"><input type="checkbox" class="cw-g-age"> I confirm that I am at least 18 years of age or older.</label>'
        + '<button type="button" class="cw-g-create">Create my account</button>'
        + '<button type="button" class="cw-g-other">Use a different account</button>'
        + '<div class="say bad cw-g-say2" style="display:none"></div>';
      var kids = [].slice.call(card.children);
      kids.forEach(function (k) { k.setAttribute('data-cw-g-hid', k.hidden ? '1' : '0'); k.setAttribute('data-cw-g-disp', k.style.display || ''); k.hidden = true; k.style.display = 'none'; });
      card.appendChild(box);
      var say2 = function (m) { var el = box.querySelector('.cw-g-say2'); el.textContent = m || ''; el.style.display = m ? 'block' : 'none'; };
      box.querySelector('.cw-g-other').onclick = function () {
        box.remove();
        kids.forEach(function (k) { k.hidden = k.getAttribute('data-cw-g-hid') === '1'; k.style.display = k.getAttribute('data-cw-g-disp') || ''; k.removeAttribute('data-cw-g-hid'); k.removeAttribute('data-cw-g-disp'); });
        try { google.accounts.id.prompt(); } catch (e) {}
      };
      box.querySelector('.cw-g-create').onclick = function () {
        if (!box.querySelector('.cw-g-agree').checked) { say2('Please read the terms and tick the box to agree.'); return; }
        if (!box.querySelector('.cw-g-age').checked) { say2('Please confirm you are 18 or over.'); return; }
        var b = this; b.disabled = true; b.textContent = 'Creating your account...'; say2('');
        ask('googleSignup', '&terms=1&age=1').then(function (r) {
          if (r && r.status === 'ok' && r.appearId) { finish(r, opts.nextNew || '/events/'); return; }
          b.disabled = false; b.textContent = 'Create my account';
          say2((r && r.message) || 'That did not go through. Try once more.');
        }).catch(function () { b.disabled = false; b.textContent = 'Create my account'; say2('That did not go through. Try once more.'); });
      };
    }

    var s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = function () {
      try {
        google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handle, ux_mode: 'popup', auto_select: true, cancel_on_tap_outside: true });
        var w = Math.min(400, Math.max(200, Math.round(slot.getBoundingClientRect().width || 320)));
        google.accounts.id.renderButton(slot.querySelector('.cw-g-btn'),
          { theme: 'outline', size: 'large', shape: 'pill', text: opts.mode === 'signup' ? 'signup_with' : 'continue_with', width: w });
        if (opts.mode === 'signin') { try { google.accounts.id.prompt(); } catch (e) {} }
      } catch (e) { say('Google sign-in did not load. Use the emailed code.'); }
    };
    s.onerror = function () { say('Google sign-in did not load. Use the emailed code.'); };
    document.head.appendChild(s);
  };
})();
