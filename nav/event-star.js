(function(){
  var GS = "https://cw-api-gate.jessieupp.workers.dev";
  var on = true;
  var starred = null, loading = false;
  var PTS = '12,3 14.8,9 21.3,9.7 16.4,14.1 17.8,20.6 12,17.3 6.2,20.6 7.6,14.1 2.7,9.7 9.2,9';
  function me(){
    var id = '';
    try { id = (window.getRealMemberId && getRealMemberId()) || (window.getMemberId && getMemberId()) || ''; } catch (e) {}
    return String(id || '').trim();
  }
  function icon(s){
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (s ? '#1F699E' : 'none') + '" stroke="' + (s ? '#1F699E' : '#6B7A8D') + '" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><polygon points="' + PTS + '"/></svg>';
  }
  function paint(btn){
    var s = !!(starred && starred[btn.getAttribute('data-ev')]);
    btn.classList.toggle('on', s);
    btn.innerHTML = icon(s);
    btn.setAttribute('aria-pressed', s ? 'true' : 'false');
    btn.title = s ? 'Starred' : 'Star this event';
  }
  function paintAll(){
    var all = document.querySelectorAll('.ev-star[data-ev]');
    for (var i = 0; i < all.length; i++) paint(all[i]);
  }
  function load(){
    if (starred || loading || !me()) return;
    loading = true;
    fetch(GS + '?action=getEventStars&appearId=' + encodeURIComponent(me()) + '&nocache=1&t=' + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(d){
        starred = {};
        ((d && d.events) || []).forEach(function(x){ starred[x] = true; });
        paintAll();
      })
      .catch(function(){ loading = false; });
  }
  function toggle(btn){
    var id = me(), ev = btn.getAttribute('data-ev');
    if (!id || !ev) return;
    if (!starred) starred = {};
    var want = !starred[ev];
    if (want) starred[ev] = true; else delete starred[ev];
    paintAll();
    fetch(GS + '?action=setEventStar&appearId=' + encodeURIComponent(id) + '&eventId=' + encodeURIComponent(ev) + '&on=' + (want ? 'true' : 'false') + '&nocache=1&t=' + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(d){ if (!d || d.status !== 'ok') throw new Error('not saved'); })
      .catch(function(){
        if (want) delete starred[ev]; else starred[ev] = true;
        paintAll();
      });
  }
  if (on) {
    var css = document.createElement('style');
    css.textContent = '.ev-star{margin-left:auto;width:30px;height:30px;box-sizing:border-box;border:1px solid #D5E1EC;border-radius:50%;background:transparent;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;flex:0 0 30px;}.ev-star.on{border-color:#1F699E;}.ev-star:focus-visible{outline:2px solid #1F699E;outline-offset:2px;}';
    document.head.appendChild(css);
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.ev-star');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    toggle(b);
  }, true);
  window.cwEventStar = function(eventId){
    if (!on || !eventId || !me()) return '';
    setTimeout(load, 0);
    var s = !!(starred && starred[eventId]);
    return '<button type="button" class="ev-star' + (s ? ' on' : '') + '" data-ev="' + String(eventId).replace(/"/g, '&quot;') + '" aria-pressed="' + (s ? 'true' : 'false') + '" title="' + (s ? 'Starred' : 'Star this event') + '">' + icon(s) + '</button>';
  };
})();
