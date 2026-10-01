(function(){
  var SEP = ' › ';
  var REC = 'Recreation & Hobbies';
  var REC_KINDS = ['Sports', 'Outdoor & Nature', 'Making & Collecting', 'Movement & Performance', 'Games & Strategy'];
  function loadTree(){ return window.cwCategoryTree({ skills: 'always', topics: true }); }
  function normalise(key){
    key = String(key || '').trim();
    if (!key) return '';
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
  window.cwGroupInterests = function(o){
    var $ = function(id){ return document.getElementById(id); };
    var cats = $(o.cats), inp = $(o.input), addBtn = $(o.add), box = $(o.picks);
    var pq = $(o.previewQ), pc = $(o.previewChips), nm = $(o.name);
    var chip = o.chipClass || 'chip';
    var on = {}, picks = [], tree = null;
    if (!cats) return { get: function(){ return { kinds: '', choices: '' }; }, set: function(){} };
    cats.innerHTML = '<span style="font-size:13px;color:#1F699E;">Loading the categories…</span>';
    function mark(key){ on[key] = true; }
    var at = [];
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
      c.textContent = (isOn ? '\u2713 ' : '') + text;
      c.addEventListener('click', fn);
      return c;
    }
    function level(){
      var wrap = document.createElement('div');
      var list = nodeAt(at);
      if (!list) { at = []; list = tree || []; }
      var crumb = document.createElement('div');
      crumb.style.cssText = 'font-size:14px;font-weight:700;color:var(--ink,#1A2E42);margin:4px 0 10px;';
      if (!at.length) {
        crumb.style.fontWeight = '500'; crumb.style.color = 'var(--muted,#6B7A8D)';
        crumb.textContent = 'All categories';
      } else {
        var link = function(text, to){
          var a = document.createElement('a'); a.href = '#'; a.textContent = text;
          a.style.cssText = 'color:#1F699E;text-decoration:underline;cursor:pointer;';
          a.addEventListener('click', function(e){ e.preventDefault(); at = to; draw(); });
          return a;
        };
        crumb.appendChild(link('All categories', []));
        at.forEach(function(seg, i){
          var sep = document.createElement('span'); sep.textContent = ' \u203a '; sep.style.cssText = 'color:var(--muted,#6B7A8D);font-weight:400;margin:0 4px;';
          crumb.appendChild(sep);
          if (i === at.length - 1) { var cur = document.createElement('span'); cur.textContent = seg; crumb.appendChild(cur); }
          else crumb.appendChild(link(seg, at.slice(0, i + 1)));
        });
      }
      wrap.appendChild(crumb);
      var r = document.createElement('div');
      r.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
      if (at.length) {
        var here = at.join(SEP);
        r.appendChild(pill('All of ' + at[at.length - 1], !!on[here], function(){ if (on[here]) delete on[here]; else mark(here); draw(); }));
      }
      var groups = list.filter(function(n){ return n.kids.length; });
      var shown = (at.length === 1 && at[0] === REC && groups.length)
        ? groups
        : groups.concat(list.filter(function(n){ return !n.kids.length; }));
      shown.forEach(function(n){
        var key = at.concat(n.name).join(SEP);
        if (n.kids.length) {
          var d = document.createElement('div'); d.className = chip;
          d.style.cssText = 'color:#1F699E;border-color:#1F699E;';
          d.textContent = (n.emoji ? n.emoji + ' ' : '') + n.name;
          d.addEventListener('click', function(){ at = at.concat(n.name); draw(); });
          r.appendChild(d);
        } else {
          r.appendChild(pill(n.name, !!on[key], function(){ if (on[key]) delete on[key]; else mark(key); draw(); }));
        }
      });
      if (!at.length && shown.length > 1) {
        var allOn = shown.every(function(n){ return on[n.name]; });
        var addAll = document.createElement('div'); addAll.className = chip;
        addAll.style.cssText = 'background:#1F699E;color:#fff;border-color:#1F699E;display:inline-flex;align-items:center;justify-content:center;line-height:1;';
        addAll.textContent = allOn ? 'Remove all' : 'Add all';
        addAll.addEventListener('click', function(){
          shown.forEach(function(n){ if (allOn) delete on[n.name]; else mark(n.name); });
          draw();
        });
        r.appendChild(addAll);
      }
      wrap.appendChild(r);
      return wrap;
    }
    function leaves(){
      return Object.keys(on).filter(function(k){ return on[k]; });
    }
    function chosenRow(){
      var keys = leaves();
      var w = document.createElement('div');
      w.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px;';
      if (!keys.length) {
        var e = document.createElement('span'); e.style.cssText = 'font-size:13px;color:var(--muted,#6B7A8D);';
        e.textContent = 'Nothing chosen yet.'; w.appendChild(e); return w;
      }
      keys.forEach(function(k){
        var p = k.split(SEP);
        var c = document.createElement('div'); c.className = chip + ' on';
        c.textContent = p[p.length - 1] + '  \u00d7'; c.title = 'Remove ' + p.join(' \u203a ');
        c.addEventListener('click', function(){ delete on[k]; draw(); });
        w.appendChild(c);
      });
      return w;
    }
    function draw(){
      var inPreview = !!(pq && pc);
      if (tree) { cats.innerHTML = ''; if (!inPreview) cats.appendChild(chosenRow()); cats.appendChild(level()); }
      if (box && inPreview) { box.innerHTML = ''; box.style.display = 'none'; }
      else if (box) {
        box.innerHTML = '';
        picks.forEach(function(w, i){
          var c = document.createElement('div'); c.className = chip + ' on';
          c.textContent = w + '  ×'; c.title = 'Remove';
          c.addEventListener('click', function(){ picks.splice(i, 1); draw(); });
          box.appendChild(c);
        });
      }
      if (!pq || !pc) return;
      var gname = (nm && nm.value || '').trim() || 'this group';
      pq.textContent = 'What do you enjoy most in ' + gname + '?';
      pc.innerHTML = '';
      var list = leaves().map(function(k){ var p = k.split(SEP); return { name: p[p.length - 1], under: p.slice(0, -1).join(SEP), key: k }; })
        .concat(picks.map(function(w, i){ return { name: w, under: '', pick: i + 1 }; }));
      if (!list.length) {
        var e = document.createElement('span'); e.style.cssText = 'font-size:13px;color:var(--muted,#6B7A8D);';
        e.textContent = 'Pick what the group is about or add your own choices to see this.';
        pc.appendChild(e); return;
      }
      list.forEach(function(w){
        var c = document.createElement('div'); c.className = chip;
        c.style.cssText = 'display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1.2;';
        c.style.cursor = 'pointer'; c.title = 'Remove';
        c.addEventListener('click', function(){
          if (w.key) delete on[w.key]; else if (w.pick) picks.splice(w.pick - 1, 1);
          draw();
        });
        var t = document.createElement('span'); t.textContent = w.name + '  \u00d7'; c.appendChild(t);
        if (w.under) {
          var u = document.createElement('span');
          u.style.cssText = 'font-size:11px;font-weight:500;color:var(--muted,#6B7A8D);margin-top:2px;';
          u.textContent = w.under; c.appendChild(u);
        }
        pc.appendChild(c);
      });
    }
    function add(){
      if (!inp) return;
      String(inp.value || '').split(',').forEach(function(w){
        w = w.trim().replace(/[|;]/g, '');
        if (w && !picks.some(function(p){ return p.toLowerCase() === w.toLowerCase(); })) picks.push(w);
      });
      inp.value = ''; draw();
    }
    if (addBtn) addBtn.addEventListener('click', add);
    if (inp) inp.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') { ev.preventDefault(); add(); } });
    if (nm) nm.addEventListener('input', draw);
    loadTree().then(function(t){ tree = t; draw(); })
      .catch(function(){ cats.innerHTML = '<span style="font-size:13px;color:#7A2410;">The categories did not load. Reload the page to try again.</span>'; });
    draw();
    return {
      get: function(){
        if (inp && String(inp.value || '').trim()) add();
        return { kinds: leaves().join(';'), choices: picks.join(';') };
      },
      set: function(kinds, choices){
        on = {};
        var ks = String(kinds || '');
        ks.split(/[;|]/.test(ks) ? /[;|]/ : ',').forEach(function(k){ k = normalise(k); if (k) mark(k); });
        picks = String(choices || '').split(/[;|]/).map(function(w){ return w.trim(); }).filter(Boolean);
        draw();
      }
    };
  };
})();
