(function(){
  var SEP = ' › ';
  var REC = 'Recreation & Hobbies';
  var REC_KINDS = ['Sports', 'Outdoor & Nature', 'Making & Collecting', 'Movement & Performance', 'Games & Strategy'];
  var GATE = 'https://cw-api-gate.jessieupp.workers.dev';
  var _p = null;
  function node(name, emoji){ return { name: name, emoji: emoji || '', kids: [] }; }
  function kid(n, name){ for (var i = 0; i < n.kids.length; i++) if (n.kids[i].name === name) return n.kids[i]; var k = node(name); n.kids.push(k); return k; }
  function leaf(n, name){ if (!n.kids.some(function(k){ return k.name === name; })) n.kids.push(node(name)); }
  function data(){
    if (_p) return _p;
    var j = function(a){ return fetch(GATE + '?action=' + a).then(function(r){ return r.json(); }); };
    _p = Promise.all([j('getCategories'), j('getReferenceData')]).then(function(res){ return { cats: (res[0] && res[0].categories) || [], rd: res[1] || {} }; });
    _p.catch(function(){ _p = null; });
    return _p;
  }
  window.cwCategorySep = SEP;
  window.cwRecKinds = REC_KINDS.slice();
  window.cwCategoryTree = function(opts){
    opts = opts || {};
    var skillsMode = opts.skills === 'fallback' ? 'fallback' : 'always';
    return data().then(function(d){
      var tops = {}, emoji = {}, order = [];
      var top = function(name, e){
        name = String(name || '').trim();
        if (!name) return null;
        if (!tops[name]) { tops[name] = node(name, e || emoji[name.toLowerCase()] || ''); order.push(name); }
        return tops[name];
      };
      d.cats.forEach(function(c){ if (c && c.label) emoji[String(c.label).toLowerCase()] = c.emoji || ''; });
      d.cats.forEach(function(c){ if (c && c.label) top(c.label); });
      var rec = top(REC);
      REC_KINDS.forEach(function(k){ kid(rec, k); });
      var recPath = {};
      REC_KINDS.forEach(function(k){ recPath[k.toLowerCase()] = [REC, k]; });
      var hasRec = {};
      (d.rd.recreation || []).forEach(function(r){
        if (!r || !r.item) return;
        var t = top(String(r.parent || '').trim() || REC);
        hasRec[t.name] = 1;
        var path = [t.name], at = t;
        if (r.recType) { at = kid(at, String(r.recType).trim()); path.push(at.name); recPath[at.name.toLowerCase()] = path.slice(); }
        if (r.category) { at = kid(at, String(r.category).trim()); path.push(at.name); recPath[at.name.toLowerCase()] = path.slice(); }
        leaf(at, String(r.item).trim());
      });
      (d.rd.skills || []).forEach(function(s){
        if (!s || !s.item) return;
        var c = String(s.category || '').trim();
        if (!c) return;
        var p = recPath[c.toLowerCase()];
        if (p && !tops[c]) {
          var at = tops[p[0]] || top(p[0]);
          p.slice(1).forEach(function(part){ at = kid(at, part); });
          leaf(at, String(s.item).trim());
          return;
        }
        var t = top(c);
        if (skillsMode === 'fallback' && hasRec[t.name]) return;
        leaf(t, String(s.item).trim());
      });
      return order.map(function(n){ return tops[n]; })
        .filter(function(n){ return n.kids.length || n.name === REC || emoji[n.name.toLowerCase()] !== undefined; })
        .sort(function(a, b){ return a.name.localeCompare(b.name); });
    });
  };
})();
