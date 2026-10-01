(function (w) {
  if (w.cwRequiredMissing) { return; }
  function has(v) { return String(v == null ? '' : v).split(/[|,]/).some(function (x) { return String(x).trim(); }); }
  w.CW_REQUIRED = [
    { step: 'start',  label: 'your photo',                     ok: function (d) { return !!String(d.photoURL || d.photo || '').trim(); } },
    { step: 'start',  label: 'where you are',                  ok: function (d) { return !!String(d.location || '').trim(); } },
    { step: 'start',  label: 'your postal code',               ok: function (d) { return !!String(d.postal || '').trim(); } },
    { step: 'start',  label: 'a language',                     ok: function (d) { return has(d.languages); } },
    { step: 'joys',   label: 'one thing you enjoy',            ok: function (d) { return has(d.interests) || has(d.introEnjoy); } },
    { step: 'cares',  label: 'one thing you care about',       ok: function (d) { return has(d.values) || has(d.introValues) || has(d.domains); } },
    { step: 'skills', label: 'what comes most naturally to you', ok: function (d) { return has(d.methods); } },
    { step: 'skills', label: 'one skill',                      ok: function (d) { return has(d.skills) || has(d.introSkills); } },
    { step: 'skills', label: 'how you like to be appreciated', ok: function (d) { return has(d.appreciation); } }
  ];
  w.cwRequiredMissing = function (d) {
    d = d || {};
    return w.CW_REQUIRED.filter(function (r) { return !r.ok(d); }).map(function (r) { return { step: r.step, label: r.label }; });
  };
})(window);
