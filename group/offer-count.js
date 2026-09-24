(function(){
  var FIELDS = { skills: ['skills', 'professionalServices'], things: ['haves'], spaces: ['haves'], work: ['openToWork'] };
  var HAVE_KIND = { things: 'thing', spaces: 'space' };
  function parse(raw){
    if (Object.prototype.toString.call(raw) === '[object Array]') return raw.length ? raw : null;
    var v = String(raw == null ? '' : raw).trim();
    if (!v) return null;
    var list = v.split(',').map(function(x){ return x.trim().toLowerCase(); }).filter(function(x){ return FIELDS[x]; });
    return list.length ? list : null;
  }
  window.cwGroupOfferCount = function(people, catsRaw){
    var cats = parse(catsRaw);
    var on = function(k){ return !cats || cats.indexOf(k) > -1; };
    var allows = function(field){
      if (!cats) return true;
      var governed = false;
      for (var k in FIELDS) {
        if (FIELDS[k].indexOf(field) === -1) continue;
        governed = true;
        if (cats.indexOf(k) > -1) return true;
      }
      return !governed;
    };
    var haveOk = function(token){
      if (!cats) return true;
      var bits = String(token || '').split(':');
      var kind = bits.length > 1 ? bits[bits.length - 1].trim().toLowerCase() : '';
      for (var k in HAVE_KIND) {
        if (HAVE_KIND[k] !== kind) continue;
        return cats.indexOf(k) > -1;
      }
      return on('things');
    };
    var tok = function(v){ return String(v || '').split('|').filter(function(x){ return x.trim(); }).length; };
    var offers = 0, needs = 0;
    (people || []).forEach(function(p){
      if (!p) return;
      if (allows('skills')) offers += tok(p.skills);
      if (allows('openToWork')) offers += tok(p.openToWork);
      offers += String(p.haves || '').split('|').filter(function(x){ return x.trim() && haveOk(x); }).length;
      needs += tok(p.needs);
    });
    return { offers: offers, needs: needs, count: (people || []).length };
  };
})();
