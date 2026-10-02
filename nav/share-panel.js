(function(){
  function el(tag, css, text){ var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  var BTN = 'flex:1 1 0;min-width:0;font:inherit;font-size:15px;font-weight:700;color:#1F699E;background:#fff;border:1.5px solid #1F699E;border-radius:10px;padding:10px 8px;cursor:pointer;';
  function loadQrLib(done, fail){
    if (window.QRious) return done();
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
    s.onload = done; s.onerror = fail;
    document.head.appendChild(s);
  }
  window.cwSharePanel = function(o){
    var host = o.after;
    if (!host || !host.parentNode) return null;
    var old = document.getElementById('cw-share-panel');
    if (old) { old.remove(); if (old._for === o.url) return null; }
    var box = el('div', 'margin-top:12px;text-align:left;background:#fff;border:1.5px solid #C9D6E3;border-radius:14px;padding:16px;position:relative;');
    box.id = 'cw-share-panel'; box._for = o.url;
    var x = el('button', 'position:absolute;top:8px;right:10px;background:none;border:0;font-size:22px;line-height:1;color:#4B5A6D;cursor:pointer;padding:4px;', '×');
    x.type = 'button'; x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', function(){ box.remove(); });
    box.appendChild(x);
    box.appendChild(el('div', 'font-size:18px;font-weight:800;color:#1A2E42;margin:0 24px 6px 0;', o.heading || 'Share'));
    if (o.lede) box.appendChild(el('div', 'font-size:14px;color:#4B5A6D;line-height:1.5;margin-bottom:12px;', o.lede));
    var row = el('div', 'display:flex;gap:8px;');
    var say = el('div', 'font-size:13px;color:#4B5A6D;margin-top:8px;min-height:0;');
    say.setAttribute('role', 'status');
    var qrSlot = el('div', '');
    function tell(t){ say.textContent = t; if (t) setTimeout(function(){ if (say.textContent === t) say.textContent = ''; }, 2500); }
    function mk(label, fn){ var b = el('button', BTN, label); b.type = 'button'; b.addEventListener('click', fn); row.appendChild(b); return b; }
    mk('Copy link', function(){
      try { navigator.clipboard.writeText(o.url).then(function(){ tell('Link copied'); }, function(){ window.prompt('Copy this link', o.url); }); }
      catch (e) { window.prompt('Copy this link', o.url); }
    });
    if (navigator.share) {
      mk('Share', function(){ navigator.share({ title: o.title || document.title, text: o.text || '', url: o.url }).catch(function(){}); });
    }
    mk('QR', function(){
      if (qrSlot.firstChild) { qrSlot.innerHTML = ''; return; }
      var wrap = el('div', 'margin-top:12px;text-align:center;border:1.5px solid #DDE4EE;border-radius:12px;padding:12px;');
      var wait = el('div', 'font-size:13px;color:#4B5A6D;padding:12px 0;', 'Making the QR code…');
      wrap.appendChild(wait);
      qrSlot.appendChild(wrap);
      loadQrLib(function(){
        var c = document.createElement('canvas');
        c.style.cssText = 'max-width:100%;border-radius:8px;display:block;margin:0 auto;';
        new window.QRious({ element: c, value: o.url, size: 220, foreground: '#1a1a2e', background: '#ffffff', level: 'H', padding: 12 });
        wait.remove();
        wrap.appendChild(c);
        if (o.title) wrap.appendChild(el('div', 'font-size:13px;font-weight:700;color:#1A2E42;margin-top:8px;', o.title));
        wrap.appendChild(el('div', 'font-size:12px;color:#4B5A6D;word-break:break-all;margin-top:2px;', o.url));
        var dl = el('a', 'display:inline-block;margin-top:10px;font-size:14px;font-weight:700;color:#1F699E;', 'Download PNG');
        dl.href = c.toDataURL('image/png'); dl.download = (o.fileName || 'qr-code') + '.png';
        wrap.appendChild(dl);
      }, function(){ wait.textContent = 'The QR code did not load. Try again in a moment.'; });
    });
    box.appendChild(row);
    box.appendChild(say);
    box.appendChild(qrSlot);
    var done = el('button', 'margin-top:12px;font:inherit;font-size:15px;font-weight:700;color:#fff;background:#1F699E;border:0;border-radius:10px;padding:10px 20px;cursor:pointer;', 'Done');
    done.type = 'button';
    done.addEventListener('click', function(){ box.remove(); });
    box.appendChild(done);
    host.parentNode.insertBefore(box, host.nextSibling);
    return box;
  };
})();
