(function(){
  var SEP = ' › ';
  var REC = 'Recreation & Hobbies';
  var REC_KINDS = ['Sports', 'Outdoor & Nature', 'Making & Collecting', 'Movement & Performance', 'Games & Strategy'];
  var GATE = 'https://cw-api-gate.jessieupp.workers.dev';
  var _rd = null;
  function refData(){
    if (_rd) return _rd;
    _rd = fetch(GATE + '?action=getReferenceData').then(function(r){ return r.json(); });
    _rd.catch(function(){ _rd = null; });
    return _rd;
  }
  function withKids(t){ return (t || []).filter(function(n){ return n.kids && n.kids.length; }); }
  var TREES = {
    joys: function(){ return window.cwCategoryTree({ skills: 'none', topics: true }).then(withKids); },
    skills: function(){ return window.cwCategoryTree({ skills: 'none', topics: true }).then(withKids); },
    cares: function(){
      return refData().then(function(rd){
        var by = {}, out = [];
        (rd && rd.values || []).forEach(function(v){
          var item = String(v && v.item || '').trim(), cat = String(v && v.category || '').trim() || 'Other';
          if (!item) return;
          if (!by[cat]) { by[cat] = { name: cat, emoji: '', kids: [] }; out.push(by[cat]); }
          if (!by[cat].kids.some(function(k){ return k.name === item; })) by[cat].kids.push({ name: item, emoji: '', kids: [] });
        });
        return out;
      });
    }
  };
  var SECTIONS = [
    { key: 'joys', title: 'Interests', head: 'Recreational, personal and professional', sub: '', own: 'Something else?' },
    { key: 'cares', title: 'Interests', head: 'Eco/Social Causes', sub: '', own: 'Something else under Eco/Social Causes?' }
  ];
  var KINDS = [
    { label: 'Recreational', key: 'joys' },
    { label: 'Personal', key: 'joys' },
    { label: 'Professional', key: 'joys' },
    { label: 'Eco/social cause', key: 'cares' }
  ];
  var KIND_TOPS = {
    Recreational: ['Play', 'Outdoors', 'Movement', 'Arts & Expression', 'Food & Drink', 'Travel'],
    Personal: ['Home Life', 'Animals', 'Rest & Recovery', 'Personal Care', 'Medical']
  };
  function kindOfTop(name){
    name = String(name || '').trim();
    if (KIND_TOPS.Recreational.indexOf(name) > -1) return 'Recreational';
    if (KIND_TOPS.Personal.indexOf(name) > -1) return 'Personal';
    return 'Professional';
  }
  function normalise(key){
    key = String(key || '').trim();
    if (!key) return '';
    if (key.indexOf(SEP) === -1 && key.indexOf('›') > -1) key = key.split('›').map(function(x){ return x.trim(); }).join(SEP);
    if (window.cwTopicFor) {
      var segs = key.split(SEP).map(function(x){ return x.trim(); }).filter(Boolean);
      var last = segs[segs.length - 1] || '';
      var t = window.cwTopicFor(last);
      if (t) return t;
      var up = '';
      for (var i = segs.length - 2; i >= 0 && !up; i--) up = window.cwTopicFor(segs[i]);
      if (up) return up + SEP + last;
    }
    if (key.indexOf(SEP) === -1 && REC_KINDS.indexOf(key) > -1) return REC + SEP + key;
    return key;
  }
  function splitList(v){
    var s = String(v || '');
    return s.split(/[;|]/.test(s) ? /[;|]/ : ',').map(function(x){ return x.trim(); }).filter(Boolean);
  }
  function el(tag, css, text){ var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }

  function pickerStyle(){
    if (document.getElementById('cw-pk-style')) return;
    var st = document.createElement('style'); st.id = 'cw-pk-style';
    st.textContent = '.cwpk-all{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;}'
      + '.cwpk:not(.on){background:#fff;}.cwpk:not(.on):hover{background:#EEF2F7;}'
      + '.cwpk.cwpk-all{border:2px solid #1F699E;color:#1F699E;font-weight:700;}.cwpk.cwpk-all.on{color:#fff;}';
    document.head.appendChild(st);
  }
  function makePicker(host, sec, chip, onChange){
    pickerStyle();
    var on = {}, order = [], tree = null, at = [], own = {}, helpState = { open: false };
    var find = document.createElement('input');
    find.type = 'text'; find.placeholder = 'Search a topic to tag'; find.maxLength = 60; find.style.cssText = 'width:100%;box-sizing:border-box;margin:6px 0 8px;';
    var found = el('div', 'display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px;');
    if (!sec.noFind) { host.appendChild(find); host.appendChild(found); }
    var cats = el('div', 'margin:6px 0 4px;');
    cats.innerHTML = '<span style="font-size:13px;color:#1F699E;">Loading the list…</span>';
    host.appendChild(cats);
    var ownLabel = el('div', 'font-size:14px;color:var(--muted,#6B7A8D);margin:12px 0 6px;', sec.own);
    host.appendChild(ownLabel);
    var otherOpen = false, otherPath = [];
    var row = el('div', 'display:flex;gap:8px;');
    var inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = 'Type one, then press Add'; inp.maxLength = 60; inp.style.flex = '1';
    var add = document.createElement('button');
    add.type = 'button'; add.className = 'btn ghost'; add.textContent = 'Add';
    row.appendChild(inp); row.appendChild(add); host.appendChild(row);
    function syncOwn(){ ownLabel.style.display = otherOpen ? '' : 'none'; row.style.display = otherOpen ? 'flex' : 'none'; }
    function otherPill(path){
      var here = path.join(SEP), mine = otherOpen && otherPath.join(SEP) === here;
      var c = document.createElement('div'); c.className = chip + ' cwpk cwpk-all' + (mine ? ' on' : '');
      c.textContent = '+ Other';
      c.addEventListener('click', function(){ otherOpen = !mine; otherPath = path.slice(); draw(); if (otherOpen) inp.focus(); });
      return c;
    }
    syncOwn();
    function mark(k, isOwn){ if (!on[k]) { on[k] = true; order.push(k); } if (isOwn) own[k] = 1; }
    function unmark(k){ delete on[k]; delete own[k]; order = order.filter(function(x){ return x !== k; }); }
    function under(k){ return order.some(function(x){ return on[x] && x.indexOf(k + SEP) === 0; }); }
    function toggle(k){
      if (on[k]) unmark(k); else mark(k);
      if (at.length) {
        var here = at.join(SEP);
        if (k !== here) { if (under(here)) unmark(here); else mark(here); }
      }
      draw(); onChange();
    }
    function nodeAt(path){
      var list = tree || [];
      for (var i = 0; i < path.length; i++) {
        var f = null;
        list.forEach(function(n){ if (n.name === path[i]) f = n; });
        if (!f) return null;
        list = f.kids;
      }
      return list;
    }
    function pill(text, isOn, fn){
      var c = document.createElement('div'); c.className = chip + ' cwpk' + (isOn ? ' on' : '') + (text === 'Select all' ? ' cwpk-all' : '');
      c.textContent = (isOn ? '✓ ' : '') + text;
      c.addEventListener('click', fn);
      return c;
    }
    var openN = {};
    function drawAcc(){
      cats.innerHTML = '';
      var heads = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:4px 0 10px;');
      tree.forEach(function(n){
        var h = document.createElement('div'); h.className = chip + ' cwpk' + (openN[n.name] ? ' on' : '');
        h.textContent = n.name;
        h.addEventListener('click', function(){
          openN[n.name] = !openN[n.name];
          if (openN[n.name] && !on[n.name] && !under(n.name)) { mark(n.name); onChange(); }
          draw();
        });
        heads.appendChild(h);
      });
      var names = tree.map(function(n){ return n.name; });
      var allOn = names.length && names.every(function(k){ return !!on[k]; });
      heads.appendChild(pill('Select all', allOn, function(){
        names.forEach(function(k){
          if (allOn) unmark(k); else { mark(k); order.slice().forEach(function(x){ if (x.indexOf(k + SEP) === 0) unmark(x); }); }
        });
        draw(); onChange();
      }));
      cats.appendChild(heads);
      tree.forEach(function(n){
        if (!openN[n.name]) return;
        cats.appendChild(el('div', 'font-size:14px;font-weight:700;color:var(--ink,#1A2E42);margin:8px 0 6px;', n.name));
        var r = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;');
        r.appendChild(pill('All of ' + n.name, !!on[n.name], function(){
          if (on[n.name]) unmark(n.name); else { mark(n.name); order.slice().forEach(function(x){ if (x.indexOf(n.name + SEP) === 0) unmark(x); }); }
          draw(); onChange();
        }));
        n.kids.forEach(function(kd){
          var key = n.name + SEP + kd.name;
          r.appendChild(pill(kd.name, !!on[key], function(){
            if (on[key]) unmark(key); else mark(key);
            if (under(n.name)) unmark(n.name); else mark(n.name);
            draw(); onChange();
          }));
        });
        r.appendChild(otherPill([n.name]));
        cats.appendChild(r);
      });
    }
    function allNodes(list, path, out){
      (list || []).forEach(function(n){
        var p = path.concat(n.name);
        out.push({ name: n.name, path: p, emoji: n.emoji });
        if (n.kids && n.kids.length) allNodes(n.kids, p, out);
      });
      return out;
    }
    function pickHit(n){
      var key = n.path.join(SEP);
      if (on[key]) unmark(key);
      else {
        mark(key);
        for (var i = 1; i < n.path.length; i++) unmark(n.path.slice(0, i).join(SEP));
        order.slice().forEach(function(x){ if (x.indexOf(key + SEP) === 0) unmark(x); });
      }
      draw(); onChange();
    }
    function drawFound(){
      found.innerHTML = '';
      var q = String(find.value || '').trim().toLowerCase();
      if (!q || !tree) return;
      var hits = allNodes(tree, [], []).filter(function(n){ return n.name.toLowerCase().indexOf(q) > -1 && (!sec.visible || sec.visible(n.path[0])); });
      if (!hits.length) { found.appendChild(el('span', 'font-size:13px;color:var(--muted,#6B7A8D);', 'Nothing matches. Open a category and tap + Other to add it.')); return; }
      hits.slice(0, 30).forEach(function(n){
        var key = n.path.join(SEP);
        var c = document.createElement('div'); c.className = chip + (on[key] ? ' on' : '');
        c.style.cssText = 'display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1.2;';
        c.appendChild(el('span', '', (on[key] ? '✓ ' : '') + n.name));
        if (n.path.length > 1) c.appendChild(el('span', 'font-size:11px;font-weight:500;color:var(--muted,#6B7A8D);margin-top:2px;', n.path.slice(0, -1).join(SEP)));
        c.addEventListener('click', function(){ pickHit(n); });
        found.appendChild(c);
      });
    }
    find.addEventListener('input', drawFound);
    find.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') ev.preventDefault(); });
    function draw(){
      if (!tree) return;
      if (!sec.accordion && !at.length) otherOpen = false;
      syncOwn();
      drawFound();
      if (sec.accordion) { drawAcc(); return; }
      cats.innerHTML = '';
      var list = nodeAt(at);
      if (!list) { at = []; list = tree; }
      if (!at.length && sec.visible) list = list.filter(function(n){ return sec.visible(n.name); });
      var crumb = el('div', 'font-size:16px;font-weight:700;color:var(--ink,#1A2E42);margin:4px 0 10px;');
      var help = null;
      if (sec.tag) {
        help = catHelp(helpState);
        crumb.appendChild(el('span', 'margin-right:6px;', sec.heading ? sec.heading() : 'Tag this group'));
        crumb.appendChild(help.btn);
      }
      var trail = crumb;
      if (at.length) {
        trail = el('div', 'font-size:14px;font-weight:700;color:var(--ink,#1A2E42);margin:6px 0 0;');
        crumb.appendChild(trail);
        var link = function(text, to){
          var a = el('a', 'color:#1F699E;text-decoration:underline;cursor:pointer;', text); a.href = '#';
          a.addEventListener('click', function(e){ e.preventDefault(); at = to; draw(); });
          return a;
        };
        trail.appendChild(link('Main categories', []));
        at.forEach(function(seg, i){
          trail.appendChild(el('span', 'color:var(--muted,#6B7A8D);font-weight:400;margin:0 4px;', '\u203a'));
          if (i === at.length - 1) trail.appendChild(el('span', '', seg));
          else trail.appendChild(link(seg, at.slice(0, i + 1)));
        });
      } else if (!sec.tag) crumb.style.display = 'none';
      cats.appendChild(crumb);
      if (help) cats.appendChild(help.box);
      var r = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;');
      if (at.length) {
        var here = at.join(SEP);
        r.appendChild(pill('All of ' + at[at.length - 1], !!on[here], function(){ toggle(here); }));
      }
      list.filter(function(n){ return n.kids.length; }).concat(list.filter(function(n){ return !n.kids.length; })).forEach(function(n){
        var key = at.concat(n.name).join(SEP);
        if (n.kids.length) {
          var d = document.createElement('div'); d.className = chip + ' cwpk';
          d.style.cssText = 'color:#1F699E;border-color:#1F699E;';
          d.textContent = (n.emoji ? n.emoji + ' ' : '') + n.name;
          d.addEventListener('click', function(){
            at = at.concat(n.name);
            var hk = at.join(SEP);
            if (!on[hk] && !under(hk)) { mark(hk); onChange(); }
            draw();
          });
          r.appendChild(d);
        } else {
          r.appendChild(pill(n.name, !!on[key], function(){ toggle(key); }));
        }
      });
      if (!at.length && sec.selectAll) {
        var keys = list.map(function(n){ return n.name; });
        var allOn = keys.length && keys.every(function(k){ return !!on[k]; });
        r.appendChild(pill('Select all', allOn, function(){
          keys.forEach(function(k){ if (allOn) unmark(k); else mark(k); });
          draw(); onChange();
        }));
      }
      if (at.length) {
        var dn = document.createElement('div'); dn.className = chip + ' cwpk cwpk-all';
        dn.textContent = 'Done';
        dn.addEventListener('click', function(){ at = []; draw(); });
        r.appendChild(otherPill(at));
        r.appendChild(dn);
      }
      cats.appendChild(r);
    }
    function addOwn(){
      String(inp.value || '').split(',').forEach(function(w){
        w = w.trim().replace(/[|;›]/g, '');
        if (window.CW && CW.sentence) { w = CW.sentence(w); }
        var full = otherPath.length ? otherPath.concat(w).join(SEP) : w;
        if (w && !order.some(function(k){ return k.toLowerCase() === full.toLowerCase(); })) mark(full, true);
      });
      inp.value = ''; draw(); onChange();
    }
    add.addEventListener('click', addOwn);
    inp.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') { ev.preventDefault(); addOwn(); } });
    TREES[sec.key]().then(function(t){ tree = t || []; draw(); })
      .catch(function(){ cats.innerHTML = '<span style="font-size:13px;color:#7A2410;">The list did not load. Reload the page to try again.</span>'; });
    return {
      picks: function(){ return order.filter(function(k){ return on[k]; }); },
      remove: function(k){ unmark(k); draw(); onChange(); },
      emojiOf: function(k){
        var list = tree || [], node = null;
        String(k).split(SEP).forEach(function(seg){ node = null; (list || []).forEach(function(n){ if (n.name === seg) node = n; }); list = node ? node.kids : []; });
        return (node && node.emoji) || '';
      },
      redraw: function(){ draw(); },
      search: function(q){
        q = String(q || '').trim().toLowerCase();
        if (!q || !tree) return [];
        return allNodes(tree, [], []).filter(function(n){ return n.name.toLowerCase().indexOf(q) > -1; }).map(function(n){
          return { name: n.name, path: n.path, on: !!on[n.path.join(SEP)], toggle: function(){ pickHit(n); } };
        });
      },
      home: function(){ at = []; otherOpen = false; draw(); },
      get: function(){ if (String(inp.value || '').trim()) addOwn(); return order.filter(function(k){ return on[k]; }).join(';'); },
      set: function(v){ on = {}; order = []; own = {}; splitList(v).forEach(function(k){ k = normalise(k); if (k) mark(k, k.indexOf(SEP) === -1); }); draw(); }
    };
  }

  function catHelp(state){
    var btn = null, box = null;
    function build(){
      btn = el('button', 'font:inherit;font-size:11px;font-weight:800;width:18px;height:18px;line-height:15px;padding:0;margin-left:6px;border-radius:50%;border:1.5px solid #1F699E;cursor:pointer;vertical-align:middle;', 'i');
      btn.type = 'button'; btn.setAttribute('aria-label', 'About these categories');
      box = el('div', 'font-size:12.5px;color:#4B5A6D;background:#F7FBFF;border:1px solid #DDE6EF;border-radius:10px;padding:8px 12px;margin:0 0 10px;line-height:1.5;font-weight:500;');
      box.appendChild(el('div', 'font-weight:700;color:#1A2E42;', 'About these categories'));
      box.appendChild(el('p', 'margin:4px 0 8px;', 'This is where you apply your time, care, and skill in life. Pick the ones that sound like you, whether you enjoy them, are good at them, or care about them. How you want to feel (like calmer or healthier) grows out of these, so they aren\u2019t listed as a parent category.'));
      var t = el('table', 'width:100%;border-collapse:collapse;font-size:12.5px;background:#fff;border:1px solid #DDE6EF;border-radius:8px;overflow:hidden;');
      [
        ['Part of life', 'Categories'],
        ['Things you do for the joy of it', 'Play, Outdoors, Movement, Arts & Expression, Food & Drink, Travel'],
        ['Things you build, tend, and take care of', 'Building & Repurposing, Home Life, Animals, Technology, Transportation, Communications, Community & Culture'],
        ['Looking after yourself', 'Rest & Recovery, Personal Care, Medical'],
        ['What you believe, know, and how you work', 'Belief & Meaning, Science, Professional, Finance']
      ].forEach(function(r, ri){
        var tr = document.createElement('tr');
        r.forEach(function(c, ci){
          tr.appendChild(el(ri === 0 ? 'th' : 'td', 'text-align:left;vertical-align:top;padding:6px 10px;' + (ri ? 'border-top:1px solid #E6EDF4;color:' + (ci ? '#4B5A6D' : '#1A2E42') + ';' + (ci ? '' : 'width:38%;') : 'background:#F1F4F7;color:#1A2E42;font-weight:700;'), c));
        });
        t.appendChild(tr);
      });
      box.appendChild(t);
      paint();
      btn.addEventListener('click', function(){ state.open = !state.open; paint(); });
    }
    function paint(){
      var open = !!state.open;
      btn.style.background = open ? '#1F699E' : '#fff';
      btn.style.color = open ? '#fff' : '#1F699E';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      box.style.display = open ? '' : 'none';
    }
    build();
    return { btn: btn, box: box };
  }

  window.cwGroupSections = function(o){
    var root = document.getElementById(o.root);
    var nm = o.name ? document.getElementById(o.name) : null;
    var chip = o.chipClass || 'chip';
    if (!root) return { get: function(){ return { joys: '', skills: '', cares: '' }; }, set: function(){} };
    root.innerHTML = '';
    var q = el('div', '', 'What kind of group is this?'); q.className = 'q';
    root.appendChild(q);
    var help = el('div', 'margin:0 0 8px;', 'Pick every tag that fits your group, from any kind. Tap a kind to switch which ideas you are looking at. What you pick becomes the questions new members answer when they join, so you learn what each person is into.');
    help.className = 'help';
    root.appendChild(help);
    var find = document.createElement('input');
    find.type = 'text'; find.placeholder = 'Search every kind for a topic to tag'; find.maxLength = 60; find.style.cssText = 'width:100%;box-sizing:border-box;margin:0 0 10px;';
    root.appendChild(find);
    var found = el('div', 'display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px;');
    root.appendChild(found);
    var kinds = el('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));border:1.5px solid #C9DFF3;border-radius:12px;overflow:hidden;margin:0 0 14px;');
    root.appendChild(kinds);
    function joyKind(){ var f = null; KINDS.forEach(function(o){ if (o.key === 'joys' && kindOn[o.label]) f = o.label; }); return f; }
    var kindHint = el('div', 'font-size:13.5px;color:var(--soft,#4B5A6D);margin:-6px 0 14px;', 'For the people closest to you, like family, a health team or close friends.');
    kindHint.style.display = 'none';
    root.appendChild(kindHint);
    var holder = el('div', '');
    root.appendChild(holder);
    var prev = el('div', 'background:var(--panel,#F7FBFF);border:1.5px solid var(--panel-line,#C9DFF3);border-radius:12px;padding:14px 16px;margin:14px 0 6px;');
    prev.appendChild(el('div', 'font-size:16px;font-weight:700;color:var(--ink,#1A2E42);margin:0 0 8px;', 'Your tags'));
    var prevBody = el('div', '');
    prev.appendChild(prevBody);
    root.appendChild(prev);
    var parts = {}, boxes = {}, open = {}, kindOn = {};
    function boxOpen(key){ return KINDS.some(function(k){ return k.key === key && kindOn[k.label]; }); }
    function gname(){ return (nm && String(nm.value || '').trim()) || 'this group'; }
    function kindCount(k){
      return k.key === 'joys'
        ? (parts.joys ? parts.joys.picks().filter(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; }).length : 0)
        : (parts.cares ? parts.cares.picks().length : 0);
    }
    function paintKinds(){
      kinds.innerHTML = '';
      kindHint.style.display = kindOn['Personal'] ? '' : 'none';
      KINDS.forEach(function(k, i){
        var on = !!kindOn[k.label], cnt = kindCount(k);
        var c = el('button', 'font:inherit;font-size:14.5px;font-weight:700;border:0;border-radius:0;padding:11px 8px;cursor:pointer;' + (i ? 'border-left:1.5px solid #C9DFF3;' : '') + 'background:' + (on ? '#1F699E' : '#fff') + ';color:' + (on ? '#fff' : '#1A2E42') + ';', k.label + (cnt ? ' (' + cnt + ')' : ''));
        c.type = 'button';
        c.addEventListener('click', function(){
          if (kindOn[k.label]) return;
          KINDS.forEach(function(o){ kindOn[o.label] = false; });
          kindOn[k.label] = true;
          if (k.key === 'joys' && parts.joys) parts.joys.home();
          paintKinds(); layout();
        });
        kinds.appendChild(c);
      });
    }
    function drawFound(){
      found.innerHTML = '';
      var q = String(find.value || '').trim();
      if (!q) return;
      var hits = [];
      ['joys', 'cares'].forEach(function(key){
        if (!parts[key]) return;
        parts[key].search(q).forEach(function(h){ h.kind = key === 'cares' ? 'Eco/social cause' : kindOfTop(h.path[0]); hits.push(h); });
      });
      if (!hits.length) { found.appendChild(el('span', 'font-size:13px;color:var(--muted,#6B7A8D);', 'Nothing matches. Open a kind and tap + Other to add it.')); return; }
      hits.slice(0, 30).forEach(function(h){
        var c = document.createElement('div'); c.className = chip + (h.on ? ' on' : '');
        c.style.cssText = 'display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1.2;cursor:pointer;';
        c.appendChild(el('span', '', (h.on ? '\u2713 ' : '') + h.name));
        c.appendChild(el('span', 'font-size:11px;font-weight:500;color:var(--muted,#6B7A8D);margin-top:2px;', h.kind + (h.path.length > 1 ? ' \u203a ' + h.path.slice(0, -1).join(SEP) : '')));
        c.addEventListener('click', function(){ h.toggle(); });
        found.appendChild(c);
      });
    }
    find.addEventListener('input', drawFound);
    find.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') ev.preventDefault(); });
    function layout(){
      SECTIONS.forEach(function(s){ open[s.key] = boxOpen(s.key); boxes[s.key].wrap.style.display = open[s.key] ? '' : 'none'; });
      var names = KINDS.filter(function(k){ return k.key === 'joys' && kindOn[k.label]; }).map(function(k){ return k.label; });
      boxes.joys.head.style.display = 'none';
      if (parts.joys) parts.joys.redraw();
    }
    function preview(){
      paintKinds();
      drawFound();
      prevBody.innerHTML = '';
      var any = false;
      var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px 0;');
      KINDS.forEach(function(k){
        var sec = k.key, all = parts[sec] ? parts[sec].picks() : [];
        var picks = sec === 'joys' ? all.filter(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; }) : all;
        if (picks.length) any = true;
        var col = el('div', 'display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0;padding:0 14px;' + (k !== KINDS[0] ? 'border-left:1px solid #DDE6EF;' : 'padding-left:0;'));
        col.appendChild(el('div', 'font-size:13px;font-weight:700;color:var(--muted,#6B7A8D);', k.label));
        if (!picks.length) col.appendChild(el('div', 'font-size:13px;color:var(--muted,#6B7A8D);', 'None'));
        picks.forEach(function(key){
          var p = key.split(SEP);
          var c = document.createElement('div'); c.className = chip;
          c.style.cssText = 'display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1.2;cursor:pointer;max-width:100%;';
          c.title = 'Remove';
          var em = parts[sec].emojiOf ? parts[sec].emojiOf(key) : '';
          c.appendChild(el('span', '', (em ? em + ' ' : '') + p[p.length - 1] + '  \u00d7'));
          if (p.length > 1) c.appendChild(el('span', 'font-size:11px;font-weight:500;color:var(--muted,#6B7A8D);margin-top:2px;', p.slice(0, -1).join(SEP)));
          c.addEventListener('click', function(){ parts[sec].remove(key); });
          col.appendChild(c);
        });
        grid.appendChild(col);
      });
      if (any) prevBody.appendChild(grid);
      if (!any) prevBody.appendChild(el('div', 'font-size:13px;color:var(--muted,#6B7A8D);margin-top:6px;', 'Nothing picked yet. Pick a kind above, then your ideas.'));
    }
    SECTIONS.forEach(function(s){
      var wrap = el('div', 'padding:2px 0 6px;');
      var head = el('div', 'display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;');
      var headEl = el('div', 'font-size:16px;font-weight:700;color:var(--ink,#1A2E42);', s.key === 'cares' ? 'Ideas for eco and social cause groups' : s.head);
      head.appendChild(headEl);
      boxes[s.key] = { head: headEl };
      if (s.sub) head.appendChild(el('div', 'font-size:13.5px;color:var(--muted,#6B7A8D);', s.sub));
      wrap.appendChild(head);
      var body = el('div', '');
      wrap.appendChild(body);
      holder.appendChild(wrap);
      boxes[s.key].wrap = wrap; boxes[s.key].body = body;
      s.selectAll = true;
      if (s.key === 'joys') { s.tag = true; s.visible = function(n){ return !!joyKind() && kindOfTop(n) === joyKind(); }; s.heading = function(){ return 'Ideas for ' + String(joyKind() || '').toLowerCase() + ' groups'; }; }
      if (s.key === 'cares') s.accordion = true;
      s.noFind = true;
      parts[s.key] = makePicker(body, s, chip, preview);
    });
    if (nm) nm.addEventListener('input', preview);
    kindOn.Recreational = true;
    paintKinds(); layout(); preview();
    return {
      get: function(){ return { joys: parts.joys.get(), skills: '', cares: parts.cares.get() }; },
      set: function(joys, skills, cares){
        parts.joys.set([joys, skills].filter(Boolean).join(';')); parts.cares.set(cares);
        var jp = parts.joys.picks(), first = null;
        KINDS.forEach(function(k){ if (!first && k.key === 'joys' && jp.some(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; })) first = k.label; });
        if (!first && parts.cares.picks().length) first = 'Eco/social cause';
        if (first) { KINDS.forEach(function(k){ kindOn[k.label] = false; }); kindOn[first] = true; if (parts.joys) parts.joys.home(); }
        paintKinds(); layout(); preview();
      }
    };
  };
})();
