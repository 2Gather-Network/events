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
    joys: function(){ return window.cwCategoryTree({ skills: 'always', topics: true }).then(withKids); },
    skills: function(){ return window.cwCategoryTree({ skills: 'always', topics: true }).then(withKids); },
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
    { key: 'joys', title: 'Interests', head: 'Recreational and personal', sub: 'Interests that bring enjoyment', own: 'Something else under Recreational or Personal?' },
    { key: 'skills', title: 'Interests', head: 'Professional', sub: 'Work and services', own: 'Something else under Professional?' },
    { key: 'cares', title: 'Interests', head: 'Eco/Social Causes', sub: 'Ecological and social causes', own: 'Something else under Eco/Social Causes?' }
  ];
  var KINDS = [
    { label: 'Recreational', key: 'joys' },
    { label: 'Personal', key: 'joys' },
    { label: 'Professional', key: 'skills' },
    { label: 'Eco/social cause', key: 'cares' }
  ];
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

  function makePicker(host, sec, chip, onChange){
    var on = {}, order = [], tree = null, at = [], own = {};
    var cats = el('div', 'margin:6px 0 4px;');
    cats.innerHTML = '<span style="font-size:13px;color:#1F699E;">Loading the list…</span>';
    host.appendChild(cats);
    host.appendChild(el('div', 'font-size:14px;color:var(--muted,#6B7A8D);margin:12px 0 6px;', sec.own));
    var row = el('div', 'display:flex;gap:8px;');
    var inp = document.createElement('input');
    inp.type = 'text'; inp.placeholder = 'Type one, then press Add'; inp.maxLength = 60; inp.style.flex = '1';
    var add = document.createElement('button');
    add.type = 'button'; add.className = 'btn ghost'; add.textContent = 'Add';
    row.appendChild(inp); row.appendChild(add); host.appendChild(row);
    function mark(k, isOwn){ if (!on[k]) { on[k] = true; order.push(k); } if (isOwn) own[k] = 1; }
    function unmark(k){ delete on[k]; delete own[k]; order = order.filter(function(x){ return x !== k; }); }
    function toggle(k){ if (on[k]) unmark(k); else mark(k); draw(); onChange(); }
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
      var c = document.createElement('div'); c.className = chip + (isOn ? ' on' : '');
      c.textContent = (isOn ? '✓ ' : '') + text;
      c.addEventListener('click', fn);
      return c;
    }
    function draw(){
      if (!tree) return;
      cats.innerHTML = '';
      var list = nodeAt(at);
      if (!list) { at = []; list = tree; }
      var crumb = el('div', 'font-size:14px;font-weight:700;color:var(--ink,#1A2E42);margin:4px 0 10px;');
      if (!at.length) {
        crumb.style.fontWeight = '500'; crumb.style.color = 'var(--muted,#6B7A8D)';
        crumb.textContent = 'All of ' + sec.head;
      } else {
        var link = function(text, to){
          var a = el('a', 'color:#1F699E;text-decoration:underline;cursor:pointer;', text); a.href = '#';
          a.addEventListener('click', function(e){ e.preventDefault(); at = to; draw(); });
          return a;
        };
        crumb.appendChild(link('All of ' + sec.head, []));
        at.forEach(function(seg, i){
          crumb.appendChild(el('span', 'color:var(--muted,#6B7A8D);font-weight:400;margin:0 4px;', ' › '));
          if (i === at.length - 1) crumb.appendChild(el('span', '', seg));
          else crumb.appendChild(link(seg, at.slice(0, i + 1)));
        });
      }
      cats.appendChild(crumb);
      var r = el('div', 'display:flex;gap:8px;flex-wrap:wrap;');
      if (at.length) {
        var here = at.join(SEP);
        r.appendChild(pill('All of ' + at[at.length - 1], !!on[here], function(){ toggle(here); }));
      }
      list.filter(function(n){ return n.kids.length; }).concat(list.filter(function(n){ return !n.kids.length; })).forEach(function(n){
        var key = at.concat(n.name).join(SEP);
        if (n.kids.length) {
          var d = document.createElement('div'); d.className = chip;
          d.style.cssText = 'color:#1F699E;border-color:#1F699E;';
          d.textContent = (n.emoji ? n.emoji + ' ' : '') + n.name;
          d.addEventListener('click', function(){ at = at.concat(n.name); draw(); });
          r.appendChild(d);
        } else {
          r.appendChild(pill(n.name, !!on[key], function(){ toggle(key); }));
        }
      });
      cats.appendChild(r);
    }
    function addOwn(){
      String(inp.value || '').split(',').forEach(function(w){
        w = w.trim().replace(/[|;›]/g, '');
        if (w && !order.some(function(k){ return k.toLowerCase() === w.toLowerCase(); })) mark(w, true);
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
      get: function(){ if (String(inp.value || '').trim()) addOwn(); return order.filter(function(k){ return on[k]; }).join(';'); },
      set: function(v){ on = {}; order = []; own = {}; splitList(v).forEach(function(k){ k = normalise(k); if (k) mark(k, k.indexOf(SEP) === -1); }); draw(); }
    };
  }

  window.cwGroupSections = function(o){
    var root = document.getElementById(o.root);
    var nm = o.name ? document.getElementById(o.name) : null;
    var chip = o.chipClass || 'chip';
    if (!root) return { get: function(){ return { joys: '', skills: '', cares: '' }; }, set: function(){} };
    root.innerHTML = '';
    var q = el('div', '', 'What kind of group is this?'); q.className = 'q';
    root.appendChild(q);
    var help = el('div', 'margin:0 0 8px;', 'Select any group category that represents your group. Drill down as far as you\u2019d like. People who join see your suggested picks, in addition to their own picks.');
    help.className = 'help';
    root.appendChild(help);
    var kinds = el('div', 'display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px;');
    root.appendChild(kinds);
    var holder = el('div', '');
    root.appendChild(holder);
    var prev = el('div', 'background:var(--panel,#F7FBFF);border:1.5px solid var(--panel-line,#C9DFF3);border-radius:12px;padding:14px 16px;margin:14px 0 6px;');
    prev.appendChild(el('div', 'font-size:16px;font-weight:800;color:var(--ink,#1A2E42);margin:0 0 4px;', 'What someone joining sees'));
    var prevBody = el('div', '');
    prev.appendChild(prevBody);
    root.appendChild(prev);
    var parts = {}, boxes = {}, open = {}, kindOn = {};
    function boxOpen(key){ return KINDS.some(function(k){ return k.key === key && kindOn[k.label]; }); }
    function gname(){ return (nm && String(nm.value || '').trim()) || 'this group'; }
    function paintKinds(){
      kinds.innerHTML = '';
      KINDS.forEach(function(k){
        var c = document.createElement('div'); c.className = chip + (kindOn[k.label] ? ' on' : '');
        c.textContent = (kindOn[k.label] ? '\u2713 ' : '') + k.label;
        c.addEventListener('click', function(){
          if (kindOn[k.label] && parts[k.key].picks().length && KINDS.filter(function(o){ return o.key === k.key && kindOn[o.label]; }).length === 1) return;
          kindOn[k.label] = !kindOn[k.label]; paintKinds(); layout();
        });
        kinds.appendChild(c);
      });
    }
    function layout(){
      SECTIONS.forEach(function(s){ open[s.key] = boxOpen(s.key); boxes[s.key].wrap.style.display = open[s.key] ? '' : 'none'; });
    }
    function preview(){
      prevBody.innerHTML = '';
      var any = false;
      SECTIONS.forEach(function(s){
        var picks = parts[s.key] ? parts[s.key].picks() : [];
        if (!picks.length) return;
        any = true;
        prevBody.appendChild(el('div', 'font-size:13.5px;font-weight:600;color:var(--muted,#6B7A8D);margin:10px 0 2px;', 'On ' + s.title + ', from ' + gname()));
        prevBody.appendChild(el('div', 'font-size:13.5px;color:var(--ink,#1A2E42);margin:0 0 8px;', 'Select your interests below. Your answers are shared with ' + gname() + ' members and also help build your global profile.'));
        var r = el('div', 'display:flex;gap:8px;flex-wrap:wrap;');
        picks.forEach(function(k){
          var p = k.split(SEP);
          var c = document.createElement('div'); c.className = chip;
          c.style.cssText = 'display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1.2;cursor:pointer;';
          c.title = 'Remove';
          c.appendChild(el('span', '', p[p.length - 1] + '  ×'));
          if (p.length > 1) c.appendChild(el('span', 'font-size:11px;font-weight:500;color:var(--muted,#6B7A8D);margin-top:2px;', p.slice(0, -1).join(SEP)));
          c.addEventListener('click', function(){ parts[s.key].remove(k); });
          r.appendChild(c);
        });
        prevBody.appendChild(r);
      });
      if (!any) prevBody.appendChild(el('div', 'font-size:13px;color:var(--muted,#6B7A8D);margin-top:6px;', 'Pick a kind of group above, then your suggestions, to see this.'));
    }
    SECTIONS.forEach(function(s){
      var wrap = el('div', 'border-top:1px solid var(--panel-line,#E3EAF2);padding:12px 0 6px;');
      var head = el('div', 'display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;');
      head.appendChild(el('div', 'font-size:16px;font-weight:800;color:var(--ink,#1A2E42);', s.head));
      head.appendChild(el('div', 'font-size:13.5px;color:var(--muted,#6B7A8D);', s.sub));
      wrap.appendChild(head);
      var body = el('div', '');
      wrap.appendChild(body);
      holder.appendChild(wrap);
      boxes[s.key] = { wrap: wrap, body: body };
      parts[s.key] = makePicker(body, s, chip, preview);
    });
    if (nm) nm.addEventListener('input', preview);
    paintKinds(); layout(); preview();
    return {
      get: function(){ return { joys: parts.joys.get(), skills: parts.skills.get(), cares: parts.cares.get() }; },
      set: function(joys, skills, cares){
        parts.joys.set(joys); parts.skills.set(skills); parts.cares.set(cares);
        KINDS.forEach(function(k){ if (parts[k.key].picks().length && !KINDS.some(function(o){ return o.key === k.key && kindOn[o.label]; })) kindOn[k.label] = true; });
        paintKinds(); layout(); preview();
      }
    };
  };
})();
