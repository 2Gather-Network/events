(function(){
  var SEP = ' › ';
  var REC = 'Recreation & Hobbies';
  var REC_KINDS = ['Sports', 'Outdoor & Nature', 'Making & Collecting', 'Movement & Performance', 'Games & Strategy'];
  var GATE = 'https://cw-api-gate.jessieupp.workers.dev';
  var _treeP = null;
  function node(name, emoji){ return { name: name, emoji: emoji || '', kids: [] }; }
  function kid(n, name){ for (var i = 0; i < n.kids.length; i++) if (n.kids[i].name === name) return n.kids[i]; var k = node(name); n.kids.push(k); return k; }
  function loadTree(){
    if (_treeP) return _treeP;
    var j = function(a){ return fetch(GATE + '?action=' + a).then(function(r){ return r.json(); }); };
    _treeP = Promise.all([j('getCategories'), j('getReferenceData')]).then(function(res){
      var cats = (res[0] && res[0].categories) || [], rd = res[1] || {};
      var emoji = {}, tops = {};
      cats.forEach(function(c){ if (c && c.label) { emoji[c.label.toLowerCase()] = c.emoji || ''; tops[c.label] = 1; } });
      (rd.skills || []).forEach(function(s){ if (s && s.category) tops[String(s.category).trim()] = 1; });
      tops[REC] = 1;
      var tree = Object.keys(tops).filter(Boolean).sort(function(a, b){ return a.localeCompare(b); }).map(function(t){
        var n = node(t, emoji[t.toLowerCase()] || '');
        if (t === REC) {
          REC_KINDS.forEach(function(k){ kid(n, k); });
          (rd.recreation || []).forEach(function(r){
            if (!r || !r.item || !r.recType) return;
            var a = kid(n, r.recType);
            (r.category ? kid(a, r.category) : a).kids.push(node(r.item));
          });
        } else {
          (rd.skills || []).forEach(function(s){ if (s && s.item && String(s.category).trim() === t) n.kids.push(node(s.item)); });
        }
        return n;
      });
      return tree;
    });
    _treeP.catch(function(){ _treeP = null; });
    return _treeP;
  }
  function normalise(key){
    key = String(key || '').trim();
    if (!key) return '';
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
    function mark(key){
      on[key] = true;
      var parts = key.split(SEP);
      for (var i = 1; i < parts.length; i++) on[parts.slice(0, i).join(SEP)] = true;
    }
    function row(list, path, depth){
      var wrap = document.createElement('div');
      wrap.style.cssText = depth ? 'margin:8px 0 4px ' + Math.min(depth, 3) * 14 + 'px;padding-left:12px;border-left:2px solid var(--line,#DDE4EE);' : 'margin:8px 0 4px;';
      if (depth) {
        var lab = document.createElement('div');
        lab.style.cssText = 'font-size:13px;color:var(--muted,#6B7A8D);margin:0 0 6px;';
        lab.textContent = 'Within ' + path[path.length - 1] + ' (optional):';
        wrap.appendChild(lab);
      }
      var r = document.createElement('div');
      r.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
      list.forEach(function(n){
        var key = path.concat(n.name).join(SEP);
        var c = document.createElement('div'); c.className = chip + (on[key] ? ' on' : '');
        c.textContent = (n.emoji ? n.emoji + ' ' : '') + n.name + (n.kids.length ? '  ›' : '');
        c.addEventListener('click', function(){
          if (on[key]) { Object.keys(on).forEach(function(k){ if (k === key || k.indexOf(key + SEP) === 0) delete on[k]; }); }
          else { mark(key); }
          draw();
        });
        r.appendChild(c);
      });
      wrap.appendChild(r);
      list.forEach(function(n){
        var key = path.concat(n.name).join(SEP);
        if (on[key] && n.kids.length) wrap.appendChild(row(n.kids, path.concat(n.name), depth + 1));
      });
      return wrap;
    }
    function leaves(){
      var keys = Object.keys(on).filter(function(k){ return on[k]; });
      return keys.filter(function(k){ return !keys.some(function(x){ return x !== k && x.indexOf(k + SEP) === 0; }); });
    }
    function draw(){
      if (tree) { cats.innerHTML = ''; cats.appendChild(row(tree, [], 0)); }
      if (box) {
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
      var list = leaves().map(function(k){ var p = k.split(SEP); return p[p.length - 1]; }).concat(picks);
      if (!list.length) {
        var e = document.createElement('span'); e.style.cssText = 'font-size:13px;color:var(--muted,#6B7A8D);';
        e.textContent = 'Pick what the group is about or add your own choices to see this.';
        pc.appendChild(e); return;
      }
      list.forEach(function(w){ var c = document.createElement('div'); c.className = chip; c.textContent = w; pc.appendChild(c); });
    }
    function add(){
      if (!inp) return;
      String(inp.value || '').split(',').forEach(function(w){
        w = w.trim().replace(/\|/g, '');
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
        return { kinds: leaves().join('|'), choices: picks.join('|') };
      },
      set: function(kinds, choices){
        on = {};
        String(kinds || '').split(String(kinds || '').indexOf('|') > -1 ? '|' : ',').forEach(function(k){ k = normalise(k); if (k) mark(k); });
        picks = String(choices || '').split('|').map(function(w){ return w.trim(); }).filter(Boolean);
        draw();
      }
    };
  };
})();
