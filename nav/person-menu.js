(function(){
  if (window.cwPersonMenu) return;
  var ICON = {
    msg: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    plant: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/><path d="M12 16c0-3-2-5-6-5 0 3 2 5 6 5z"/>'
  };
  var CSS = '.cwpm{position:absolute;z-index:9999;background:#fff;border:1.5px solid #DDE4EE;border-radius:14px;padding:6px;width:240px;max-width:calc(100vw - 32px);box-sizing:border-box;font-family:\'Nunito Sans\',\'DM Sans\',system-ui,sans-serif;text-align:left}'
    + '.cwpm[hidden]{display:none}'
    + '.cwpm-n{font-size:13px;font-weight:700;color:#2F3D4F;padding:6px 12px 4px}'
    + '.cwpm-i{display:flex;align-items:center;gap:10px;min-height:44px;padding:0 12px;box-sizing:border-box;border-radius:10px;font-size:14px;font-weight:600;color:#1A2E42;text-decoration:none;line-height:1.3}'
    + '.cwpm-i:hover,.cwpm-i:focus-visible{background:#EEF1F5;outline:none}'
    + '.cwpm-i svg{width:18px;height:18px;flex:none;color:#1F699E}'
    + 'button.cwpm-i{width:100%;text-align:left;background:transparent;border:0;font-family:inherit;cursor:pointer}';
  var box = null, anchorEl = null, thankFn = null, thankOk = null;
  function viewing(){ try { var m = window.CW && CW.me && CW.me(); if (m && m.viewing) return true; if (window.CW && CW.viewingAs && CW.viewingAs()) return true; } catch (e) {} return false; }
  function ensure(){
    if (box) return box;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    box = document.createElement('div'); box.className = 'cwpm'; box.hidden = true; box.setAttribute('role', 'menu');
    document.body.appendChild(box);
    return box;
  }
  function item(icon, words, href, fn){
    var a = document.createElement(href ? 'a' : 'button'); a.className = 'cwpm-i'; a.setAttribute('role', 'menuitem');
    if (href) { a.href = href; } else { a.type = 'button'; a.onclick = function(){ close(); fn(); }; }
    a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[icon] + '</svg>';
    a.appendChild(document.createTextNode(words));
    return a;
  }
  function close(){ if (!box || box.hidden) return; box.hidden = true; if (anchorEl) { try { anchorEl.setAttribute('aria-expanded', 'false'); } catch (e) {} } anchorEl = null; }
  function place(el){
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height && el.firstElementChild) r = el.firstElementChild.getBoundingClientRect();
    var sx = window.pageXOffset || 0, sy = window.pageYOffset || 0;
    var w = box.offsetWidth || 240, vw = document.documentElement.clientWidth || window.innerWidth;
    var left = r.left + sx; if (left + w > sx + vw - 16) left = sx + vw - 16 - w; if (left < sx + 16) left = sx + 16;
    box.style.left = left + 'px'; box.style.top = (r.bottom + sy + 6) + 'px';
  }
  function open(el, o){
    o = o || {};
    var code = String(o.code || '').replace(/^c:/i, '').trim().toLowerCase();
    if (!/^[0-9a-z]{6}$/.test(code)) code = '';
    var prof = String(o.profile || '').trim();
    var b = ensure();
    if (!b.hidden && anchorEl === el) { close(); return; }
    b.innerHTML = '';
    var n = document.createElement('div'); n.className = 'cwpm-n'; n.textContent = String(o.name || '').trim() || 'Someone'; b.appendChild(n);
    var v = viewing();
    if (code && !v) b.appendChild(item('msg', 'Send message', '/messages/?to=' + encodeURIComponent('c:' + code)));
    if (prof) b.appendChild(item('user', 'See profile', prof));
    if (code && !v && thankFn && (!thankOk || thankOk(code))) b.appendChild(item('plant', 'Send appreciation', '', function(){ thankFn(code, String(o.name || '')); }));
    if (b.children.length < 2) { if (prof) { window.location.href = prof; } return; }
    anchorEl = el; try { el.setAttribute('aria-expanded', 'true'); } catch (e) {}
    b.hidden = false; place(el);
    var f = b.querySelector('.cwpm-i'); if (f) { try { f.focus({ preventScroll: true }); } catch (e) {} }
  }
  function mark(el, o){
    if (!el || !o) return el;
    el.setAttribute('data-pm-code', String(o.code || ''));
    el.setAttribute('data-pm-name', String(o.name || ''));
    el.setAttribute('data-pm-prof', String(o.profile || ''));
    el.setAttribute('aria-haspopup', 'menu');
    return el;
  }
  function attrs(o){
    var q = function(s){ return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    return ' data-pm-code="' + q(o.code) + '" data-pm-name="' + q(o.name) + '" data-pm-prof="' + q(o.profile) + '" aria-haspopup="menu"';
  }
  document.addEventListener('click', function(e){
    var t = e.target;
    if (box && !box.hidden && t && t.closest && t.closest('.cwpm')) return;
    var el = t && t.closest ? t.closest('[data-pm-code]') : null;
    if (el && el.getAttribute('data-pm-code')) {
      e.preventDefault(); e.stopPropagation();
      open(el, { code: el.getAttribute('data-pm-code'), name: el.getAttribute('data-pm-name'), profile: el.getAttribute('data-pm-prof') });
      return;
    }
    close();
  }, true);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') { var a = anchorEl; close(); if (a) { try { a.focus(); } catch (x) {} } return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.getAttribute && e.target.getAttribute('data-pm-code')) {
      e.preventDefault(); e.stopPropagation(); e.target.click();
    }
  }, true);
  window.addEventListener('resize', close);
  window.cwPersonMenu = {
    open: open, close: close, mark: mark, attrs: attrs,
    setThank: function(fn, ok){ thankFn = typeof fn === 'function' ? fn : null; thankOk = typeof ok === 'function' ? ok : null; }
  };
})();
