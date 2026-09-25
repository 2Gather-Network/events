(function(){
  window.cwEventMatchOf = function(ev, interests){
    var haystack = [ev.title, ev.keywords, ev.categories, ev.description, ev.host, ev.location, ev.venue, ev.experience]
      .filter(Boolean).join(' ').toLowerCase();
    var whole = function(p){
      return new RegExp('(^|[^a-z0-9])' + String(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)', 'i').test(haystack);
    };
    var full = [], partial = [];
    (interests || []).forEach(function(kw){
      var t = String(kw || '').trim();
      if (!t) return;
      if (t.charAt(0) === '"' && t.charAt(t.length - 1) === '"') {
        var q = t.slice(1, -1).toLowerCase();
        if (q && haystack.indexOf(q) > -1) full.push(t.slice(1, -1));
        return;
      }
      if (whole(t.toLowerCase())) { full.push(t); return; }
      var hit = t.split(/\s+/)
        .map(function(w){ return w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); })
        .filter(function(c){ return c.length > 2 && whole(c); });
      if (hit.length) partial.push({ topic: t, words: hit });
    });
    return { full: full, partial: partial, any: !!(full.length || partial.length) };
  };
  window.cwSplitTopics = function(v){
    var raw = String(v || '');
    return raw.split(raw.indexOf('|') > -1 ? '|' : ',').map(function(x){ return x.trim(); }).filter(Boolean);
  };
})();
