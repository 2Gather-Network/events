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
  var _wt = null;
  function wordTies(){
    if (_wt) return _wt;
    _wt = fetch(GATE + '?action=getCategories&words=1').then(function(r){ return r.json(); }).then(function(d){
      var r = (d && d.result) || d || {}, cols = r.wordCols || [], rows = r.words || [];
      var ix = function(n){ return cols.indexOf(n); }, iId = ix('wordId'), iW = ix('word'), iK = ix('kindOf'), iC = ix('categories'), iO = ix('otherNames');
      var byId = {}, map = {};
      var low = function(x){ return String(x || '').replace(/\s+/g, ' ').trim().toLowerCase(); };
      var list = function(x){ return String(x || '').split(/[|,]/).map(function(y){ return y.trim(); }).filter(Boolean); };
      rows.forEach(function(w){ byId[w[iId]] = w; });
      var catsOf = function(w){
        var out = [], seen = {}, stack = [w], n = 0;
        while (stack.length && n++ < 50) {
          var a = stack.pop(); if (!a || seen[a[iId]]) continue; seen[a[iId]] = 1;
          list(a[iC]).forEach(function(c){ if (out.indexOf(c) === -1) out.push(c); });
          if (!out.length) list(a[iK]).forEach(function(k){ if (byId[k]) stack.push(byId[k]); });
        }
        return out;
      };
      rows.forEach(function(w){
        var cs = catsOf(w); if (!cs.length) return;
        [w[iW]].concat(list(w[iO])).forEach(function(nm){
          var k = low(nm); if (!k) return;
          map[k] = (map[k] || []).concat(cs.filter(function(c){ return (map[k] || []).indexOf(c) === -1; }));
        });
      });
      return map;
    });
    _wt.catch(function(){ _wt = null; });
    return _wt;
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
  var ANY_LABEL = { Ecological: 'Any eco cause', Social: 'Any social cause' };
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
    Personal: ['Home Life', 'Animals', 'Rest & Recovery', 'Personal Care', 'Medical', 'Personal security', 'Belief & Meaning']
  };
  function kindOfTop(name){
    name = String(name || '').trim();
    if (KINDS.some(function(k){ return k.label === name; })) return name;
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
      + '.cwpk.cwpk-all{border:2px solid #1F699E;color:#1F699E;font-weight:700;}.cwpk.cwpk-all.on{color:#fff;}'
      + '.cwpk:not(.cwpk-all){color:#1A2E42;font-weight:400;}.cwpk:not(.cwpk-all):not(.on){border-color:#C9D6E2;}.cwpk:not(.cwpk-all).on{color:#fff;}';
    document.head.appendChild(st);
  }
  function makePicker(host, sec, chip, onChange, v2){
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
    var sg2 = el('div', '');
    if (sec.steps) {
      add.style.display = 'none';
      inp.addEventListener('input', function(){
        sg2.innerHTML = '';
        if (String(inp.value || '').trim()) sg2.appendChild(sugEl(inp.value, function(){ addOwn(); }, function(){ inp.value = ''; sg2.innerHTML = ''; }));
      });
      row.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;';
      inp.style.cssText = 'flex:1 1 220px;min-width:0;box-sizing:border-box;height:34px;padding:0 12px;margin:0;';
      add.className = 'btn'; add.style.cssText = 'display:none;';
    }
    row.appendChild(inp); row.appendChild(add); host.appendChild(row); host.appendChild(sg2);
    function syncOwn(){ ownLabel.style.display = otherOpen ? '' : 'none'; row.style.display = otherOpen ? 'flex' : 'none'; if (!otherOpen) sg2.innerHTML = ''; }
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
      var c = document.createElement('div'); c.className = chip + ' cwpk' + (isOn ? ' on' : '') + ((text === 'Select all' || /^Any (eco|social) cause$/.test(text)) ? ' cwpk-all' : '');
      c.textContent = (isOn ? '✓ ' : '') + text;
      c.addEventListener('click', fn);
      return c;
    }
    var addDraft = '', addPick = '', addSay = '', addFocus = false, addAsk = false;
    function suggest(path, w, cats){
      if (sec.key !== 'joys' || !sec.meId) return;
      var q = GATE + '?action=addWord&appearId=' + encodeURIComponent(sec.meId) + '&text=' + encodeURIComponent(w) + '&askedIn=interest';
      if (cats && cats.length) q += '&categories=' + encodeURIComponent(cats.join('|'));
      else q += path.length > 1 ? '&kindOf=' + encodeURIComponent(path[path.length - 1]) : '&categories=' + encodeURIComponent(path[0]);
      fetch(q).catch(function(){});
    }
    var catBox = null, catQueue = [], recent = [];
    function knownNode(w){
      if (!tree) return null;
      var lw = String(w).toLowerCase();
      var hits = allNodes(tree, [], []).filter(function(n){ return n.name.toLowerCase() === lw; });
      if (!hits.length) return null;
      var vis = hits.filter(function(n){ return !sec.visible || sec.visible(n.path[0]); });
      return sec.steps ? (vis[0] || null) : (vis[0] || hits[0]);
    }
    function addRecent(k){ if (recent.indexOf(k) === -1) recent.push(k); }
    function nextBox(){ catBox = catQueue.length ? { word: catQueue.shift(), picks: {}, q: '', auto: '' } : null; addFocus = !catBox; }
    function sentence(t){ t = String(t || '').trim(); return (window.CW && CW.sentence) ? CW.sentence(t) : t.charAt(0).toUpperCase() + t.slice(1); }
    function matchNodes(q){
      var lq = String(q || '').trim().toLowerCase().replace(/\s+/g, ' '), exact = null, hits = [];
      if (!lq || !tree) return { exact: null, hits: [] };
      allNodes(tree, [], []).forEach(function(n){
        if (n.path.length < 2 || (sec.visible && !sec.visible(n.path[0]))) return;
        var nl = n.name.toLowerCase();
        if (nl === lq) { if (!exact) exact = n; return; }
        if ((nl.indexOf(lq) === 0 || nl.indexOf(' ' + lq) > -1) && !hits.some(function(h){ return h.name.toLowerCase() === nl; })) hits.push(n);
      });
      hits.sort(function(a, b){ return (a.name.toLowerCase().indexOf(lq) === 0 ? 0 : 1) - (b.name.toLowerCase().indexOf(lq) === 0 ? 0 : 1); });
      return { exact: exact, hits: hits.slice(0, 6) };
    }
    function pickNode(n){
      var key = n.path.join(SEP);
      if (!on[key]) { mark(key); for (var i = 1; i < n.path.length; i++) unmark(n.path.slice(0, i).join(SEP)); }
      addDraft = ''; inp.value = ''; sg2.innerHTML = ''; addRecent(key); addFocus = true; draw(); onChange();
    }
    function sugEl(q, onNew, onCancel){
      var box = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0 0;');
      var t = String(q || '').trim();
      if (!t) return box;
      var m = matchNodes(t);
      var pb = function(label, strong, fn){
        var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
        b.style.cssText = 'font-family:inherit;background:#fff;border:1.5px solid ' + (strong ? '#1F699E' : '#DDE4EE') + ';border-radius:20px;padding:5px 12px;font-size:13px;font-weight:700;color:#1F699E;cursor:pointer;margin:0;line-height:1.4;';
        b.addEventListener('click', fn); box.appendChild(b);
      };
      if (m.exact) pb('+ Add “' + m.exact.name + '”', true, function(){ pickNode(m.exact); });
      else {
        m.hits.forEach(function(n){ pb(n.name, false, function(){ pickNode(n); }); });
        pb('+ Add “' + sentence(t) + '”', true, onNew);
      }
      pb('Cancel', false, onCancel);
      return box;
    }
    function stepAdd(words){
      words.forEach(function(w){
        var n = knownNode(w);
        if (n) {
          var key = n.path.join(SEP);
          if (!on[key]) { mark(key); for (var i = 1; i < n.path.length; i++) unmark(n.path.slice(0, i).join(SEP)); }
          addRecent(key);
          return;
        }
        if (at.length) {
          var full = at.concat(w).join(SEP);
          if (!on[full]) { mark(full, true); suggest(at, w); }
          addRecent(full);
          return;
        }
        var have = order.some(function(k){ var p = k.split(SEP); return on[k] && p[p.length - 1].toLowerCase() === w.toLowerCase(); });
        if (have) return;
        var kn = sec.kindName ? sec.kindName() : '';
        var nk = kn ? kn + SEP + w : w;
        mark(nk, true); addRecent(nk);
      });
      addFocus = true; draw(); onChange();
    }
    function andList(a){ return a.length < 2 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
    function recentRow(){
      var rr = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 8px;');
      recent.forEach(function(k){
        if (!on[k]) return;
        var segs = k.split(SEP);
        if (sec.visible && !sec.visible(segs[0])) return;
        rr.appendChild(pill(segs[segs.length - 1], true, function(){ unmark(k); recent = recent.filter(function(x){ return x !== k; }); draw(); onChange(); }));
      });
      return rr;
    }
    function catBoxEl(){
      var cb = catBox, tops = (tree || []).filter(function(n){ return n.kids && n.kids.length; });
      var b = el('div', 'background:var(--panel,#F7FBFF);border:1.5px solid #1F699E;border-radius:14px;padding:12px 14px;margin:0 0 12px;');
      b.appendChild(el('div', 'font-size:13px;font-weight:800;letter-spacing:.05em;color:#1A2E42;margin:0 0 10px;', 'PICK CATEGORIES FOR ' + cb.word.toUpperCase()));
      var sw = el('div', 'display:flex;align-items:center;background:#F7F9FC;border:1.5px solid #DDE4EE;border-radius:99px;padding:0 14px;margin:0 0 10px;min-height:38px;box-sizing:border-box;');
      var si = document.createElement('input');
      si.type = 'search'; si.maxLength = 60; si.value = cb.q; si.placeholder = '🔍 Search';
      si.setAttribute('aria-label', 'Search categories');
      si.style.cssText = 'flex:1;min-width:0;border:0;background:transparent;font-family:inherit;font-size:14px;padding:8px 4px;outline:none;box-shadow:none;margin:0;height:auto;';
      sw.appendChild(si); b.appendChild(sw);
      var list = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;');
      var note = el('div', 'font-size:13px;font-weight:600;color:#1A2E42;margin:6px 0 0;', '');
      b.appendChild(list); b.appendChild(note);
      var foot = el('div', 'display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:12px;');
      var cx = document.createElement('button'); cx.type = 'button'; cx.textContent = 'Cancel';
      cx.style.cssText = 'font-family:inherit;border-radius:22px;padding:8px 16px;font-size:14px;font-weight:700;line-height:1.5;border:1.5px solid #1F699E;background:#fff;color:#1F699E;margin:0;cursor:pointer;';
      var ties = null;
      var dn = document.createElement('button'); dn.type = 'button'; dn.textContent = 'Done';
      foot.appendChild(cx); foot.appendChild(dn); b.appendChild(foot);
      function picked(){ return tops.map(function(t){ return t.name; }).filter(function(n){ return cb.picks[n]; }); }
      function paint(){
        var qx = String(cb.q || '').trim(), lq = qx.toLowerCase(), assoc = [];
        lq = lq.replace(/\s+/g, ' ');
        if (lq && tree) allNodes(tree, [], []).forEach(function(n){
          if (n.path.length > 1 && n.name.toLowerCase() === lq && assoc.indexOf(n.path[0]) === -1 && tops.some(function(t){ return t.name === n.path[0]; })) assoc.push(n.path[0]);
        });
        if (lq && ties && ties[lq]) ties[lq].forEach(function(c){ var t = tops.filter(function(x){ return x.name.toLowerCase() === c.toLowerCase(); })[0]; if (t && assoc.indexOf(t.name) === -1) assoc.push(t.name); });
        if (lq !== cb.auto) { cb.auto = lq; assoc.forEach(function(t){ cb.picks[t] = true; }); }
        var shown = tops.filter(function(t){ return !lq || t.name.toLowerCase().indexOf(lq) > -1 || assoc.indexOf(t.name) > -1; });
        list.innerHTML = '';
        shown.forEach(function(t){
          list.appendChild(pill((t.emoji ? t.emoji + ' ' : '') + t.name, !!cb.picks[t.name], function(){ cb.picks[t.name] = !cb.picks[t.name]; paint(); }));
        });
        note.style.color = '#1A2E42';
        if (lq && !shown.length) { note.textContent = 'Nothing matches. Clear the search to see every category.'; note.style.color = '#5A6878'; }
        else if (assoc.length) note.textContent = qx.charAt(0).toUpperCase() + qx.slice(1) + ' is associated with ' + andList(assoc) + '.';
        else note.textContent = '';
        note.style.display = note.textContent ? '' : 'none';
        var any = picked().length > 0;
        dn.disabled = !any;
        dn.style.cssText = 'font-family:inherit;border-radius:22px;padding:8px 16px;font-size:14px;font-weight:700;line-height:1.5;border:1.5px solid #1F699E;background:#1F699E;color:#fff;margin:0;cursor:' + (any ? 'pointer;' : 'default;opacity:.5;');
      }
      si.addEventListener('input', function(){ cb.q = si.value; paint(); });
      si.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') ev.preventDefault(); });
      cx.addEventListener('click', function(){ nextBox(); draw(); });
      dn.addEventListener('click', function(){
        var cs = picked();
        if (!cs.length) return;
        var prim = cs.filter(function(n){ return !sec.visible || sec.visible(n); })[0] || cs[0];
        var key = prim + SEP + cb.word;
        if (!on[key]) mark(key, true);
        suggest([prim], cb.word, cs);
        addRecent(key);
        nextBox(); draw(); onChange();
      });
      paint();
      wordTies().then(function(m){ ties = m; if (catBox === cb) { cb.auto = null; paint(); } }).catch(function(){});
      setTimeout(function(){ try { si.focus({ preventScroll: true }); } catch (e) {} }, 0);
      return b;
    }
    function addBox(choices){
      var box = el('div', 'margin:0 0 12px;');
      var rowEl = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;');
      var tx = document.createElement('input');
      tx.type = 'text'; tx.maxLength = 60; tx.value = addDraft;
      tx.setAttribute('aria-label', 'Add your own idea');
      if (!v2) tx.placeholder = 'Add your own idea';
      if (sec.steps) tx.placeholder = '\uD83D\uDD0D Search';
      tx.style.cssText = v2 ? 'flex:1 1 220px;min-width:0;box-sizing:border-box;height:34px;padding:0 12px;margin:0;' : 'flex:1 1 220px;min-width:0;box-sizing:border-box;';
      rowEl.appendChild(tx);
      var pick = null;
      if (choices && choices.length) {
        pick = document.createElement('select');
        pick.setAttribute('aria-label', 'Which kind it is');
        pick.style.cssText = 'appearance:none;-webkit-appearance:none;background:#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1.5l5 5 5-5\' fill=\'none\' stroke=\'%231F699E\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") no-repeat right 14px center;background-size:12px 8px;border:1.5px solid #DDE4EE;border-radius:22px;font:600 14px \'Nunito Sans\',\'DM Sans\',sans-serif;color:#1A2E42;padding:8px 38px 8px 16px;min-height:38px;cursor:pointer;';
        var ph = document.createElement('option'); ph.value = ''; ph.textContent = 'Which kind is it?'; pick.appendChild(ph);
        choices.forEach(function(c){ var o = document.createElement('option'); o.value = c; o.textContent = c; if (c === addPick) o.selected = true; pick.appendChild(o); });
        pick.addEventListener('change', function(){ addPick = pick.value; });
        if (v2 && !addAsk) pick.style.display = 'none';
        rowEl.appendChild(pick);
      }
      var go = document.createElement('button');
      go.type = 'button'; go.className = v2 ? 'btn' : 'btn ghost'; go.textContent = 'Add'; if (v2) go.style.cssText = 'height:34px;padding:0 14px;margin:0;font-size:13px;font-weight:700;';
      if (!sec.steps) rowEl.appendChild(go);
      box.appendChild(rowEl);
      if (sec.steps) {
        var sg = el('div', '');
        var paintSg = function(){
          sg.innerHTML = '';
          if (String(tx.value || '').trim()) sg.appendChild(sugEl(tx.value, function(){ doAdd(); }, function(){ tx.value = ''; addDraft = ''; sg.innerHTML = ''; }));
        };
        tx.addEventListener('input', paintSg);
        box.appendChild(sg);
        setTimeout(paintSg, 0);
      }
      var note = el('div', 'font-size:13px;color:#2F3D4F;margin:6px 0 0;', addSay);
      box.appendChild(note);
      if (v2) box.appendChild(el('div', 'font-size:13.5px;color:#1A2E42;margin:8px 0 0;', 'Add your own idea above or select a category below to explore some ideas.'));
      function doAdd(){
        var path = at.length ? at.slice() : (pick && pick.value ? [pick.value] : []);
        var words = String(tx.value || '').split(',').map(function(w){ w = w.trim().replace(/[|;›]/g, ''); return (window.CW && CW.sentence) ? CW.sentence(w) : w; }).filter(Boolean);
        if (!words.length) { addSay = 'Type an idea first.'; note.textContent = addSay; return; }
        if (sec.steps) { addDraft = ''; addSay = ''; stepAdd(words); return; }
        if (!path.length) { addSay = 'Pick which kind it is, then press Add.'; note.textContent = addSay; if (pick) { addAsk = true; pick.style.display = ''; pick.focus(); } return; }
        words.forEach(function(w){
          var full = path.concat(w).join(SEP);
          if (!order.some(function(k){ return k.toLowerCase() === full.toLowerCase(); })) { mark(full, true); suggest(path, w); }
        });
        addDraft = ''; addAsk = false; addSay = 'Added under ' + path.join(' › ') + '. A new idea is reviewed before others can pick it.';
        addFocus = true; draw(); onChange();
      }
      go.addEventListener('click', doAdd);
      tx.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') { ev.preventDefault(); doAdd(); } });
      tx.addEventListener('input', function(){ addDraft = tx.value; });
      if (addFocus) { addFocus = false; setTimeout(function(){ try { tx.focus({ preventScroll: true }); } catch (e) {} }, 0); }
      return box;
    }
    var openN = {}, accFind = {};
    function drawAcc(){
      cats.innerHTML = '';
      if (sec.steps && catBox) { cats.appendChild(catBoxEl()); return; }
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
      if (!(sec.steps && tree.some(function(n){ return openN[n.name]; }))) cats.appendChild(addBox(tree.map(function(n){ return n.name; })));
      if (sec.steps) cats.appendChild(recentRow());
      cats.appendChild(heads);
      tree.forEach(function(n){
        if (!openN[n.name]) return;
        cats.appendChild(el('div', 'font-size:14px;font-weight:700;color:var(--ink,#1A2E42);margin:8px 0 6px;', n.name));
        var sq = document.createElement('input');
        sq.type = 'text'; sq.maxLength = 60; sq.value = accFind[n.name] || '';
        sq.placeholder = 'Search ' + (ANY_LABEL[n.name] ? n.name.toLowerCase() + ' causes' : n.name.toLowerCase());
        sq.setAttribute('aria-label', sq.placeholder);
        sq.style.cssText = 'width:100%;box-sizing:border-box;margin:0 0 8px;';
        cats.appendChild(sq);
        var r = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;');
        r.appendChild(pill(ANY_LABEL[n.name] || ('All of ' + n.name), !!on[n.name], function(){
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
        var none = el('div', 'font-size:13px;color:var(--muted,#6B7A8D);margin:6px 0 0;', 'Nothing matches. Tap + Other to add it.');
        cats.appendChild(none);
        var kidPills = Array.prototype.slice.call(r.children, 1, r.children.length - 1);
        var filt = function(){
          var q = String(sq.value || '').trim().toLowerCase(), seen = 0;
          accFind[n.name] = sq.value;
          kidPills.forEach(function(c, i){ var hit = !q || n.kids[i].name.toLowerCase().indexOf(q) > -1; c.style.display = hit ? '' : 'none'; if (hit) seen++; });
          none.style.display = (q && !seen) ? '' : 'none';
        };
        sq.addEventListener('input', filt);
        sq.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') ev.preventDefault(); });
        filt();
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
      if (sec.steps && sec.hint && sec.hint()) cats.appendChild(el('div', 'font-size:13.5px;color:var(--soft,#2F3D4F);margin:-4px 0 12px;', sec.hint()));
      if (help) cats.appendChild(help.box);
      if (sec.steps && catBox) { cats.appendChild(catBoxEl()); return; }
      if (sec.tag && !(sec.steps && at.length)) cats.appendChild(addBox(at.length ? null : list.filter(function(n){ return n.kids && n.kids.length; }).map(function(n){ return n.name; })));
      var r = el('div', 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;');
      if (sec.steps && !at.length) Array.prototype.slice.call(recentRow().children).forEach(function(c){ r.appendChild(c); });
      if (at.length) {
        var here = at.join(SEP);
        r.appendChild(pill('All of ' + at[at.length - 1], !!on[here], function(){ toggle(here); }));
      }
      list.filter(function(n){ return n.kids.length; }).concat(list.filter(function(n){ return !n.kids.length; })).forEach(function(n){
        var key = at.concat(n.name).join(SEP);
        if (n.kids.length) {
          var d = document.createElement('div'); d.className = chip + ' cwpk';
          d.style.cssText = 'color:#1A2E42;border-color:#C9D6E2;';
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
        if (sec.steps && w) {
          var kn = knownNode(w);
          if (kn) { var kk = kn.path.join(SEP); if (!on[kk]) mark(kk); addRecent(kk); return; }
        }
        var full = otherPath.length ? otherPath.concat(w).join(SEP) : w;
        if (w && !order.some(function(k){ return k.toLowerCase() === full.toLowerCase(); })) { mark(full, true); if (sec.steps) { suggest(otherPath, w); addRecent(full); } }
      });
      inp.value = ''; sg2.innerHTML = ''; draw(); onChange();
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
      box = el('div', 'font-size:12.5px;color:#2F3D4F;background:#F7FBFF;border:1px solid #DDE6EF;border-radius:10px;padding:8px 12px;margin:0 0 10px;line-height:1.5;font-weight:500;');
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
          tr.appendChild(el(ri === 0 ? 'th' : 'td', 'text-align:left;vertical-align:top;padding:6px 10px;' + (ri ? 'border-top:1px solid #E6EDF4;color:' + (ci ? '#2F3D4F' : '#1A2E42') + ';' + (ci ? '' : 'width:38%;') : 'background:#F1F4F7;color:#1A2E42;font-weight:700;'), c));
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
    var meIdFor = String(o.meId || '').trim();
    if (!root) return { get: function(){ return { joys: '', skills: '', cares: '' }; }, set: function(){} };
    root.innerHTML = '';
    var q = el('div', '', 'What kind of group is this?'); q.className = 'q';
    root.appendChild(q);
    var help = el('div', 'margin:0 0 8px;', o.steps ? 'Pick every type that fits your group. This helps us build a brief Q&A before your new members join. Not only do they get to know what this group is about, but they can share what they are interested in when joining.' : 'Pick every tag that fits your group, from any kind. Tap a kind to switch which ideas you are looking at. What you pick becomes the questions new members answer when they join, so you learn what each person is into.');
    help.className = 'help';
    root.appendChild(help);
    var chosen = {}, pillRow = null, stepStage = 'pick';
    if (o.kindPills) { pillRow = el('div', 'display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px;'); root.appendChild(pillRow); }
    var find = document.createElement('input');
    find.type = 'text'; find.placeholder = 'Search every kind for a topic to tag'; find.maxLength = 60; find.style.cssText = 'width:100%;box-sizing:border-box;margin:0 0 10px;';
    root.appendChild(find);
    var found = el('div', 'display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px;');
    root.appendChild(found);
    var kinds = el('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));border:1.5px solid #C9DFF3;border-radius:12px;overflow:hidden;margin:0 0 14px;');
    root.appendChild(kinds);
    function joyKind(){ var f = null; KINDS.forEach(function(o){ if (o.key === 'joys' && kindOn[o.label]) f = o.label; }); return f; }
    var KIND_HINTS = {
      'Recreational': 'For the things you do for the joy of it, like games, hiking, art or cooking together.',
      'Personal': 'For the people closest to you, like family, a health team or close friends.',
      'Professional': 'For people who work, learn or build together, like a trade, a business or a field of study.',
      'Eco/social cause': 'For people working on a cause, like clean water, housing or caring for the neighborhood.'
    };
    var kindHint = el('div', 'font-size:13.5px;color:var(--soft,#2F3D4F);margin:-6px 0 14px;', '');
    kindHint.style.display = 'none';
    var prog = el('div', 'font-size:13px;font-weight:700;color:#5A6878;margin:0 0 6px;', '');
    prog.style.display = 'none';
    if (o.steps) root.appendChild(prog);
    root.appendChild(kindHint);
    var holder = el('div', '');
    root.appendChild(holder);
    var prev = el('div', 'background:var(--panel,#F7FBFF);border:1.5px solid var(--panel-line,#C9DFF3);border-radius:12px;padding:14px 16px;margin:14px 0 6px;');
    prev.appendChild(el('div', 'font-size:16px;font-weight:700;color:var(--ink,#1A2E42);margin:0 0 4px;letter-spacing:.03em;', 'YOUR GROUP TOPICS'));
    var prevSay = prev.appendChild(el('div', o.kindPills ? 'font-size:13.5px;color:#1A2E42;margin:0 0 10px;' : 'font-size:12.5px;color:var(--muted,#6B7A8D);margin:0 0 10px;padding-bottom:10px;border-bottom:1px solid #DDE6EF;', 'When new members join, they will select which group topics you offer below.'));
    var prevBody = el('div', '');
    prev.appendChild(prevBody);
    root.appendChild(prev);
    var rev = el('div', ''), foot = el('div', 'display:flex;justify-content:space-between;align-items:center;gap:10px;margin:14px 0 0;');
    rev.style.display = 'none';
    if (o.steps) { root.appendChild(rev); root.appendChild(foot); }
    var parts = {}, boxes = {}, open = {}, kindOn = {}, openCols = {};
    function boxOpen(key){ return KINDS.some(function(k){ return k.key === key && kindOn[k.label]; }); }
    function gname(){ return (nm && String(nm.value || '').trim()) || 'this group'; }
    function kindCount(k){
      return k.key === 'joys'
        ? (parts.joys ? parts.joys.picks().filter(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; }).length : 0)
        : (parts.cares ? parts.cares.picks().length : 0);
    }
    function paintKinds(){
      kinds.innerHTML = '';
      var hk = null; KINDS.forEach(function(k){ if (kindOn[k.label]) hk = k.label; });
      kindHint.textContent = hk ? KIND_HINTS[hk] : '';
      kindHint.style.display = (hk && !(o.steps && hk !== 'Eco/social cause')) ? '' : 'none';
      (o.kindPills ? KINDS.filter(function(k){ return chosen[k.label]; }) : KINDS).forEach(function(k, i){
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
      if (o.steps) { stepPreview(); return; }
      var any = false;
      var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px 0;');
      KINDS.forEach(function(k){
        var sec = k.key, all = parts[sec] ? parts[sec].picks() : [];
        var picks = sec === 'joys' ? all.filter(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; }) : all;
        if (picks.length) any = true;
        var col = el('div', 'display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0;padding:0 14px;' + (k !== KINDS[0] ? 'border-left:1px solid #DDE6EF;' : 'padding-left:0;'));
        col.appendChild(el('div', o.kindPills ? 'font-size:13.5px;font-weight:700;color:var(--muted,#6B7A8D);' : 'font-size:13px;font-weight:700;color:var(--muted,#6B7A8D);', k.label));
        if (!picks.length) col.appendChild(el('div', 'font-size:13px;color:var(--muted,#6B7A8D);', 'None'));
        if (picks.length) col.firstChild.textContent = k.label + ' (' + picks.length + ')';
        var LIM = 6, cap = openCols[k.label] ? 9999 : LIM, shown = 0, groups = [], gi = {};
        picks.forEach(function(key){
          var p = key.split(SEP), g = p.slice(0, -1).join(SEP);
          if (!gi.hasOwnProperty(g)) { gi[g] = groups.length; groups.push({ name: g, items: [] }); }
          groups[gi[g]].items.push(key);
        });
        groups.forEach(function(g){
          if (shown >= cap) return;
          if (g.name) col.appendChild(el('div', 'font-size:11.5px;color:var(--muted,#6B7A8D);margin:2px 0 -2px;', g.name));
          var row = el('div', 'display:flex;flex-wrap:wrap;gap:4px;');
          g.items.forEach(function(key){
            if (shown >= cap) return;
            shown++;
            var p = key.split(SEP);
            var c = document.createElement('div'); c.className = chip;
            c.style.cssText = 'padding:2px 10px;font-size:12.5px;line-height:1.5;cursor:pointer;max-width:100%;';
            c.title = 'Remove';
            c.textContent = p[p.length - 1] + ' \u00d7';
            c.addEventListener('click', function(){ parts[sec].remove(key); });
            row.appendChild(c);
          });
          col.appendChild(row);
        });
        if (picks.length > LIM) {
          var more = el('a', 'font-size:12.5px;color:#1F699E;text-decoration:underline;cursor:pointer;margin-top:2px;', openCols[k.label] ? 'Show fewer' : 'Show ' + (picks.length - LIM) + ' more');
          more.href = '#';
          more.addEventListener('click', function(e){ e.preventDefault(); openCols[k.label] = !openCols[k.label]; preview(); });
          col.appendChild(more);
        }
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
      if (s.key === 'joys') { s.hint = function(){ return KIND_HINTS[joyKind()] || ''; }; s.kindName = function(){ return joyKind() || ''; }; }
      if (s.key === 'cares' && o.steps) { kindHint.style.margin = '4px 0 12px'; wrap.insertBefore(kindHint, body); }
      s.noFind = true;
      s.meId = meIdFor;
      s.steps = !!o.steps;
      parts[s.key] = makePicker(body, s, chip, preview, !!o.kindPills);
    });
    if (nm) nm.addEventListener('input', preview);
    if (!o.kindPills) kindOn.Recreational = true;
    function anyChosen(){ return KINDS.some(function(k){ return chosen[k.label]; }); }
    function syncKindPills(){
      if (!o.kindPills) return;
      if (o.steps) { applyStage(); return; }
      var any = anyChosen(), disp = any ? '' : 'none';
      [find, found, kinds, holder, prev].forEach(function(n){ n.style.display = disp; });
      if (!any) kindHint.style.display = 'none';
      var act = null; KINDS.forEach(function(k){ if (kindOn[k.label] && chosen[k.label]) act = k.label; });
      if (!act) { KINDS.forEach(function(k){ kindOn[k.label] = false; }); var first = KINDS.filter(function(k){ return chosen[k.label]; })[0]; if (first) { kindOn[first.label] = true; if (first.key === 'joys' && parts.joys) parts.joys.home(); } }
    }
    function paintKindPills(){
      if (!pillRow) return;
      pillRow.innerHTML = '';
      KINDS.forEach(function(k){
        var b = document.createElement('button'); b.type = 'button'; b.className = chip + (chosen[k.label] ? ' on' : ''); b.textContent = k.label;
        b.setAttribute('aria-pressed', chosen[k.label] ? 'true' : 'false');
        b.addEventListener('click', function(){ chosen[k.label] = !chosen[k.label]; paintKindPills(); syncKindPills(); paintKinds(); layout(); });
        pillRow.appendChild(b);
      });
    }
    function chosenList(){ return KINDS.filter(function(k){ return chosen[k.label]; }); }
    function picksOf(k){
      var all = parts[k.key] ? parts[k.key].picks() : [];
      return k.key === 'joys' ? all.filter(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; }) : all;
    }
    function shownKinds(upto){
      var list = chosenList().filter(function(k, i){ return i <= upto; });
      KINDS.forEach(function(k){ if (list.indexOf(k) === -1 && !chosen[k.label] && picksOf(k).length) list.push(k); });
      return list;
    }
    function tagsBlock(list, links){
      var box = el('div', '');
      list.forEach(function(k){
        var picks = picksOf(k), idx = chosenList().indexOf(k);
        var h = el(links && idx > -1 ? 'a' : 'div', 'display:block;font-size:14px;font-weight:800;color:#1F699E;margin:8px 0 4px;' + (links && idx > -1 ? 'text-decoration:underline;cursor:pointer;' : ''), k.label);
        if (links && idx > -1) { h.href = '#'; h.addEventListener('click', function(e){ e.preventDefault(); goStage(idx); }); }
        box.appendChild(h);
        var row = el('div', 'display:flex;flex-wrap:wrap;gap:4px;');
        if (!picks.length) row.appendChild(el('div', 'font-size:13px;color:var(--muted,#6B7A8D);', 'None'));
        picks.forEach(function(key){
          var p = key.split(SEP);
          var c = document.createElement('div'); c.className = chip;
          c.style.cssText = 'padding:2px 10px;font-size:12.5px;line-height:1.5;cursor:pointer;max-width:100%;';
          c.title = 'Remove';
          c.textContent = p[p.length - 1] + ' ×';
          c.addEventListener('click', function(){ parts[k.key].remove(key); });
          row.appendChild(c);
        });
        box.appendChild(row);
      });
      return box;
    }
    function stepPreview(){
      if (stepStage === 'review') {
        rev.innerHTML = '';
        rev.appendChild(el('div', 'font-size:16px;font-weight:700;color:var(--ink,#1A2E42);margin:0 0 8px;letter-spacing:.03em;', 'YOUR GROUP TOPICS'));
        var hp = el('div', 'margin:0 0 8px;', 'When new members join, they will select which group topics you offer below. They can also add their own.'); hp.className = 'help';
        rev.appendChild(hp);
        rev.appendChild(tagsBlock(shownKinds(99), true));
        rev.appendChild(el('div', 'font-size:13px;color:#1A2E42;margin:14px 0 0;', "Tap a kind's name to go back and change it."));
        return;
      }
      prevBody.appendChild(tagsBlock(shownKinds(typeof stepStage === 'number' ? stepStage : -1), false));
    }
    function stepBtn(text, solid, dim, fn){
      var b = document.createElement('button'); b.type = 'button'; b.textContent = text;
      b.style.cssText = 'font-family:inherit;border-radius:22px;padding:8px 16px;font-size:14px;font-weight:700;line-height:1.5;margin:0;border:1.5px solid #1F699E;' + (solid ? 'background:#1F699E;color:#fff;' : 'background:#fff;color:#1F699E;') + 'cursor:' + (dim ? 'default;opacity:.5;' : 'pointer;');
      if (dim) b.setAttribute('aria-disabled', 'true');
      b.addEventListener('click', function(){ if (!dim) fn(); });
      return b;
    }
    function topCover(){
      var cover = 0;
      try {
        for (var t = 0; t < 4; t++) {
          var n = document.elementFromPoint(Math.round(window.innerWidth / 2), Math.round(cover) + 2), hit = false;
          while (n && n !== document.body && n !== document.documentElement) {
            var ps = getComputedStyle(n).position;
            if (ps === 'fixed' || ps === 'sticky') { var b = n.getBoundingClientRect().bottom; if (b > cover) { cover = b; hit = true; } break; }
            n = n.parentElement;
          }
          if (!hit) break;
        }
      } catch (e) {}
      return cover;
    }
    function showTop(el2){
      try {
        var gap = topCover() + 12, r = el2.getBoundingClientRect();
        if (r.top < gap || r.top > window.innerHeight - 80) window.scrollTo(0, Math.max(0, window.pageYOffset + r.top - gap));
      } catch (e) {}
    }
    function goStage(st){
      stepStage = st; applyStage();
      showTop(root);
    }
    function nextQ(){
      var all = document.querySelectorAll('.q, h2, label'), i, n;
      for (i = 0; i < all.length; i++) {
        n = all[i];
        if (root.contains(n) || !(root.compareDocumentPosition(n) & 4) || !n.offsetParent) continue;
        showTop(n);
        return;
      }
    }
    function applyStage(){
      if (!o.steps) return;
      var list = chosenList(), n = list.length;
      if (typeof stepStage === 'number' && (stepStage < 0 || stepStage >= n)) stepStage = n ? 'review' : 'pick';
      if (stepStage === 'review' && !n) stepStage = 'pick';
      var isPick = stepStage === 'pick', isRev = stepStage === 'review', isKind = !isPick && !isRev;
      q.style.display = isPick ? '' : 'none';
      help.style.display = isPick ? '' : 'none';
      if (pillRow) pillRow.style.display = isPick ? 'flex' : 'none';
      [find, found, kinds].forEach(function(x){ x.style.display = 'none'; });
      holder.style.display = isKind ? '' : 'none';
      prev.style.display = isKind ? '' : 'none';
      prog.style.display = isKind ? '' : 'none';
      rev.style.display = isRev ? '' : 'none';
      prevSay.style.display = 'none';
      KINDS.forEach(function(x){ kindOn[x.label] = false; });
      if (isKind) {
        var k = list[stepStage];
        kindOn[k.label] = true;
        if (k.key === 'joys' && parts.joys) parts.joys.home();
        prog.textContent = k.label + ' · ' + (stepStage + 1) + ' of ' + n;
      }
      layout(); preview();
      foot.innerHTML = '';
      if (isPick) {
        foot.style.justifyContent = 'flex-end';
        foot.appendChild(stepBtn('Continue', true, !n, function(){ goStage(0); }));
      } else {
        foot.style.justifyContent = 'space-between';
        foot.appendChild(stepBtn('Back', false, false, function(){ goStage(isRev ? n - 1 : (stepStage > 0 ? stepStage - 1 : 'pick')); }));
        foot.appendChild(stepBtn('Continue', true, false, function(){ if (isRev) nextQ(); else goStage(stepStage + 1 < n ? stepStage + 1 : 'review'); }));
      }
    }
    paintKindPills(); syncKindPills();
    paintKinds(); layout(); preview();
    return {
      get: function(){ return { joys: parts.joys.get(), skills: '', cares: parts.cares.get() }; },
      set: function(joys, skills, cares){
        parts.joys.set([joys, skills].filter(Boolean).join(';')); parts.cares.set(cares);
        var jp = parts.joys.picks(), first = null;
        KINDS.forEach(function(k){ if (!first && k.key === 'joys' && jp.some(function(x){ return kindOfTop(x.split(SEP)[0]) === k.label; })) first = k.label; });
        if (!first && parts.cares.picks().length) first = 'Eco/social cause';
        if (first) { KINDS.forEach(function(k){ kindOn[k.label] = false; }); kindOn[first] = true; if (parts.joys) parts.joys.home(); }
        if (o.kindPills) { KINDS.forEach(function(k){ if (kindCount(k)) chosen[k.label] = true; }); if (first) chosen[first] = true; if (o.steps) stepStage = anyChosen() ? 'review' : 'pick'; paintKindPills(); syncKindPills(); }
        if (o.steps) return;
        paintKinds(); layout(); preview();
      }
    };
  };
})();
