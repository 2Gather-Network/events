(function (w) {
  if (w.cwRequiredMissing) { return; }
  function has(v) { return String(v == null ? '' : v).split(/[|,]/).some(function (x) { return String(x).trim(); }); }
  w.CW_REQUIRED = [
    { step: 'start',  label: 'your photo',                     ok: function (d) { return !!String(d.photoURL || d.photo || '').trim(); } },
    { step: 'start',  label: 'where you are',                  ok: function (d) { return !!String(d.location || '').trim(); } },
  ];
  w.cwRequiredMissing = function (d) {
    d = d || {};
    return w.CW_REQUIRED.filter(function (r) { return !r.ok(d); }).map(function (r) { return { step: r.step, label: r.label }; });
  };
})(window);
