(function(){
  function el(tag, css, text){ var e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; }
  var PILL = 'font:inherit;font-size:13px;font-weight:700;line-height:1.3;color:#1F699E;background:#fff;border:1.5px solid #1F699E;border-radius:24px;padding:7px 14px;cursor:pointer;';
  var FIELD = 'width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:11px 14px;border:1.5px solid #C9DFF3;border-radius:12px;background:#fff;color:#1A2E42;margin-bottom:8px;';
  var PHONE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '') || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches);
  function norm(v){ return String(v || '').split('.').join('').trim().toLowerCase(); }
  function adminTok(groupId, meId){
    var keys = ['cw_admin_' + groupId + '_' + norm(meId), 'cw_admin_super_' + meId];
    for (var k = 0; k < keys.length; k++) {
      try { var o = JSON.parse(localStorage.getItem(keys[k]) || 'null'); if (o && o.token && o.expiresAt > Date.now()) return o.token; } catch (e) {}
    }
    return '';
  }
  window.cwShareInvite = function(o){
    var wrap = el('div', 'margin-top:14px;padding-top:14px;border-top:1.5px solid #DDE4EE;');
    var INNER = o.capsule === 'inner';
    var cap = el('div', INNER ? 'display:flex;gap:4px;border:1.5px solid #1F699E;border-radius:26px;padding:3px;background:#fff;' : 'display:flex;border:1.5px solid #1F699E;border-radius:24px;overflow:hidden;');
    var BS = INNER ? 'flex:1;font:inherit;font-size:13.5px;font-weight:700;padding:8px 6px;border:0;border-radius:22px;cursor:pointer;' : 'flex:1;font:inherit;font-size:13.5px;font-weight:700;padding:9px 6px;border:0;cursor:pointer;';
    var bNet = el('button', BS, 'Invite from my network');
    var bNew = el('button', BS, 'Invite someone new');
    bNet.type = 'button'; bNew.type = 'button';
    cap.appendChild(bNet); cap.appendChild(bNew);
    var secNet = el('div', 'margin-top:14px;'), secNew = el('div', 'margin-top:14px;display:none;');
    function pick(which){
      var net = which === 'net';
      bNet.style.cssText += net ? 'background:#1F699E;color:#fff;' : 'background:#fff;color:#1F699E;';
      bNew.style.cssText += net ? 'background:#fff;color:#1F699E;' : 'background:#1F699E;color:#fff;';
      bNet.setAttribute('aria-pressed', net ? 'true' : 'false'); bNew.setAttribute('aria-pressed', net ? 'false' : 'true');
      secNet.style.display = net ? '' : 'none'; secNew.style.display = net ? 'none' : '';
      if (net) loadNet();
    }
    bNet.addEventListener('click', function(){ pick('net'); });
    bNew.addEventListener('click', function(){ pick('new'); });

    var find = el('input', FIELD); find.type = 'search'; find.placeholder = 'Search my network'; find.setAttribute('aria-label', 'Search my network');
    var list = el('div', ''), netSay = el('div', 'font-size:13px;color:#2F3D4F;margin-top:8px;');
    netSay.setAttribute('role', 'status');
    secNet.appendChild(find); secNet.appendChild(list); secNet.appendChild(netSay);
    var ALL = null, loading = false;
    function draw(){
      list.innerHTML = '';
      if (!ALL) return;
      var q = String(find.value || '').trim().toLowerCase();
      ALL.filter(function(p){ return !q || String(p.name || '').toLowerCase().indexOf(q) > -1; }).forEach(function(p){
        var row = el('div', 'display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #DDE4EE;');
        var nameBox = el('span', 'display:flex;flex-direction:column;');
        nameBox.appendChild(el('span', 'font-size:14.5px;font-weight:700;color:#1A2E42;', p.name));
        if (p.invitedAt) { var dt = new Date(p.invitedAt); nameBox.appendChild(el('span', 'font-size:12px;color:#4B5A6D;margin-top:1px;', 'Invited ' + dt.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()])); }
        row.appendChild(nameBox);
        if (p.done === 'Already in this group') { row.appendChild(el('span', 'font-size:13px;color:#2F3D4F;', p.done)); }
        else {
          var isInv = p.done === 'Invited' || p.done === 'Already invited';
          var b = el('button', isInv ? PILL + 'background:#1F699E;color:#fff;' : PILL, isInv ? 'Edit invite' : (p.done || 'Invite')); b.type = 'button';
          if (isInv) { b.setAttribute('aria-expanded', p.open ? 'true' : 'false'); b.addEventListener('click', function(){ p.open = !p.open; draw(); }); }
          else if (p.done) { b.disabled = true; b.style.cursor = 'default'; }
          if (!isInv && !p.done) b.addEventListener('click', function(){
            b.disabled = true; netSay.textContent = 'Sending…';
            fetch(o.GS_URL + '?action=inviteToGroup&groupId=' + encodeURIComponent(o.groupId) + '&invitedById=' + encodeURIComponent(o.meId) + '&appearIds=' + encodeURIComponent(p.appearId))
              .then(function(r){ return r.json(); })
              .then(function(d){
                if (d && d.status === 'ok') {
                  var sentN = Number(d.sent || 0) > 0, mem = Number(d.alreadyMembers || 0) > 0;
                  p.done = sentN ? 'Invited' : (mem ? 'Already in this group' : 'Already invited'); if (sentN) p.invitedAt = Date.now();
                  draw();
                  netSay.textContent = sentN ? ('Invited ' + p.name + '. Pending until they answer.') : (mem ? (p.name + ' is already in this group.') : (p.name + ' was already invited. Pending until they answer.'));
                }
                else { b.disabled = false; netSay.textContent = (d && d.message) ? d.message : 'That did not go through. Try again.'; }
              })
              .catch(function(){ b.disabled = false; netSay.textContent = 'Could not reach the server. Try again in a moment.'; });
          });
          row.appendChild(b);
        }
        list.appendChild(row);
        if (p.open && (p.done === 'Invited' || p.done === 'Already invited')) {
          var box = el('div', 'padding:10px 12px;margin:0 0 8px;background:#F4F9FE;border:1.5px solid #C9DFF3;border-radius:12px;font-size:13.5px;color:#1A2E42;');
          box.appendChild(el('div', 'font-weight:700;margin-bottom:6px;', p.name + ' was invited. Pending until they answer.'));
          var wait = (o.nudgeAfterMs == null ? 86400000 : o.nudgeAfterMs), left = (p.invitedAt || 0) + wait - Date.now();
          if (p.nudged) { box.appendChild(el('div', '', 'Nudge sent. You can send one nudge, and it has been used.')); }
          else {
            var nb = el('button', PILL, 'Send a nudge'); nb.type = 'button';
            if (p.invitedAt && left > 0) {
              var wm = el('div', 'margin-top:6px;');
              nb.addEventListener('click', function(){ wm.textContent = 'You can send one nudge, 24 hours after the invitation.'; });
              box.appendChild(nb); box.appendChild(wm);
            }
            else {
              nb.addEventListener('click', function(){
                nb.disabled = true;
                fetch(o.GS_URL + '?action=nudgeGroupInvite&groupId=' + encodeURIComponent(o.groupId) + '&invitedById=' + encodeURIComponent(o.meId) + '&appearId=' + encodeURIComponent(p.appearId))
                  .then(function(r){ return r.json(); })
                  .then(function(d){ if (d && d.status === 'ok') { p.nudged = true; draw(); netSay.textContent = 'Nudge sent to ' + p.name + '. That was your one nudge.'; } else { nb.disabled = false; netSay.textContent = (d && d.message) ? d.message : 'That did not go through. Try again.'; } })
                  .catch(function(){ nb.disabled = false; netSay.textContent = 'Could not reach the server. Try again in a moment.'; });
              });
              box.appendChild(nb);
              box.appendChild(el('div', 'margin-top:6px;', 'The nudge is the same invitation again, sent once.'));
            }
          }
          list.appendChild(box);
        }
      });
      if (!list.firstChild) netSay.textContent = ALL.length ? '' : 'You have not bookmarked anyone yet. Open somebody’s profile and press Bookmark, and they will show up here.';
    }
    find.addEventListener('input', draw);
    function loadNet(){
      if (ALL || loading) return;
      loading = true; netSay.textContent = 'Loading information...';
      fetch(o.GS_URL + '?action=getBookmarks&appearId=' + encodeURIComponent(o.meId))
        .then(function(r){ return r.json(); })
        .then(function(d){
          loading = false;
          var arr = (d && d.bookmarks) || [];
          ALL = arr.filter(function(p){ return norm(p.appearId) !== norm(o.meId); }).map(function(p){ return { appearId: p.appearId, name: p.name || p.first || 'Someone' }; });
          netSay.textContent = ''; draw();
        })
        .catch(function(){ loading = false; netSay.textContent = 'Could not reach your bookmarks just now. Reload the page and it will try again.'; });
    }

    secNew.appendChild(el('div', 'font-weight:800;font-size:15px;color:#1A2E42;margin-bottom:4px;', 'Send it for them'));
    secNew.appendChild(el('p', 'font-size:13.5px;color:#2F3D4F;margin:0 0 10px;', 'The same words, sent from 2Gather to one address.'));
    var first = el('input', FIELD); first.type = 'text'; first.placeholder = 'their first name'; first.maxLength = 40; first.setAttribute('aria-label', 'their first name');
    var mail = el('input', FIELD); mail.type = 'email'; mail.placeholder = 'their email address'; mail.setAttribute('aria-label', 'their email address');
    var btns = el('div', 'display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;');
    var send = el('button', 'font:inherit;font-size:14px;font-weight:700;color:#fff;background:#1F699E;border:1.5px solid #1F699E;border-radius:24px;padding:10px 18px;cursor:pointer;', 'Send the invitation'); send.type = 'button';
    btns.appendChild(send);
    if (PHONE) {
      var txt = el('button', PILL + 'padding:10px 18px;font-size:14px;', 'Send a text instead'); txt.type = 'button';
      txt.addEventListener('click', function(){ window.location.href = 'sms:' + (/iPhone|iPad|iPod/i.test(navigator.userAgent || '') ? '&' : '?') + 'body=' + encodeURIComponent((o.text ? o.text + ' ' : '') + o.url); });
      btns.appendChild(txt);
    }
    var newSay = el('div', 'font-size:13px;color:#2F3D4F;margin-top:8px;'); newSay.setAttribute('role', 'status');
    secNew.appendChild(first); secNew.appendChild(mail); secNew.appendChild(btns); secNew.appendChild(newSay);
    send.addEventListener('click', function(){
      var to = String(mail.value || '').trim();
      if (!to) { newSay.textContent = 'Type their email address.'; return; }
      if (/[,;\s]/.test(to) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) { newSay.textContent = 'Type one email address, like name@example.com.'; return; }
      send.disabled = true; newSay.textContent = 'Sending…';
      fetch(o.GS_URL + '?action=sendGroupInvite&groupId=' + encodeURIComponent(o.groupId) + '&hostAppearId=' + encodeURIComponent(o.meId) + '&sessionToken=' + encodeURIComponent(adminTok(o.groupId, o.meId)) + '&toEmail=' + encodeURIComponent(to) + '&toName=' + encodeURIComponent(String(first.value || '').trim()))
        .then(function(r){ return r.json(); })
        .then(function(d){
          send.disabled = false;
          if (d && d.status === 'ok' && d.already && d.message) { newSay.textContent = d.message; mail.value = ''; first.value = ''; }
          else if (d && d.status === 'ok') { newSay.textContent = 'Invited ' + (String(first.value || '').trim() || to) + '. Invitation sent to ' + to + '. Pending until they answer.'; mail.value = ''; first.value = ''; }
          else { newSay.textContent = (d && d.message) ? d.message : 'That did not go through. Try again.'; }
        })
        .catch(function(){ send.disabled = false; newSay.textContent = 'Could not reach the server. Try again in a moment.'; });
    });

    wrap.appendChild(cap); wrap.appendChild(secNet); wrap.appendChild(secNew);
    pick('net');
    return wrap;
  };
})();
