(function (w) {
  if (w.cwSearchSelect) { return; }
  var open = null;
  function close() {
    if (!open) { return; }
    open.panel.style.display = 'none';
    open.btn.setAttribute('aria-expanded', 'false');
    open = null;
  }
  document.addEventListener('click', function (e) {
    if (open && !open.wrap.contains(e.target)) { close(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); }
  });
  w.cwSearchSelect = function (sel, ph) {
    if (!sel || sel.getAttribute('data-ss')) { return; }
    sel.setAttribute('data-ss', '1');
    var opts = Array.prototype.slice.call(sel.options).filter(function (o) { return o.value; }).map(function (o) { return o.value; });
    var wrap = document.createElement('span');
    wrap.style.cssText = 'position:relative;display:inline-block;';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.style.cssText = sel.style.cssText + 'cursor:pointer;text-align:left;min-width:160px;';
    var first = sel.options[0] ? sel.options[0].textContent : '';
    btn.textContent = sel.value || first;
    var panel = document.createElement('div');
    panel.style.cssText = 'display:none;position:absolute;z-index:50;top:calc(100% + 4px);left:0;min-width:240px;max-width:320px;background:#fff;border:1.5px solid #C9DFF3;border-radius:12px;box-shadow:0 8px 24px rgba(26,46,66,.16);padding:8px;';
    var find = document.createElement('input');
    find.type = 'text';
    find.placeholder = ph || 'Search';
    find.setAttribute('aria-label', ph || 'Search');
    find.style.cssText = 'width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:9px 12px;border:1.5px solid #DDE3EA;border-radius:9px;margin-bottom:6px;';
    var list = document.createElement('div');
    list.setAttribute('role', 'listbox');
    list.style.cssText = 'max-height:260px;overflow-y:auto;';
    function pick(v) {
      sel.value = v;
      btn.textContent = v || first;
      close();
      if (typeof sel.onchange === 'function') { sel.onchange(); }
      else { sel.dispatchEvent(new Event('change')); }
    }
    function paint() {
      var t = String(find.value || '').trim().toLowerCase();
      list.innerHTML = '';
      var shown = opts.filter(function (o) { return !t || o.toLowerCase().indexOf(t) > -1; });
      shown.forEach(function (o) {
        var row = document.createElement('div');
        row.setAttribute('role', 'option');
        row.textContent = o;
        row.style.cssText = 'padding:8px 10px;border-radius:8px;cursor:pointer;font-size:15px;color:#1A2E42;' + (o === sel.value ? 'background:#EAF3FB;font-weight:700;' : '');
        row.addEventListener('mouseenter', function () { if (o !== sel.value) { row.style.background = '#F3F7FB'; } });
        row.addEventListener('mouseleave', function () { if (o !== sel.value) { row.style.background = ''; } });
        row.addEventListener('click', function () { pick(o); });
        list.appendChild(row);
      });
      if (!shown.length) {
        var none = document.createElement('div');
        none.textContent = 'No match';
        none.style.cssText = 'padding:8px 10px;font-size:14px;color:#4B5A6D;';
        list.appendChild(none);
      }
    }
    find.addEventListener('input', paint);
    find.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var firstRow = list.querySelector('[role=option]');
        if (firstRow) { firstRow.click(); }
      }
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (open && open.btn === btn) { close(); return; }
      close();
      find.value = '';
      paint();
      panel.style.display = 'block';
      btn.setAttribute('aria-expanded', 'true');
      open = { wrap: wrap, panel: panel, btn: btn };
      try { find.focus(); } catch (x) {}
    });
    panel.appendChild(find);
    panel.appendChild(list);
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(btn);
    wrap.appendChild(panel);
    wrap.appendChild(sel);
    sel.style.display = 'none';
  };
})(window);
