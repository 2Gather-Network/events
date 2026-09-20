/*  Version: V1.05 | Date: 2026-09-20 | LAST CHANGE: the dot stands away from the word. Jessie: "Make dots a little farther away from the solutions". On a phone the rail wraps into a row of short buttons, and a floated dot with no margin sits against the last letter of Gather and License. 12px, which is the same gap the rows use between anything else.
    V1.04 | Date: 2026-09-20 | LAST CHANGE: My profile first, SOLUTIONS rather than PRODUCTS, Support and Sign out off, and Global permissions opens the permissions step itself. Her four, in one message. Support and Sign out moved into the name menu in the top bar this morning and the same row in two places is a row nobody finds in either. Global permissions opens that step rather than a copy of it: the way to look exactly like a screen is to BE it, and a second copy would be two screens writing one set of columns.
    V1.03 | Date: 2026-09-20 | LAST CHANGE: My profile joins the account shape, opening the answers at Joy. My info is what is TRUE about you; My profile is what you have TOLD people.
    V1.02 | Date: 2026-09-20 | LAST CHANGE: a second shape, for the account page. shape:'account' draws ACCOUNT (My info, Global permissions, Support, Sign out) and PRODUCTS (Balance, Appear, Gather, License, each with a dot). My events, My groups and My profile come OFF it: they moved into the menu under her name in the top bar the same morning, and a shortcut in two places is a shortcut nobody can find in either. My profile still draws the rail it has always drawn - only a page asking for the account shape gets this one - and a page can hand in onPick to keep the press for itself, which is how the product panes open without a page load.
    V1.01 | Date: 2026-09-15 | LAST CHANGE: My permissions between My profile and My account, a preview for a super admin only.
    V1.00 | Date: 2026-09-14 | LAST CHANGE: one rail for My profile and My account, in the template.

    ONE RAIL FOR YOUR OWN PAGES. Jessie, 2026-09-14, of the profile in the template (?look=rail): "Should be in thsi order:
    My profile / My account / Support / Sign out", "Top two shouls change from Calendar My events to My events and My
    groups", "my account should look exactllyt eh same rail, excep the pane shouodl change" and "the rail should stay the
    same when toggling to my account". So both pages draw this one rail from this one file, and only the panel beside it
    is theirs. Published 2026-09-15 ("publish new look for profile/account pages too"): each page draws it unless ?look=list.

    cwProfileRail({ active: 'profile' | 'account', wrap: element, viewingSomeoneElse: bool }) moves everything in wrap
    into the white panel and draws the rail beside it. It returns the panel. Nothing is fetched.
*/
(function () {
  function styles() {
    if (document.getElementById('cw-prail-css')) return;
    var st = document.createElement('style');
    st.id = 'cw-prail-css';
    st.textContent =
        'html.cw-prail-on .cw-prail{display:grid;grid-template-columns:320px minmax(0,1fr);gap:18px;align-items:start;max-width:1200px;margin:0 auto;}'
      + 'html.cw-prail-on .cw-prail-rail{background:#fff;border-radius:14px;padding:12px;position:sticky;top:16px;box-sizing:border-box;}'
      + 'html.cw-prail-on .cw-prail-main{background:#fff;border-radius:14px;padding:4px 22px 18px;min-height:420px;min-width:0;box-sizing:border-box;}'
      + 'html.cw-prail-on .cw-prail-seg{display:flex;gap:6px;margin:4px 2px 14px;}'
      + 'html.cw-prail-on .cw-prail-seg a{flex:1;background:#fff;color:#1F699E;border:1.5px solid #C9D6E2;border-radius:9px;font-size:13px;'
      +   'font-weight:700;padding:8px 4px;text-align:center;text-decoration:none;cursor:pointer;font-family:inherit;}'
      + 'html.cw-prail-on .cw-prail-list{display:flex;flex-direction:column;gap:6px;}'
      + 'html.cw-prail-on .cw-prail-list button{display:block;width:100%;box-sizing:border-box;text-align:left;background:#fff;color:#1F699E;'
      +   'border:1.5px solid #C9D6E2;border-radius:10px;font-family:inherit;font-size:14px;font-weight:700;padding:10px 14px;cursor:pointer;}'
      + 'html.cw-prail-on .cw-prail-list button.on{background:#1F699E;color:#fff;border-color:#1F699E;cursor:default;}'
      + 'html.cw-prail-on .cw-prail-head{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6B7A8D;margin:16px 12px 7px;}'
      + 'html.cw-prail-on .cw-prail-dot{float:right;width:9px;height:9px;border-radius:50%;background:#B9C4D2;margin:6px 0 0 12px;}'
      + 'html.cw-prail-on .cw-prail-list button.on .cw-prail-dot{box-shadow:0 0 0 2px rgba(255,255,255,.35);}'
      /* MORE ORANGE, LESS RED. Jessie, 2026-09-20: "make these dots more organe than red". #C2410C
         is the accessible orange-red she picked yesterday and against white it reads as red; this
         is the same family, two steps warmer. */
      + 'html.cw-prail-on .cw-prail-dot.on{background:#E2711D;}'
      + 'html.cw-prail-on .cw-prail-list button:focus-visible,html.cw-prail-on .cw-prail-seg a:focus-visible{outline:2px solid #1F699E;outline-offset:2px;}'
      + '@media(max-width:860px){html.cw-prail-on .cw-prail{grid-template-columns:1fr;}'
      +   'html.cw-prail-on .cw-prail-rail{position:static;}'
      +   'html.cw-prail-on .cw-prail-list{flex-direction:row;flex-wrap:wrap;}'
      +   'html.cw-prail-on .cw-prail-list button{width:auto;}'
      +   'html.cw-prail-on .cw-prail-main{padding:4px 14px 14px;}}';
    document.head.appendChild(st);
  }
  function go(url) { window.location.href = url; return false; }

  // THE TOKEN THE EMAILED CODE MINTS AT SIGN-IN, checked for its expiry and for there being a person
  // on this device at all. Copied here deliberately rather than shared with the top bar: this file is
  // loaded on pages where that one is not, and a permission check that leans on another file being
  // present is not a check. Jessie, 2026-09-19: "Make sure that the super admin controls are only
  // available to authenticated super admin with pin".
  function _cwProven() {
    try {
      var t = String(localStorage.getItem('cw-token') || '');
      if (!t) return false;
      var exp = parseInt(t.split('.')[1], 10);
      if (!exp || Date.now() > (exp - 60000)) return false;
      return !!String(localStorage.getItem('cw-id') || '').trim();
    } catch (e) { return false; }
  }

  window.cwProfileRail = function (opts) {
    opts = opts || {};
    var have = document.getElementById('cw-prail-main');
    if (have) return have;
    var wrap = opts.wrap;
    if (!wrap) return null;
    styles();
    document.documentElement.classList.add('cw-prail-on');
    var grid = document.createElement('div'); grid.className = 'cw-prail';
    var rail = document.createElement('aside'); rail.className = 'cw-prail-rail'; rail.id = 'cw-prail';
    var main = document.createElement('section'); main.className = 'cw-prail-main'; main.id = 'cw-prail-main';
    while (wrap.firstChild) main.appendChild(wrap.firstChild);
    grid.appendChild(rail); grid.appendChild(main); wrap.appendChild(grid);

    /* ── THE ACCOUNT SHAPE ─────────────────────────────────────────────────────────────────────
       Jessie, 2026-09-20: the account page's rail becomes ACCOUNT (My info, Global permissions,
       Support, Sign out) and PRODUCTS (Balance, Appear, Gather, License). My events, My groups and
       My profile come OFF it, because they moved into the menu under her name in the top bar the
       same morning, and a shortcut in two places is a shortcut nobody can find in either.

       ONE FILE, TWO SHAPES. My profile still draws the rail it has always drawn; only a page that
       asks for shape 'account' gets this one. A page can hand in onPick and keep the press for
       itself rather than have the rail navigate away, which is how the four product panes open
       without a page load. */
    if (opts.shape === 'account') {
      var GROUPS = [
        /* Jessie, 2026-09-20, in one message: "make my profile first on left rail", "Make PRODUCTS
           say SOLUTIONS", "remove support and sign out on rail", "Global persmisison should look
           lkike /ikigai/?perm=1&step=permissions".

           MY PROFILE FIRST, because it is the one somebody comes here to open; My info is what
           they check once a year. SUPPORT AND SIGN OUT COME OFF, because they moved into the menu
           under her name in the top bar this morning and the same row in two places is a row
           nobody finds in either. SOLUTIONS, not products, her word since the first draft.

           AND GLOBAL PERMISSIONS OPENS THE PERMISSIONS STEP rather than a copy of it. She asked
           twice for it to LOOK like that screen, and the way to look exactly like a screen is to
           BE it: that one already holds the audience tray, the name and place choices, the
           switches and a save that redraws from what the backend actually stored. Building a
           second one here would be two screens writing one set of columns, and the first time one
           gained a field the other had not, a save from the older screen would write an empty
           value over a real answer. */
        ['ACCOUNT', [
          { key: 'myprofile',   label: 'My profile', url: 'https://2gather.network/ikigai/?perm=1&step=joy' },
          { key: 'account',     label: 'My info' },
          { key: 'permissions', label: 'Global permissions', url: 'https://2gather.network/ikigai/?perm=1&step=permissions' }
        ]],
        ['SOLUTIONS', [
          { key: 'balance', label: 'Balance', dot: false },
          { key: 'appear',  label: 'Appear',  dot: false },
          { key: 'gather',  label: 'Gather',  dot: true  },
          { key: 'license', label: 'License', dot: true  }
        ]]
      ];
      GROUPS.forEach(function (g) {
        var head = document.createElement('div');
        head.className = 'cw-prail-head'; head.textContent = g[0];
        rail.appendChild(head);
        var box = document.createElement('div'); box.className = 'cw-prail-list';
        g[1].forEach(function (it) {
          if (it.out && opts.viewingSomeoneElse) { return; }
          var b = document.createElement('button'); b.type = 'button';
          b.appendChild(document.createTextNode(it.label));
          if (typeof it.dot === 'boolean') {
            var d = document.createElement('span');
            d.className = 'cw-prail-dot' + (it.dot ? ' on' : '');
            b.appendChild(d);
          }
          if (it.key === opts.active) { b.className = 'on'; b.setAttribute('aria-current', 'page'); }
          b.setAttribute('data-prail', it.key);
          b.onclick = function () {
            if (it.out) {
              try { if (window.CW && window.CW.forget) { window.CW.forget(); } } catch (e) {}
              go('https://2gather.network/signin/?out=1');
              return;
            }
            if (it.url) { go(it.url); return; }
            if (!opts.onPick) { return; }
            var all = rail.querySelectorAll('[data-prail]');
            for (var i = 0; i < all.length; i++) {
              all[i].className = (all[i].getAttribute('data-prail') === it.key) ? 'on' : '';
            }
            opts.onPick(it.key);
          };
          box.appendChild(b);
        });
        rail.appendChild(box);
      });
      return main;
    }

    var seg = document.createElement('div'); seg.className = 'cw-prail-seg';
    [['My events', 'https://2gather.network/myevents/'], ['My groups', 'https://2gather.network/mygroups/']].forEach(function (t) {
      var a = document.createElement('a');
      a.setAttribute('role', 'link'); a.tabIndex = 0; a.textContent = t[0];
      a.onclick = function () { return go(t[1]); };
      a.onkeydown = function (e) { if (e.key === 'Enter') go(t[1]); };
      seg.appendChild(a);
    });
    rail.appendChild(seg);

    var list = document.createElement('div'); list.className = 'cw-prail-list';
    var items = [
      { key: 'profile', label: 'My profile', url: 'https://2gather.network/me/' },
      // MY PERMISSIONS, below My profile and above My account. Jessie, 2026-09-15: "have this as an opt-in within permissions
      // tab which will be added below My profile and above my account say "My permissions"". A preview while it is designed:
      // shown only to a super admin (the top bar's cw-super), and it opens the Permissions step on the intro, which saves nothing.
      { key: 'permissions', label: 'My permissions', url: 'https://2gather.network/ikigai/?perm=1&step=permissions', superOnly: true },
      { key: 'account', label: 'My account', url: 'https://2gather.network/account/' },
      { key: 'support', label: 'Support', url: 'https://2gather.network/support?from=' + encodeURIComponent(location.pathname) },
      // Sign out acts on whoever is really signed in, so it is not offered while looking at somebody else.
      { key: 'signout', label: 'Sign out', out: true }
    ];
    items.forEach(function (it) {
      if (it.out && opts.viewingSomeoneElse) return;
      // AND A SUPER-ONLY BUTTON NEEDS A PROVEN SESSION, not a remembered word. Same change as the top
      // bar's admin strip in V6.11 and for the same reason: cw-super was written from an id alone and
      // then stood for ever. No live sign-in for this device, no super-only button.
      if (it.superOnly) { var _su = ''; try { _su = localStorage.getItem('cw-super') || ''; } catch (e) {} if (_su !== 'yes' || !_cwProven() || opts.viewingSomeoneElse) return; }
      var b = document.createElement('button'); b.type = 'button'; b.textContent = it.label;
      if (it.key === opts.active) { b.className = 'on'; b.setAttribute('aria-current', 'page'); }
      b.onclick = function () {
        if (it.key === opts.active) return;
        if (it.out) {
          try { if (window.CW && window.CW.forget) { window.CW.forget(); } } catch (e) {}
          go('https://2gather.network/signin/?out=1');
          return;
        }
        go(it.url);
      };
      list.appendChild(b);
    });
    rail.appendChild(list);
    return main;
  };
})();
