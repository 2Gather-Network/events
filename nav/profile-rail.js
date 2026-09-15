/*  Version: V1.00 | Date: 2026-09-14 | LAST CHANGE: one rail for My profile and My account, in the template.

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
      + 'html.cw-prail-on .cw-prail-list button:focus-visible,html.cw-prail-on .cw-prail-seg a:focus-visible{outline:2px solid #1F699E;outline-offset:2px;}'
      + '@media(max-width:860px){html.cw-prail-on .cw-prail{grid-template-columns:1fr;}'
      +   'html.cw-prail-on .cw-prail-rail{position:static;}'
      +   'html.cw-prail-on .cw-prail-list{flex-direction:row;flex-wrap:wrap;}'
      +   'html.cw-prail-on .cw-prail-list button{width:auto;}'
      +   'html.cw-prail-on .cw-prail-main{padding:4px 14px 14px;}}';
    document.head.appendChild(st);
  }
  function go(url) { window.location.href = url; return false; }

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
      { key: 'profile', label: 'My profile', url: 'https://2gather.network/ikigai/' },
      { key: 'account', label: 'My account', url: 'https://2gather.network/account/' },
      { key: 'support', label: 'Support', url: 'https://2gather.network/support?from=' + encodeURIComponent(location.pathname) },
      // Sign out acts on whoever is really signed in, so it is not offered while looking at somebody else.
      { key: 'signout', label: 'Sign out', out: true }
    ];
    items.forEach(function (it) {
      if (it.out && opts.viewingSomeoneElse) return;
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
