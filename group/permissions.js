(function () {
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var ctx = null, box = null, state = null, saveT = 0;
  function el(tag, style, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }
  function token() {
    try {
      var norm = String((ctx && ctx.meId) || '').split('.').join('').toLowerCase();
      var raw = localStorage.getItem('cw-edit-' + norm);
      if (raw) { var o = JSON.parse(raw); if (o && o.t) return o.t; }
      return localStorage.getItem('cw-token') || '';
    } catch (e) { return ''; }
  }
  function nameParts() {
    var full = '';
    try { full = String(localStorage.getItem('cw-name') || localStorage.getItem('cw-first') || '').trim(); } catch (e) {}
    var p = full.split(/\s+/).filter(Boolean);
    return {
      full: full || 'Your full name',
      short: p.length > 1 ? p[0] + ' ' + p[p.length - 1].charAt(0) + '.' : (p[0] || 'Your first name'),
      initials: p.map(function (w) { return w.charAt(0).toUpperCase(); }).join('') || 'Your initials'
    };
  }
  var LEVELS = ['city', 'county', 'state', 'country'];
  function placeFor(level) {
    var pr = (state && state.profile) || {}, loc = String(pr.location || '').trim();
    var bits = loc.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    var st = bits.length > 1 && bits[bits.length - 1] === 'United States' ? bits[0] : '';
    if (level === 'city' && pr.city) return [pr.city, st].filter(Boolean).join(', ');
    if (level === 'county' && pr.county) return [pr.county, st].filter(Boolean).join(', ');
    if (level === 'state' && loc) return loc;
    if (level === 'country' && loc) return bits[bits.length - 1] || '';
    return '';
  }
  function pill(label, on, fn) {
    var b = el('button', 'font:inherit;font-size:13.5px;padding:8px 14px;border-radius:20px;cursor:pointer;margin:0 7px 7px 0;'
      + (on ? 'background:#1F699E;border:1px solid #1F699E;color:#fff;font-weight:700;' : 'background:#fff;border:1px solid #C9DFF3;color:#1F699E;font-weight:600;'), label);
    b.type = 'button';
    b.onclick = fn;
    return b;
  }
  function say(t, bad) {
    var s = document.getElementById('gp-permissions-status');
    if (s) { s.textContent = t; s.style.color = bad ? '#7A2410' : '#4B5A6D'; }
  }
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      var qs = 'action=savePermissions&appearId=' + encodeURIComponent(ctx.meId) + '&editToken=' + encodeURIComponent(token())
        + '&audience=' + encodeURIComponent(ctx.groupId) + '&nameShown=' + encodeURIComponent(state.name) + '&placeShown=' + encodeURIComponent(state.where);
      fetch(GS + '?' + qs).then(function (r) { return r.json(); }).then(function (d) {
        say(d && d.status === 'ok' ? '' : 'Please press a choice again, because it did not save.', !(d && d.status === 'ok'));
      }).catch(function () { say('Please press a choice again, because it did not save.', true); });
    }, 500);
  }
  function draw() {
    box.innerHTML = '';
    var gname = (ctx.groupName && ctx.groupName()) || 'this group';
    var n = nameParts();
    var st = el('div', 'font-size:13.5px;min-height:0;margin-bottom:6px;', '');
    st.id = 'gp-permissions-status';
    box.appendChild(st);
    box.appendChild(el('div', 'font-size:15px;font-weight:800;color:#1A2E42;margin:8px 0;', 'Your visible name'));
    var r1 = el('div', 'display:flex;flex-wrap:wrap;');
    [['full', 'Full name (' + n.full + ')'], ['short', 'First name, last initial (' + n.short + ')'], ['initials', 'Initials (' + n.initials + ')']].forEach(function (o) {
      r1.appendChild(pill(o[1], state.name === o[0], function () { state.name = o[0]; draw(); save(); }));
    });
    box.appendChild(r1);
    box.appendChild(el('div', 'font-size:15px;font-weight:800;color:#1A2E42;margin:12px 0 8px;', 'Your visible location'));
    var r2 = el('div', 'display:flex;flex-wrap:wrap;');
    var offered = LEVELS.filter(function (l) { return !!placeFor(l); });
    if (state.where !== 'hidden' && offered.indexOf(state.where) < 0 && LEVELS.indexOf(state.where) > -1) offered.push(state.where);
    offered.forEach(function (l) {
      r2.appendChild(pill(placeFor(l) || ({ city: 'City', county: 'County', state: 'State', country: 'Country' })[l], state.where === l, function () { state.where = l; draw(); save(); }));
    });
    r2.appendChild(pill('Hidden', state.where === 'hidden', function () { state.where = 'hidden'; draw(); save(); }));
    box.appendChild(r2);
    box.appendChild(el('div', 'font-size:15px;font-weight:800;color:#1A2E42;margin:14px 0 4px;', 'What shows'));
    var m = el('div', 'font-size:14px;line-height:1.55;color:#1A2E42;background:#F7FBFF;border:1px solid #C9DFF3;border-radius:10px;padding:10px 12px;',
      'Your info helps AI suggest resources, opportunities, people, and events that fit you - such as locally or abroad. You choose, card by card, what is shown and what is used, and you can change it any time.');
    var a = el('a', 'display:inline-block;margin-top:8px;font-size:13.5px;font-weight:700;color:#fff;background:#1F699E;border-radius:20px;padding:7px 16px;text-decoration:none;', 'Info used for matching');
    a.href = 'https://2gather.network/ikigai/?matching=1';
    m.appendChild(document.createElement('br'));
    m.appendChild(a);
    box.appendChild(m);
    box.appendChild(el('div', 'font-size:12px;font-weight:800;color:#4B5A6D;letter-spacing:.06em;text-transform:uppercase;margin:18px 0 8px;', 'What members in ' + gname + ' see'));
    var shownName = state.name === 'full' ? n.full : (state.name === 'short' ? n.short : n.initials);
    var place = state.where === 'hidden' ? '' : placeFor(state.where);
    var pv = el('div', 'border:1.5px solid #DDE3EA;border-radius:12px;padding:14px;font-size:14.5px;line-height:1.5;');
    pv.appendChild(el('div', 'font-weight:700;', shownName));
    pv.appendChild(el('div', 'color:#4B5A6D;', place || 'Location hidden'));
    box.appendChild(pv);
  }
  function open() {
    if (!ctx || !ctx.groupId) return;
    box = document.getElementById('gp-permissions');
    if (!box) return;
    if (!ctx.meId) { box.textContent = 'Sign in to see your permissions in this group.'; return; }
    box.innerHTML = '';
    var w = el('span', 'display:inline-flex;align-items:center;background:#1F699E;color:#fff;font-size:13px;font-weight:700;padding:8px 16px;border-radius:20px;', 'Opening your permissions…');
    w.className = 'cw-loading';
    box.appendChild(w);
    var tok = ''; try { tok = localStorage.getItem('cw-token') || ''; } catch (e) {}
    var pPerm = fetch(GS + '?action=getPermissions&appearId=' + encodeURIComponent(ctx.meId) + '&editToken=' + encodeURIComponent(token())).then(function (r) { return r.json(); });
    var pProf = fetch(GS + '?action=getProfile&appearId=' + encodeURIComponent(ctx.meId) + '&meToken=' + encodeURIComponent(tok)).then(function (r) { return r.json(); }).catch(function () { return {}; });
    Promise.all([pPerm, pProf]).then(function (res) {
      var d = res[0], pr = res[1] || {};
      if (!d || d.status !== 'ok') { box.textContent = 'We could not read your permissions just now. Reload the page to try again.'; return; }
      var rows = d.permissions || [], mine = null, gen = null;
      rows.forEach(function (r) {
        if (String(r.audience) === String(ctx.groupId)) mine = r;
        if (String(r.audience) === 'members') gen = r;
      });
      var src = mine || gen || {};
      state = { name: src.nameShown || 'full', where: src.placeShown || 'state', profile: (pr.found && pr.data) ? pr.data : {} };
      if (pr.found && pr.name) { try { localStorage.setItem('cw-name', String(pr.name)); } catch (e) {} }
      draw();
    }).catch(function () { box.textContent = 'We could not read your permissions just now. Reload the page to try again.'; });
  }
  window.cwGroupPermissions = {
    init: function (c) { ctx = c; },
    open: open
  };
})();
