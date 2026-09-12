/*  Version: V1.00 | Date: 2026-09-12 | LAST CHANGE: Sign in with Google, for Sign in and Sign up, behind ?google=1.

    SIGN IN WITH GOOGLE. Jessie, 2026-09-12: "add gmail sign in next", then, of the design (row 149), "149 yes".
    One file for both pages, so the button, its Client ID and what happens after it live in one place.

    Continue with Google sits above the email box. Google's own window asks which account and hands this page a
    signed note saying which address it is; the backend asks Google whether the note is genuine (googleSignin in
    Code.js). An address we know signs straight in, the same as a right code. An address we do not know is asked,
    Create my account or Use a different account, with the terms and 18 or over ticked first, and nothing is
    created until Create my account is pressed. The emailed code stays for everybody else.

    Only with ?google=1 in the address until Jessie has tried it; nobody else sees any of it.
*/
(function () {
  // The same Client ID as GOOGLE_CLIENT_ID in Code.js. Not a secret. Empty until the Google Cloud setting is made.
  var CLIENT_ID = '';
  var GS_URL = 'https://cw-api-gate.jessieupp.workers.dev';

  function wanted() {
    try { return new URLSearchParams(location.search).get('google') === '1'; } catch (e) { return false; }
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

  // Signed in: kept on this device exactly as a right code keeps it (see verify() on both pages), then on to
  // where they were headed, or to the five questions when the profile is empty.
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
      var sep = where.indexOf('?') > -1 ? '&' : '?';
      window.location.href = where + sep + 'CWid=' + encodeURIComponent(d.appearId);
    };
    try { CW.firstStop(d.appearId, next, go); } catch (e) { go(next); }
  }

  // Its own few styles, so both pages draw it the same (Sign in has no tick boxes of its own).
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
      + '.cw-g-new .cw-g-other{background:#fff;color:#1F699E;box-shadow:inset 0 0 0 1.5px #1F699E;margin-top:10px;}';
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
      ask('googleSignin').then(function (d) {
        if (btn) btn.style.opacity = '';
        if (d && d.status === 'ok' && d.appearId) { finish(d, opts.next || '/welcome/'); return; }
        if (d && d.status === 'new') { askNew(d); return; }
        say((d && d.message) || 'That did not go through. Try again, or use the emailed code.');
      }).catch(function () {
        if (btn) btn.style.opacity = '';
        say('That did not go through. Try again, or use the emailed code.');
      });
    }

    // AN ADDRESS WE DO NOT KNOW IS ASKED. Nothing is created until Create my account is pressed, and the terms
    // and 18 or over are ticked there, as on Sign up.
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
      kids.forEach(function (k) { k.setAttribute('data-cw-g-hid', k.hidden ? '1' : '0'); k.hidden = true; });
      card.appendChild(box);
      var say2 = function (m) { var el = box.querySelector('.cw-g-say2'); el.textContent = m || ''; el.style.display = m ? 'block' : 'none'; };
      box.querySelector('.cw-g-other').onclick = function () {
        box.remove();
        kids.forEach(function (k) { k.hidden = k.getAttribute('data-cw-g-hid') === '1'; k.removeAttribute('data-cw-g-hid'); });
        try { google.accounts.id.prompt(); } catch (e) {}
      };
      box.querySelector('.cw-g-create').onclick = function () {
        if (!box.querySelector('.cw-g-agree').checked) { say2('Please read the terms and tick the box to agree.'); return; }
        if (!box.querySelector('.cw-g-age').checked) { say2('Please confirm you are 18 or over.'); return; }
        var b = this; b.disabled = true; b.textContent = 'One moment…'; say2('');
        ask('googleSignup', '&terms=1&age=1').then(function (r) {
          if (r && r.status === 'ok' && r.appearId) { finish(r, opts.nextNew || '/profile-edit/'); return; }
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
        google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handle, ux_mode: 'popup', auto_select: false });
        var w = Math.min(400, Math.max(200, Math.round(slot.getBoundingClientRect().width || 320)));
        google.accounts.id.renderButton(slot.querySelector('.cw-g-btn'),
          { theme: 'outline', size: 'large', shape: 'pill', text: opts.mode === 'signup' ? 'signup_with' : 'continue_with', width: w });
      } catch (e) { say('Google sign-in did not load. Use the emailed code.'); }
    };
    s.onerror = function () { say('Google sign-in did not load. Use the emailed code.'); };
    document.head.appendChild(s);
  };
})();
