(function () {
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
  var css = '.cw-hr p{margin:0 0 10px;font-size:14px;line-height:1.55;color:#374151;}'
    + '.cw-hr h4{margin:0 0 6px;font-size:15px;font-weight:800;color:#1A2E42;}'
    + '.cw-hr textarea{width:100%;box-sizing:border-box;border:1.5px solid #C9D6E2;border-radius:12px;padding:9px 12px;font:inherit;font-size:14px;min-height:72px;resize:vertical;color:#1A2E42;}'
    + '.cw-hr .cw-hr-n{font-size:12px;color:#5A6473;text-align:right;margin:2px 0 8px;}'
    + '.cw-hr .cw-hr-go{width:100%;}'
    + '.cw-hr .cw-hr-say{margin-top:10px;font-size:14px;line-height:1.5;border-radius:10px;padding:10px 14px;}'
    + '.cw-hr .cw-hr-say.ok{background:#E8F2F9;color:#1A2E42;}'
    + '.cw-hr .cw-hr-say.err{background:#FBE9E7;color:#7A2410;}';
  function addCss() {
    if (document.getElementById('cw-hr-css')) return;
    var s = document.createElement('style'); s.id = 'cw-hr-css'; s.textContent = css; document.head.appendChild(s);
  }
  function who() {
    try {
      var CW = window.CW || {};
      var me = CW.me ? CW.me() : {}, real = CW.realMe ? CW.realMe() : {};
      return { id: String((real && real.id) || ''), pass: CW.passParam ? CW.passParam() : '', viewing: !!(me && me.viewing) };
    } catch (e) { return { id: '', pass: '', viewing: false }; }
  }
  window.cwHostReqHTML = function (ev) {
    addCss();
    var id = esc(String(ev && ev.id || ''));
    return '<div class="cw-hr" data-ev="' + id + '">'
      + '<p>If you are the host of this event, you can ask for edit privileges. Once approved, it is yours to edit as you wish.</p>'
      + '<h4>Ask to host ' + esc(String(ev && ev.title || 'this event')) + '</h4>'
      + '<textarea maxlength="300" placeholder="A note for the 2Gather team (optional)" aria-label="A note for the 2Gather team, optional" oninput="cwHostReqCount(this)"></textarea>'
      + '<div class="cw-hr-n">0 of 300</div>'
      + '<button type="button" class="btn btn-outline cw-hr-go" onclick="cwHostReqSend(this)">Send request</button>'
      + '<div class="cw-hr-say" hidden></div>'
      + '</div>';
  };
  window.cwHostReqCount = function (ta) {
    var n = ta.parentNode.querySelector('.cw-hr-n'); if (n) n.textContent = String(ta.value.length) + ' of 300';
  };
  function tell(box, html, ok) {
    var s = box.querySelector('.cw-hr-say'); if (!s) return;
    s.className = 'cw-hr-say ' + (ok ? 'ok' : 'err'); s.innerHTML = html; s.hidden = false;
  }
  window.cwHostReqSend = function (btn) {
    var box = btn.closest('.cw-hr'); if (!box) return;
    var evId = box.getAttribute('data-ev'), ta = box.querySelector('textarea'), w = who();
    if (w.viewing) { tell(box, 'Stop viewing as someone else first. Only you can ask for yourself.', false); return; }
    if (!w.id || !w.pass) { tell(box, '<a href="https://2gather.network/signin/" style="font-weight:700;">Sign in</a> to ask to host this event.', false); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(GS + '?action=socialize&hostRequest=1&id=' + encodeURIComponent(evId) + '&note=' + encodeURIComponent(ta ? ta.value : '') + '&appearId=' + encodeURIComponent(w.id) + w.pass + '&t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.status === 'ok') {
          if (ta) ta.disabled = true;
          btn.hidden = true;
          tell(box, 'Sent. A 2Gather admin will look at it and email you.', true);
          return;
        }
        btn.disabled = false; btn.textContent = 'Send request';
        if (d && d.code === 'profile') { tell(box, esc(d.message) + ' <a href="https://2gather.network/me/?mine=1" style="font-weight:700;">Open my profile</a>', false); return; }
        if (d && d.code === 'signin') { tell(box, '<a href="https://2gather.network/signin/" style="font-weight:700;">Sign in</a> again to ask to host this event.', false); return; }
        if (d && d.code === 'asked') { btn.hidden = true; if (ta) ta.disabled = true; tell(box, esc(d.message), true); return; }
        tell(box, esc((d && d.message) || 'That did not go through. Try again.'), false);
      })
      .catch(function () { btn.disabled = false; btn.textContent = 'Send request'; tell(box, 'Could not reach the server. Try again in a moment.', false); });
  };
})();
