(function(){
  var KINDS = [
    ['Sports', '⚽'], ['Outdoor & Nature', '\u{1F332}'], ['Making & Collecting', '\u{1F9F6}'],
    ['Movement & Performance', '\u{1F3AD}'], ['Games & Strategy', '\u{1F3B2}']
  ];
  window.cwGroupInterests = function(o){
    var $ = function(id){ return document.getElementById(id); };
    var cats = $(o.cats), inp = $(o.input), addBtn = $(o.add), box = $(o.picks);
    var pq = $(o.previewQ), pc = $(o.previewChips), nm = $(o.name);
    var chip = o.chipClass || 'chip';
    var on = {}, picks = [];
    if (!cats) return { get: function(){ return { kinds: '', choices: '' }; }, set: function(){} };
    cats.innerHTML = '';
    KINDS.forEach(function(k){
      var d = document.createElement('div'); d.className = chip;
      d.setAttribute('data-kind', k[0]);
      d.textContent = k[1] + ' ' + k[0];
      d.addEventListener('click', function(){ on[k[0]] = !on[k[0]]; draw(); });
      cats.appendChild(d);
    });
    function draw(){
      Array.prototype.forEach.call(cats.children, function(d){ d.classList.toggle('on', !!on[d.getAttribute('data-kind')]); });
      box.innerHTML = '';
      picks.forEach(function(w, i){
        var c = document.createElement('div'); c.className = chip + ' on';
        c.textContent = w + '  ×'; c.title = 'Remove';
        c.addEventListener('click', function(){ picks.splice(i, 1); draw(); });
        box.appendChild(c);
      });
      if (!pq || !pc) return;
      var gname = (nm && nm.value || '').trim() || 'this group';
      pq.textContent = 'What do you enjoy most in ' + gname + '?';
      pc.innerHTML = '';
      var list = picks.length ? picks : KINDS.filter(function(k){ return on[k[0]]; }).map(function(k){ return k[1] + ' ' + k[0]; });
      if (!list.length) {
        var e = document.createElement('span'); e.style.cssText = 'font-size:13px;color:var(--muted,#6B7A8D);';
        e.textContent = 'Pick a kind of interest or add your own choices to see this.';
        pc.appendChild(e); return;
      }
      list.forEach(function(w){ var c = document.createElement('div'); c.className = chip; c.textContent = w; pc.appendChild(c); });
    }
    function add(){
      String(inp.value || '').split(',').forEach(function(w){
        w = w.trim().replace(/\|/g, '');
        if (w && !picks.some(function(p){ return p.toLowerCase() === w.toLowerCase(); })) picks.push(w);
      });
      inp.value = ''; draw();
    }
    if (addBtn) addBtn.addEventListener('click', add);
    if (inp) inp.addEventListener('keydown', function(ev){ if (ev.key === 'Enter') { ev.preventDefault(); add(); } });
    if (nm) nm.addEventListener('input', draw);
    draw();
    return {
      get: function(){
        if (inp && String(inp.value || '').trim()) add();
        return {
          kinds: KINDS.filter(function(k){ return on[k[0]]; }).map(function(k){ return k[0]; }).join(','),
          choices: picks.join('|')
        };
      },
      set: function(kinds, choices){
        on = {};
        String(kinds || '').split(',').forEach(function(k){ k = k.trim(); if (k) on[k] = true; });
        picks = String(choices || '').split('|').map(function(w){ return w.trim(); }).filter(Boolean);
        draw();
      }
    };
  };
})();
