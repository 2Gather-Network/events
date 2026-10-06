(function(){
  var CSS = '.cwtp{border:1.5px solid #C9DFF3;border-radius:12px;padding:10px;margin-top:10px;background:#fff;font-family:inherit;color:#1A2E42;}'
    + '.cwtp .cwtp-h{font-weight:800;font-size:13px;margin-bottom:8px;}'
    + '.cwtp .cwtp-q{width:100%;box-sizing:border-box;font:inherit;font-size:14.5px;border:1.5px solid #C9DFF3;border-radius:10px;padding:9px 12px;margin:0 0 8px;background:#F7FBFF;-webkit-appearance:none;appearance:none;}'
    + '.cwtp .cwtp-p{display:flex;flex-wrap:wrap;gap:6px;}'
    + '.cwtp .cwtp-sec{margin-top:14px;}'
    + '.cwtp .cwtp-sec:first-child{margin-top:0;}'
    + '.cwtp .cwtp-sub{margin-top:14px;}'
    + '.cwtp .cwtp-n{flex:0 0 100%;font-size:13px;font-weight:700;color:#1A2E42;margin:2px 0 4px;}'
    + '.cwtp .cwtp-pill{font:inherit;font-size:13px;font-weight:700;background:#fff;color:#1F699E;border:1.5px solid #DDE4EE;border-radius:18px;padding:5px 11px;cursor:pointer;white-space:nowrap;}'
    + '.cwtp .cwtp-pill.on{background:#1F699E;color:#fff;border-color:#1F699E;}'
    + '.cwtp .cwtp-pill.other{border:1.5px solid #1F699E;}'
    + '.cwtp .cwtp-emo{display:inline-block;margin-right:.45em;}'
    + '.cwtp .cwtp-line{display:flex;gap:8px;margin-top:8px;max-width:420px;}'
    + '.cwtp .cwtp-inp{flex:1;min-width:0;border:1.5px solid #DDE3EA;background:#F7FBFF;border-radius:10px;padding:8px 12px;font:inherit;font-size:14px;color:#1A2E42;}'
    + '.cwtp .cwtp-btn{font:inherit;font-size:13px;font-weight:700;border-radius:20px;padding:5px 14px;border:0;background:#1F699E;color:#fff;cursor:pointer;}'
    + '.cwtp .cwtp-done{display:flex;justify-content:flex-end;margin-top:14px;}';
  function css(){
    if (document.getElementById('cwtp-css')) { return; }
    var s = document.createElement('style'); s.id = 'cwtp-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) { e.className = cls; } if (text) { e.textContent = text; } return e; }
  function lc(x){ return String(x == null ? '' : x).toLowerCase().trim(); }
  function firstOf(v){ return String(v || '').split('|')[0].trim(); }

  function index(rows){
    var byId = {}, byName = {}, kids = {}, cats = [], seen = {};
    (rows || []).forEach(function(r){
      if (!r || !r[0] || !r[1]) { return; }
      byId[String(r[0])] = r;
      if (!byName[lc(r[1])]) { byName[lc(r[1])] = r; }
      String(r[3] || '').split('|').forEach(function(c){ c = c.trim(); if (c && !seen[c]) { seen[c] = 1; cats.push(c); } });
    });
    Object.keys(byId).forEach(function(id){
      var pid = firstOf(byId[id][2]);
      if (pid && byId[pid]) { (kids[pid] = kids[pid] || []).push(byId[id]); }
    });
    var roots = function(main){
      var out = [];
      Object.keys(byId).forEach(function(id){
        var r = byId[id];
        if (String(r[2] || '').trim()) { return; }
        if (String(r[3] || '').split('|').map(function(x){ return x.trim(); }).indexOf(main) < 0) { return; }
        if (kids[id] && kids[id].length) { out.push(String(r[1]).trim()); }
      });
      return out.sort(function(a, b){ return a.localeCompare(b); });
    };
    return { byId: byId, byName: byName, kids: kids, mainCats: cats, roots: roots };
  }

  function picker(ctx){
    css();
    var root = el('div', 'cwtp');
    if (ctx.title) { root.appendChild(el('div', 'cwtp-h', ctx.title)); }
    var sr = el('input', 'cwtp-q'); sr.type = 'search'; sr.placeholder = '\u{1F50D} Search categories'; sr.setAttribute('aria-label', 'Search the categories'); sr.autocomplete = 'off';
    root.appendChild(sr);
    var pills = el('div', 'cwtp-p'); root.appendChild(pills);
    var subs = el('div', 'cwtp-sub'); root.appendChild(subs);
    var nm = function(r){ return String(r[1]).trim(); };
    var kidsOf = function(r){ return (ctx.kids(String(r[0])) || []).map(nm).sort(function(a, b){ return a.localeCompare(b); }); };

    var levels = function(sec, main, cur, own, idx){
      var path = [], node = cur ? ctx.rowByName(lc(cur)) : null, guard = 0;
      while (node && guard++ < 8) { path.unshift(node); var pid = firstOf(node[2]); node = pid ? ctx.rowById(pid) : null; }
      var setSub = function(v){
        var a = ctx.getA();
        if (idx === 0) { if (v) { a.sub = v; delete a.subOff; } else { delete a.sub; a.subOff = true; } }
        else { a.subs = a.subs || {}; if (v) { a.subs[main] = v; } else { delete a.subs[main]; } }
        ctx.putA(a); if (ctx.redraw) { ctx.redraw(); } else { paint(); }
      };
      var level = function(title, opts, chosen, upName){
        var box = el('div', 'cwtp-sec'); sec.appendChild(box);
        box.appendChild(el('div', 'cwtp-h', title));
        var sp = el('div', 'cwtp-p'); box.appendChild(sp);
        var shown = opts.slice();
        if (chosen && shown.map(lc).indexOf(lc(chosen)) < 0) { shown.push(chosen); }
        shown.forEach(function(o){
          var on = lc(chosen) === lc(o), b = el('button', 'cwtp-pill' + (on ? ' on' : ''), o); b.type = 'button'; b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.addEventListener('click', function(){ setSub(on ? upName : o); });
          sp.appendChild(b);
        });
        var oth = el('button', 'cwtp-pill other', '+ Other'); oth.type = 'button'; sp.appendChild(oth);
        oth.addEventListener('click', function(){
          oth.hidden = true;
          var line = el('div', 'cwtp-line'), inp = el('input', 'cwtp-inp'); inp.type = 'text'; inp.placeholder = 'Type your own'; inp.setAttribute('aria-label', 'Your own word under ' + (upName || main));
          var add = el('button', 'cwtp-btn', 'Add'); add.type = 'button';
          var go = function(){ var v = String(inp.value || '').trim(); if (!v) { inp.focus(); return; } setSub(v.charAt(0).toUpperCase() + v.slice(1)); };
          add.addEventListener('click', go); inp.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); go(); } });
          line.appendChild(inp); line.appendChild(add); box.appendChild(line); setTimeout(function(){ try { inp.focus(); } catch (x) {} }, 0);
        });
      };
      var known = path.length && lc(nm(path[path.length - 1])) === lc(cur || '');
      level('Part of ' + main + ':', ctx.roots(main), known ? nm(path[0]) : (own && !(idx === 0 && ctx.getA().subOff) ? own : ''), '');
      for (var i = 0; known && i < path.length; i++) {
        var kids = kidsOf(path[i]);
        if (!kids.length) { break; }
        level('Part of ' + nm(path[i]) + ':', kids, path[i + 1] ? nm(path[i + 1]) : '', nm(path[i]));
      }
    };

    var paintSubs = function(){
      subs.innerHTML = '';
      if (ctx.subPick === false) { return; }
      ctx.catList().forEach(function(main, idx){
        if (!ctx.multi && idx > 0) { return; }
        if (!ctx.multi && !ctx.roots(main).length) { return; }
        var sec = el('div', 'cwtp-sec'); subs.appendChild(sec);
        var a0 = ctx.getA();
        var cur = idx === 0 ? (a0.sub || (ctx.ownSub ? ctx.ownSub() : '')) : String((a0.subs || {})[main] || '');
        var own = idx === 0 ? a0.sub : (a0.subs || {})[main];
        levels(sec, main, cur, own, idx);
      });
    };

    var paint = function(){
      paintSubs();
      pills.innerHTML = '';
      var q = lc(sr.value), chosen = ctx.catList(), all = ctx.mainCats() || [];
      var shown = all.filter(function(c){ return !q || lc(c).indexOf(q) > -1; });
      if (!shown.length) {
        pills.appendChild(el('div', 'cwtp-n', 'We have a few categories to select from and this isn’t one. Select from the most applicable one below:'));
        shown = all.slice();
      }
      shown.forEach(function(c){
        var on = chosen.indexOf(c) > -1, p = el('button', 'cwtp-pill' + (on ? ' on' : ''), ''), em = ctx.emoji(c);
        if (em) { p.appendChild(el('span', 'cwtp-emo', em)); }
        p.appendChild(document.createTextNode(c)); p.type = 'button'; p.setAttribute('aria-pressed', on ? 'true' : 'false');
        p.addEventListener('click', function(){
          var a = ctx.getA(), list = ctx.catList(), at = list.indexOf(c);
          if (at > -1) { list.splice(at, 1); } else { list.push(c); }
          if (list.length) { a.cats = list; } else { delete a.cats; }
          ctx.putA(a); if (ctx.onCats) { ctx.onCats(list.slice()); }
          paint(); if (ctx.onChange) { ctx.onChange(); }
        });
        pills.appendChild(p);
      });
    };
    sr.addEventListener('input', paint); paint();
    if (ctx.onClose) {
      var dr = el('div', 'cwtp-done'), dn = el('button', 'cwtp-btn', 'Done'); dn.type = 'button'; dn.addEventListener('click', ctx.onClose); dr.appendChild(dn); root.appendChild(dr);
    }
    return { el: root, repaint: paint };
  }

  picker.index = index;
  window.cwTagPicker = picker;
})();
