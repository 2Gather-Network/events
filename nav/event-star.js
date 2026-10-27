(function(){
  var GS = "https://cw-api-gate.jessieupp.workers.dev";
  var on = /[?&]star=1\b/.test(location.search);
  var starred = null, loading = false;
  function me(){
    var id = '';
    try { id = (window.getRealMemberId && getRealMemberId()) || (window.getMemberId && getMemberId()) || ''; } catch (e) {}
    return String(id || '').trim();
  }
  function paint(btn){
    var s = !!(starred && starred[btn.getAttribute('data-ev')]);
    btn.classList.toggle('on', s);
    btn.textContent = s ? '★' : '☆';
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
  var css = document.createElement('style');
  css.textContent = '.ev-star-on #card,.ev-star-on .event-card-img{position:relative;}.ev-star{position:absolute;top:10px;right:10px;width:30px;height:30px;box-sizing:border-box;border:1.5px solid #B9D3EA;border-radius:50%;background:#fff;color:#6B7A8D;font-size:18px;line-height:26px;text-align:center;cursor:pointer;padding:0;z-index:3;}.ev-star.on{color:#D99A00;}.ev-star:focus-visible{outline:2px solid #1F699E;outline-offset:2px;}';
  if (on) { document.head.appendChild(css); document.documentElement.classList.add('ev-star-on'); }
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
    return '<button type="button" class="ev-star' + (s ? ' on' : '') + '" data-ev="' + String(eventId).replace(/"/g, '&quot;') + '" aria-pressed="' + (s ? 'true' : 'false') + '" title="' + (s ? 'Starred' : 'Star this event') + '">' + (s ? '★' : '☆') + '</button>';
  };
})();
