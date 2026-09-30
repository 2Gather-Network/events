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
  var TOPIC_REC = { 'sports': 'Play', 'games & strategy': 'Play', 'movement & performance': 'Movement', 'outdoor & nature': 'Outdoors', 'music': 'Arts' };
  var TOPIC_SUB = { 'visual art': 'Arts', 'textile & fiber': 'Arts', 'wood, metal & jewelry': 'Building & Repurposing', 'paper & books': 'Arts', 'photo, film & digital': 'Arts', 'collecting': 'Play' };
  var TOPIC_SKILL = { 'arts & culture': 'Arts', 'food & drink': 'Food & Drink', 'physical wellbeing': 'Medicine', 'mental wellbeing': 'Medicine', 'family wellbeing': 'Home Life', 'self-expression & beauty': 'Personal Care', 'home & construction': 'Building & Repurposing', 'transportation': 'Transportation', 'mechanical & manufacturing': 'Building & Repurposing', 'business & finance': 'Business', 'community & civic': 'Community & Culture', 'recreation & hobbies': 'Play', 'technology & communications': 'Technology', 'nature & outdoors': 'Outdoors', 'social events & gatherings': 'Community & Culture', 'events & gatherings': 'Community & Culture', 'pets & animal care': 'Animals', 'making & collecting': 'Arts', 'basic needs and security': 'Community & Culture' };
  window.cwTopicFor = function(name){ var k = String(name || '').trim().toLowerCase(); return TOPIC_SUB[k] || TOPIC_REC[k] || TOPIC_SKILL[k] || (k === 'arts & culture' ? 'Arts' : ''); };
  window.cwTopicWhere = function(){ return cwCategoryTree({ skills: 'none', topics: true }).then(function(roots){ var order = [], where = {}; (roots || []).forEach(function(n){ order.push(n.name); where[n.name.toLowerCase()] = n.name; (n.kids || []).forEach(function(k){ var w = String(k.name).toLowerCase(); if (!where[w]) where[w] = n.name; }); }); return { order: order, where: where }; }); };
  function topicTree(rd, skillsMode, skillsOnly){
    var out = [], by = {}, seen = {};
    rd.topicCategories.forEach(function(t){ var n = node(String(t.label || '').trim(), t.emoji || ''); if (!n.name) return; by[n.name.toLowerCase()] = n; out.push(n); });
    var put = function(word, cat){ word = String(word || '').trim(); var n = by[String(cat || '').toLowerCase()]; if (!word || !n) return; var k = n.name + '|' + word.toLowerCase(); if (seen[k]) return; seen[k] = 1; n.kids.push(node(word)); };
    if (!skillsOnly) rd.topicCategories.forEach(function(t){ (t.examples || []).forEach(function(w){ w = String(w || '').trim(); if (w) put(w.charAt(0).toUpperCase() + w.slice(1), t.label); }); });
    (skillsOnly ? [] : (rd.recreation || [])).forEach(function(r){
      if (!r || !r.item || String(r.item).toLowerCase() === 'arts & culture') return;
      var sb = String(r.category || '').toLowerCase(), ty = String(r.recType || '').toLowerCase(), pa = String(r.parent || '').toLowerCase();
      put(r.item, TOPIC_SUB[sb] || TOPIC_REC[ty] || (pa === 'arts & culture' ? 'Arts' : 'Play'));
    });
    if (skillsMode !== 'none') (rd.skills || []).forEach(function(s){ if (s && s.item) put(s.item, TOPIC_SKILL[String(s.category || '').toLowerCase()]); });
    return out;
  }
  window.cwCategoryTree = function(opts){
    opts = opts || {};
    var skillsMode = opts.skills === 'fallback' ? 'fallback' : (opts.skills === 'none' ? 'none' : 'always');
    return data().then(function(d){
      if (opts.topics && Array.isArray(d.rd.topicCategories) && d.rd.topicCategories.length) return topicTree(d.rd, skillsMode, !!opts.skillsOnly);
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
      (skillsMode === 'none' ? [] : (d.rd.skills || [])).forEach(function(s){
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
        .filter(function(n){ return emoji[n.name.toLowerCase()] !== undefined; })
        .sort(function(a, b){ return a.name.localeCompare(b.name); });
    });
  };
})();
