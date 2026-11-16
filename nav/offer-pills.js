(function () {
  var CSS = '.cwop{font-family:inherit;color:#1A2E42;}'
    + '.cwop .cwop-kinds{display:flex;flex-wrap:wrap;gap:8px;}'
    + '.cwop .cwop-pill{font:inherit;font-size:14px;font-weight:700;background:#fff;color:#1F699E;border:1.5px solid #DDE4EE;border-radius:22px;padding:8px 16px;cursor:pointer;}'
    + '.cwop .cwop-pill.on{background:#1F699E;color:#fff;border-color:#1F699E;}'
    + '.cwop .cwop-row{display:flex;gap:8px;align-items:center;margin-top:8px;}'
    + '.cwop .cwop-inp{flex:1;min-width:0;box-sizing:border-box;font:inherit;font-size:14.5px;border:1.5px solid #DDE4EE;border-radius:10px;padding:10px 12px;margin:0;background:#fff;}'
    + '.cwop .cwop-det{width:100%;box-sizing:border-box;font:inherit;font-size:14.5px;border:1.5px solid #DDE4EE;border-radius:10px;padding:10px 12px;background:#fff;}'
    + '.cwop .cwop-btn{font:inherit;font-size:14px;font-weight:700;background:#1F699E;color:#fff;border:0;border-radius:22px;height:38px;padding:0 18px;cursor:pointer;}'
    + '.cwop .cwop-lab{display:block;font-weight:700;font-size:14px;margin:10px 0 4px;}'
    + '.cwop .cwop-err{margin:6px 0 0;font-size:13px;font-weight:700;color:#B3261E;}'
    + '.cwop .cwop-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}'
    + '.cwop .cwop-chip{background:#EAF2FA;color:#1A2E42;border:1px solid #C9DFF3;border-radius:16px;padding:5px 12px;font-size:13px;font-weight:700;}'
    + '.cwop [hidden]{display:none !important;}';
  var KINDS = ['Skill', 'Place', 'Thing'];
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) { e.className = cls; }
    if (text) { e.textContent = text; }
    return e;
  }
  function mount(host, opts) {
    opts = opts || {};
    if (!document.getElementById('cwop-css')) {
      var st = document.createElement('style');
      st.id = 'cwop-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    var kinds = opts.kinds || KINDS;
    var root = el('div', 'cwop');
    var kindBox = el('div', 'cwop-kinds');
    var row = el('div', 'cwop-row');
    var inp = el('input', 'cwop-inp');
    inp.type = 'text';
    inp.setAttribute('aria-label', opts.inputLabel || 'What I offer');
    inp.placeholder = opts.placeholder || 'Ex: pottery lessons';
    var add = el('button', 'cwop-btn', 'Add');
    add.type = 'button';
    row.appendChild(inp);
    row.appendChild(add);
    var tags = el('div', 'cwop-tags');
    var detBox = el('div');
    var lab = el('label', 'cwop-lab', 'Details about it');
    var det = el('textarea', 'cwop-det');
    det.rows = 3;
    det.id = 'cwop-det-' + Math.random().toString(36).slice(2, 8);
    lab.setAttribute('for', det.id);
    det.placeholder = opts.detailsPlaceholder || 'Ex: Saturday mornings, all levels, I bring the clay';
    var err = el('p', 'cwop-err', 'Add details before you tap Done.');
    err.setAttribute('role', 'alert');
    var ok = el('button', 'cwop-btn', 'Done');
    ok.type = 'button';
    ok.style.marginTop = '8px';
    detBox.appendChild(lab);
    detBox.appendChild(det);
    detBox.appendChild(err);
    detBox.appendChild(ok);
    row.hidden = true;
    detBox.hidden = true;
    err.hidden = true;
    root.appendChild(kindBox);
    root.appendChild(row);
    root.appendChild(tags);
    root.appendChild(detBox);
    var pills = kinds.map(function (k) {
      var b = el('button', 'cwop-pill', k);
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('data-kind', k);
      kindBox.appendChild(b);
      return b;
    });
    var cur = '';
    var pending = null;
    function reset() {
      cur = '';
      pending = null;
      kindBox.hidden = false;
      pills.forEach(function (b) { b.hidden = false; b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
      row.hidden = true;
      detBox.hidden = true;
      err.hidden = true;
      inp.value = '';
      det.value = '';
    }
    pills.forEach(function (b) {
      b.addEventListener('click', function () {
        cur = b.getAttribute('data-kind');
        pills.forEach(function (x) {
          var me = x === b;
          x.hidden = !me;
          x.classList.toggle('on', me);
          x.setAttribute('aria-pressed', me ? 'true' : 'false');
        });
        row.hidden = false;
        detBox.hidden = true;
        inp.focus();
      });
    });
    function take() {
      var v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      pending = { kind: cur, name: v, details: '' };
      var chip = el('span', 'cwop-chip', cur + ': ' + v);
      pending.chip = chip;
      tags.appendChild(chip);
      inp.value = '';
      kindBox.hidden = true;
      row.hidden = true;
      detBox.hidden = false;
      det.value = '';
      det.focus();
    }
    add.addEventListener('click', take);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); take(); }
    });
    det.addEventListener('input', function () { err.hidden = true; });
    ok.addEventListener('click', function () {
      var d = det.value.trim();
      if (!d) { err.hidden = false; det.focus(); return; }
      if (!pending) { reset(); return; }
      pending.details = d;
      pending.chip.textContent = pending.kind + ': ' + pending.name + ' \u00B7 ' + d;
      var done = { kind: pending.kind, name: pending.name, details: d, chip: pending.chip };
      reset();
      if (opts.onDone) { opts.onDone({ kind: done.kind, name: done.name, details: done.details }, done.chip); }
    });
    host.appendChild(root);
    return { reset: reset, root: root };
  }
  window.cwOfferPills = mount;
})();
