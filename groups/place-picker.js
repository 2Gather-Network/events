(function () {
  var REGIONS = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Antarctica'];
  var NA = ['United States', 'Canada', 'Mexico'];
  var US = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
  var ABBR = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","District of Columbia":"DC","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"};
  var LEVELS = ['region', 'country', 'state', 'county', 'city'];
  var LABELS = { region: 'Region', country: 'Country', state: 'State', county: 'County', city: 'City' };
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var placesP = null, places = null;

  function el(tag, style, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute('style', style);
    if (text != null) n.textContent = text;
    return n;
  }

  function loadPlaces(done) {
    if (places) { done(); return; }
    if (!placesP) {
      placesP = fetch(GS + '?action=getPlaces').then(function (r) { return r.json(); }).then(function (d) {
        if (d && d.counties) places = d; else placesP = null;
      }).catch(function () { placesP = null; });
    }
    placesP.then(done);
  }

  function hostPlace(meId, cb) {
    var tok = '';
    try { tok = localStorage.getItem('cw-token') || ''; } catch (e) {}
    if (!meId) { cb({}); return; }
    fetch(GS + '?action=getProfile&appearId=' + encodeURIComponent(meId) + '&meToken=' + encodeURIComponent(tok))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var data = (d && d.found && d.data) ? d.data : {};
        var loc = String(data.location || '').trim();
        var bits = loc.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
        var tail = bits.length ? bits[bits.length - 1] : '';
        var out = { region: '', country: '', state: '', county: String(data.county || '').trim(), city: String(data.city || '').trim() };
        if (tail === 'United States') { out.region = 'North America'; out.country = 'United States'; out.state = bits.length > 1 ? bits[0] : ''; }
        else if (NA.indexOf(tail) > -1) { out.region = 'North America'; out.country = tail; }
        else if (REGIONS.indexOf(tail) > -1) { out.region = tail; }
        cb(out);
      })
      .catch(function () { cb({}); });
  }

  window.cwGroupPlacePicker = function (o) {
    var root = document.getElementById(o.root);
    var chip = o.chipClass || 'chip';
    if (!root) return { get: function () { return {}; }, set: function () {} };
    var state = { level: 'county', v: { region: '', country: '', state: '', county: '', city: '', zip: '' }, host: {}, edit: false };
    var pills = el('div', 'display:flex;gap:6px;flex-wrap:wrap;');
    var box = el('div', 'margin-top:12px;border:1.5px solid #C9DFF3;background:#F7FBFF;border-radius:12px;padding:12px 14px;');
    var shown = el('div', 'font-size:14px;color:#1A2E42;line-height:1.5;');
    var val = el('div', 'font-size:16px;font-weight:700;color:#1A2E42;margin:2px 0 6px;');
    var ask = el('div', 'font-size:14px;color:#1A2E42;margin-bottom:8px;', 'Is that right?');
    var yn = el('div', 'display:flex;gap:6px;');
    var yes = el('div', '', 'Yes'), no = el('div', '', 'No');
    yes.className = chip; no.className = chip;
    yn.appendChild(yes); yn.appendChild(no);
    var pick = el('div', 'display:none;margin-top:12px;');
    pick.appendChild(el('div', 'font-size:13.5px;color:#4B5A6D;margin-bottom:6px;', 'Choose where this group serves'));
    var row = el('div', 'display:flex;flex-wrap:wrap;gap:8px;');
    pick.appendChild(row);
    var fieldStyle = 'flex:1 1 150px;min-width:140px;font:inherit;font-size:15px;padding:11px 12px;border:1.5px solid #C9DFF3;border-radius:12px;background:#fff;color:#1A2E42;';
    var selStyle = fieldStyle + 'appearance:none;-webkit-appearance:none;padding-right:40px;background-repeat:no-repeat;background-position:right 17px center;background-size:12px 8px;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath d=\'M1 1.5l5 5 5-5\' fill=\'none\' stroke=\'%231A2E42\' stroke-width=\'1.8\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E");';
    var sel = {};
    function mkSel(key, ph) {
      var s = el('select', selStyle);
      s.setAttribute('aria-label', ph);
      sel[key] = s;
      s.addEventListener('change', function () {
        state.v[key] = s.value;
        var i = LEVELS.indexOf(key);
        for (var j = i + 1; j < LEVELS.length; j++) state.v[LEVELS[j]] = '';
        state.v.zip = '';
        draw();
      });
      row.appendChild(s);
    }
    ['region', 'country', 'state', 'county'].forEach(function (k) { mkSel(k, LABELS[k]); });
    var city = el('input', fieldStyle);
    city.setAttribute('list', o.root + '-cities');
    city.placeholder = 'City (type or pick)';
    var cities = document.createElement('datalist');
    cities.id = o.root + '-cities';
    city.addEventListener('input', function () { state.v.city = city.value.trim(); if (!state.v.city) state.v.zip = ''; drawLine(); });
    row.appendChild(city); row.appendChild(cities);
    var zip = el('input', fieldStyle);
    zip.setAttribute('inputmode', 'numeric');
    zip.setAttribute('maxlength', '5');
    zip.placeholder = 'Zip code (optional)';
    zip.addEventListener('input', function () { zip.value = zip.value.replace(/[^0-9]/g, '').slice(0, 5); state.v.zip = zip.value; drawLine(); });
    row.appendChild(zip);
    box.appendChild(shown); box.appendChild(val); box.appendChild(ask); box.appendChild(yn); box.appendChild(pick);
    root.appendChild(pills); root.appendChild(box);

    function fill(s, list, current, ph) {
      s.innerHTML = '';
      var o0 = document.createElement('option'); o0.value = ''; o0.textContent = ph; s.appendChild(o0);
      list.forEach(function (x) { var op = document.createElement('option'); op.value = x; op.textContent = x; s.appendChild(op); });
      s.value = list.indexOf(current) > -1 ? current : '';
    }
    function textFor(v, level) {
      var st = v.state ? ', ' + v.state : '';
      if (level === 'city') return v.city ? v.city + st + (v.state ? '' : '') : '';
      if (level === 'county') return v.county ? v.county + st : '';
      if (level === 'state') return v.state ? v.state + (v.country ? ', ' + v.country : '') : '';
      if (level === 'country') return v.country || '';
      return v.region || '';
    }
    function current() { return (state.edit || state.saved) ? state.v : state.host; }
    function drawLine() {
      var t = textFor(current(), state.level);
      var z = state.edit && state.level === 'city' && state.v.zip ? ' ' + state.v.zip : '';
      shown.textContent = 'This group serves, at the ' + state.level + ' level';
      val.textContent = t ? t + z : 'Choose a place';
      ask.textContent = state.edit ? 'Everyone who can see this group will see: ' + (t ? t + z : 'a place') + '.' : 'Everyone who can see this group will see: ' + (t || 'a place') + '. Is that right?';
    }
    function draw() {
      pills.innerHTML = '';
      LEVELS.forEach(function (k) {
        var p = el('div', '', LABELS[k]);
        p.className = chip + (state.level === k ? ' on' : '');
        p.addEventListener('click', function () { state.level = k; draw(); });
        pills.appendChild(p);
      });
      yes.className = chip + (!state.edit ? ' on' : '');
      no.className = chip + (state.edit ? ' on' : '');
      pick.style.display = state.edit ? 'block' : 'none';
      fill(sel.region, REGIONS, state.v.region, 'Region');
      fill(sel.country, state.v.region === 'North America' ? NA : [], state.v.country, 'Country');
      fill(sel.state, state.v.country === 'United States' ? US : [], state.v.state, 'State');
      var ab = ABBR[state.v.state];
      var counties = (places && ab && places.counties && places.counties[ab]) ? places.counties[ab].slice().sort() : [];
      if (state.v.county && counties.indexOf(state.v.county) < 0 && counties.length) counties.push(state.v.county);
      fill(sel.county, counties, state.v.county, 'County');
      var cl = (places && ab && places.cities && places.cities[ab]) ? places.cities[ab].slice().filter(function (x, i, a) { return a.indexOf(x) === i; }).sort() : [];
      cities.innerHTML = '';
      cl.forEach(function (c) { var op = document.createElement('option'); op.value = c; cities.appendChild(op); });
      city.value = state.v.city;
      zip.value = state.v.zip;
      zip.style.display = state.level === 'city' ? '' : 'none';
      drawLine();
    }
    yes.addEventListener('click', function () {
      state.edit = false;
      if (!state.saved) {
        var h = state.host;
        state.v = { region: h.region || '', country: h.country || '', state: h.state || '', county: h.county || '', city: h.city || '', zip: '' };
      }
      draw();
    });
    no.addEventListener('click', function () {
      if (!state.edit && !state.saved) {
        var h = state.host;
        if (!state.v.region && !state.v.country && !state.v.state) state.v = { region: h.region || '', country: h.country || '', state: h.state || '', county: h.county || '', city: h.city || '', zip: '' };
      }
      state.edit = true;
      loadPlaces(draw);
      draw();
    });
    hostPlace(o.meId, function (h) {
      state.host = h;
      if (!state.saved) {
        state.v = { region: h.region || '', country: h.country || '', state: h.state || '', county: h.county || '', city: h.city || '', zip: '' };
      }
      draw();
    });
    draw();
    return {
      get: function () {
        var out = { level: state.level, region: '', country: '', state: '', county: '', city: '', zip: '' };
        var v = state.edit || state.saved ? state.v : state.host;
        var idx = LEVELS.indexOf(state.level);
        LEVELS.forEach(function (k, i) { out[k] = i <= idx ? String(v[k] || '') : ''; });
        out.zip = state.level === 'city' ? String((state.edit || state.saved ? state.v.zip : '') || '') : '';
        return out;
      },
      set: function (level, vals) {
        if (LEVELS.indexOf(level) > -1) state.level = level;
        vals = vals || {};
        var any = !!(vals.region || vals.country || vals.state || vals.county || vals.city);
        if (any) {
          state.saved = true;
          state.v = { region: vals.region || '', country: vals.country || '', state: vals.state || '', county: vals.county || '', city: vals.city || '', zip: vals.zip || '' };
          state.edit = false;
          loadPlaces(draw);
        }
        draw();
      }
    };
  };
})();
