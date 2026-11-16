(function(){
  var GS = "https://cw-api-gate.jessieupp.workers.dev";
  var CSS = "#cwh-acts,#cwh-invite,#cwh-wait-acts{order:4}"
    + "@keyframes cwh-br{0%,100%{opacity:.4}50%{opacity:1}}.cwh-wait{font-size:14px;font-weight:700;color:#1F699E;animation:cwh-br 1.6s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.cwh-wait{animation:none}}"
    + ".cwh-acts{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}"
    + ".cwh-b{background:#1F699E;color:#fff;border:0;border-radius:24px;padding:7px 14px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;min-height:0}"
    + ".cwh-b.on{background:#1F699E}.cwh-b:focus{outline:none}.cwh-b:focus-visible{outline:2px solid #1F699E;outline-offset:2px}"
    + "a.cwh-b,a.cwh-b:visited,a.cwh-b:hover{color:#fff !important;text-decoration:none !important}"
    + ".cwh-card{border:1.5px solid #DDE4EE;border-radius:14px;padding:16px 18px;margin:0 0 16px;background:#fff}"
    + ".cwh-card .cwh-pq{font-size:18px;font-weight:800;color:#1A2E42;margin:0 0 14px}"
    + ".cwh-part{margin:0 0 20px}.cwh-part+.cwh-part{border-top:1px solid #DDE4EE;padding-top:16px}"
    + ".cwh-fq{font-size:15px;font-weight:700;color:#1A2E42;margin:0 0 4px}"
    + ".cwh-help{font-size:13.5px;line-height:1.5;color:#2F3D4F;margin:0 0 10px}"
    + ".cwh-field{box-sizing:border-box;width:100%;max-width:300px;padding:10px 12px;border:1.5px solid #DDE4EE;border-radius:10px;font:inherit;font-size:14px;color:#1A2E42;background:#fff;display:block;margin:0 0 8px}"
    + ".cwh-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cwh-row .cwh-field{flex:1 1 260px;max-width:none;margin:0}"
    + ".cwh-ta{box-sizing:border-box;width:100%;font:inherit;font-size:14.5px;line-height:1.6;border:1.5px solid #DDE4EE;border-radius:10px;padding:14px;color:#1A2E42;background:#fff}"
    + ".cwh-st{border-radius:10px;padding:10px 14px;font-size:13.5px;margin-top:10px;background:#E8F2F9;color:#1A2E42}.cwh-st.err{background:#FBE9E7;border:1px solid #E8B0A5;color:#7A2410}.cwh-st:empty{display:none}"
    + ".cwh-chip{display:inline-block;background:#EAF2FA;color:#1F699E;border:1px solid #C9DFF3;border-radius:16px;padding:5px 12px;font-size:13px;font-weight:700}"
    + ".cwh-link{font:inherit;font-size:13px;background:none;border:0;color:#1F699E;text-decoration:underline;cursor:pointer;padding:0}"
    + ".cwh-box{position:relative;border:1.5px solid #DDE4EE;border-radius:14px 16.5px 14px 14px;padding:12px;margin:0 0 10px;background:#fff}"
    + ".cwh-lab{font-size:12px;font-weight:800;color:#2F3D4F;letter-spacing:.06em;text-transform:uppercase;margin:0;min-height:30px;display:flex;align-items:center}"
    + ".cwh-pill{position:absolute;top:-1.5px;right:-1.5px;box-sizing:border-box;height:33px;padding:0 14px;border:1.5px solid #DDE4EE;border-radius:16.5px;font:inherit;font-size:13.5px;font-weight:700;color:#1F699E;background:#fff;display:inline-flex;align-items:center;text-decoration:none}"
    + ".cwh-pill:hover{background:#EEF2F7}"
    + ".cwh-stat{font-size:14px;line-height:1.6;color:#6B7A8D;margin-top:4px}"
    + ".cwh-posted{background:#E8F2F9;border-radius:10px;padding:10px 14px;font-size:13.5px;line-height:1.5;margin:0 0 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#1A2E42}"
    + ".cwh-gh{background:#fff;color:#1F699E;border:1.5px solid #1F699E;border-radius:24px;padding:6px 14px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}";

  function el(tag, cls, txt){ var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function me(){ try { return (window.CW && CW.me && CW.me().id) || (typeof getMemberId === "function" ? getMemberId() : "") || ""; } catch (e) { return ""; } }
  function viewing(){ try { return !!(window.CW && CW.me && CW.me().viewing); } catch (e) { return false; } }
  function pass(){ try { return localStorage.getItem("cw-token") || ""; } catch (e) { return ""; } }
  function yes(v){ return v === true || String(v || "").trim().toLowerCase() === "true"; }
  function seriesId(ev){ var id = String(ev.id || ""); return (/^recurring-/.test(id) && ev.seriesId) ? String(ev.seriesId) : id; }
  function say(node, kind, msg){ node.className = "cwh-st" + (kind === "err" ? " err" : ""); node.textContent = msg || ""; }
  function fmtDate(v){
    var s = String(v || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "";
    try { return new Date(s + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); } catch (e) { return s; }
  }
  function copyPlain(text, into){
    var ok = false;
    try {
      var t = document.createElement("textarea"); t.value = text;
      t.setAttribute("style", "position:fixed;top:-1000px;left:-1000px;opacity:0;");
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t);
    } catch (e) {}
    if (!ok && navigator.clipboard) { try { navigator.clipboard.writeText(text); ok = true; } catch (e) {} }
    say(into, ok ? "ok" : "err", ok ? "Copied." : "Select it and copy by hand.");
  }

  var state = { id: "", invite: null, sentLoaded: false };

  function cwLobbyLink(eid, done){
    if (!eid || !me() || viewing()) { done(""); return; }
    fetch(GS + "?action=getLobbyQr&eventId=" + encodeURIComponent(eid) + "&appearId=" + encodeURIComponent(me()) + "&meToken=" + encodeURIComponent(pass()) + "&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) { done(d && d.status === "ok" && d.on === true && d.k ? "https://2gather.network/attendees/?id=" + encodeURIComponent(eid) + "&k=" + encodeURIComponent(d.k) : ""); })
      .catch(function () { done(""); });
  }
  window.cwLobbyLink = cwLobbyLink;

  function inviteCard(ev){
    var eid = seriesId(ev), title = String(ev.title || "Your event"), link = "https://2appear.network/event/?id=" + encodeURIComponent(String(ev.id || ""));
    var c = el("div", "cwh-card"); c.id = "cwh-invite";
    c.appendChild(el("h2", "cwh-pq", "Invite people to " + title));
    var p1 = el("div", "cwh-part");
    p1.appendChild(el("p", "cwh-fq", "Send it for them"));
    p1.appendChild(el("p", "cwh-help", "The same words, sent from 2Appear to one address."));
    var first = el("input", "cwh-field"); first.type = "text"; first.placeholder = "their first name"; first.maxLength = 40;
    var to = el("input", "cwh-field"); to.type = "email"; to.placeholder = "their email address";
    var sendRow = el("div"); sendRow.style.marginTop = "12px";
    var send = el("button", "cwh-b", "Send the invitation"); send.type = "button";
    sendRow.appendChild(send);
    var st = el("div", "cwh-st");
    p1.appendChild(first); p1.appendChild(to); p1.appendChild(sendRow); p1.appendChild(st);
    var p2 = el("div", "cwh-part");
    p2.appendChild(el("p", "cwh-fq", "Invitations sent"));
    var lede = el("p", "cwh-help"); var list = el("div");
    p2.appendChild(lede); p2.appendChild(list);
    var p3 = el("div", "cwh-part");
    p3.appendChild(el("p", "cwh-fq", "The link"));
    var lr = el("div", "cwh-row"); var lf = el("input", "cwh-field"); lf.readOnly = true; lf.value = link; lf.setAttribute("aria-label", "The link to this event");
    var lc = el("button", "cwh-b", "Copy the link"); lc.type = "button"; var lst = el("div", "cwh-st");
    lr.appendChild(lf); lr.appendChild(lc); p3.appendChild(lr); p3.appendChild(lst);
    var p4 = el("div", "cwh-part");
    p4.appendChild(el("p", "cwh-fq", "The message"));
    p4.appendChild(el("p", "cwh-help", "Copy this message to send it however you like. It shares info about the event and how to register."));
    var ta = el("textarea", "cwh-ta"); ta.readOnly = true; ta.rows = 11;
    var who = ""; try { who = String(localStorage.getItem("cw-first") || "").trim(); } catch (e) {}
    var when = fmtDate(ev.date);
    var out = ["Hi,", "", "I would like to invite you to my event, " + title + (when ? ", on " + when : "") + ".", "", "To come:", "", "1. Open " + link, "2. Press RSVP"];
    if (who && !viewing()) { out.push(""); out.push(who); }
    ta.value = out.join("\n");
    var cr = el("div"); cr.style.marginTop = "12px"; var cb = el("button", "cwh-b", "Copy the invitation"); cb.type = "button"; var cst = el("div", "cwh-st");
    cr.appendChild(cb); p4.appendChild(ta); p4.appendChild(cr); p4.appendChild(cst);
    var p5 = el("div", "cwh-part"); p5.style.display = "none";
    p5.appendChild(el("p", "cwh-fq", "Or let them scan it"));
    p5.appendChild(el("p", "cwh-help", "The same link as a code. Put it on a flyer, a slide or a table."));
    var cv = document.createElement("canvas"); cv.setAttribute("aria-label", "A code that opens this event");
    cv.style.cssText = "width:180px;height:180px;border:1.5px solid #DDE4EE;border-radius:14px;background:#fff;padding:8px;";
    p5.appendChild(cv);
    [p1, p2, p3, p4, p5].forEach(function (p) { c.appendChild(p); });

    lc.onclick = function () { copyPlain(lf.value, lst); };
    cb.onclick = function () { copyPlain(ta.value, cst); };
    var draw = function () {
      if (!window.QRious) {
        var sc = document.createElement("script");
        sc.src = "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
        sc.onload = draw; sc.onerror = function () { p5.style.display = "none"; };
        document.head.appendChild(sc); return;
      }
      new QRious({ element: cv, value: lf.value || link, size: 400, foreground: "#1A2E42", background: "#ffffff", level: "M" });
      p5.style.display = "";
    };
    draw();
    if (!viewing()) cwLobbyLink(String(ev.id || ""), function (u) { if (!u || !document.body.contains(c)) return; lf.value = u; if (window.QRious) draw(); });
    var attUrl = "https://2gather.network/mockups/e328/myevents/attendees/?id=" + encodeURIComponent(String(ev.id || ""));
    var load = function () {
      list.textContent = ""; lede.textContent = "";
      var w = el("div", "cwh-st", "Looking up your invitations…"); list.appendChild(w);
      fetch(GS + "?action=getEventInvitesSent&eventId=" + encodeURIComponent(eid) + "&hostAppearId=" + encodeURIComponent(me()) + "&nocache=1")
        .then(function (r) { return r.json(); })
        .then(function (d) {
          list.textContent = "";
          var rows = (d && d.invites) || [];
          if (!rows.length) { lede.textContent = "Nobody yet. Invitations you send from here are listed with Pending, then Joined once they come in."; return; }
          lede.textContent = rows.length + (rows.length === 1 ? " invitation" : " invitations") + (d.canSeeAll ? " sent from this event." : " sent by you.");
          rows.forEach(function (r) {
            var row = el("div"); row.style.cssText = "display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:9px 0;border-top:1px solid #EEF1F5;";
            var wh = el("div"); wh.style.cssText = "flex:1 1 220px;min-width:0;";
            var nm = el("div", "", r.toFirst || r.email || "Someone you invited"); nm.style.cssText = "font-weight:700;color:#1A2E42;overflow-wrap:anywhere;";
            wh.appendChild(nm);
            var meta = []; if (r.email && r.toFirst) meta.push(r.email);
            meta.push((r.status === "joined" ? "Joined " : "Sent ") + String(r.status === "joined" ? r.joinedAt : r.sentAt).slice(0, 10));
            if (r.by) meta.push("by " + r.by);
            var sub = el("div", "", meta.join(" · ")); sub.style.cssText = "font-size:13px;color:#2F3D4F;overflow-wrap:anywhere;";
            wh.appendChild(sub);
            row.appendChild(wh); row.appendChild(el("span", "cwh-chip", r.status === "joined" ? "Joined" : "Pending"));
            if (r.mine && !viewing()) {
              var rm = el("button", "cwh-link", "Remove"); rm.type = "button";
              rm.onclick = function () {
                rm.textContent = "Removing…";
                fetch(GS + "?action=deleteEventInviteSent&eventId=" + encodeURIComponent(eid) + "&hostAppearId=" + encodeURIComponent(me()) + "&sessionToken=" + encodeURIComponent(pass()) + "&inviteId=" + encodeURIComponent(r.inviteId))
                  .then(function (x) { return x.json(); }).then(function () { load(); }).catch(function () { rm.textContent = "Try again"; });
              };
              row.appendChild(rm);
            }
            list.appendChild(row);
          });
        })
        .catch(function () { list.textContent = ""; lede.textContent = "The list could not load. Try again in a moment."; });
    };
    var ma = el("p"); ma.style.margin = "10px 0 0";
    var mal = el("a", "", "Manage attendees"); mal.href = attUrl; mal.style.cssText = "color:#1F699E;font-weight:700;";
    ma.appendChild(mal); p2.appendChild(ma);
    send.onclick = function () {
      if (viewing()) return;
      var t = (to.value || "").trim();
      if (!t) { say(st, "err", "Type the address to send it to."); return; }
      say(st, "ok", "Sending…");
      fetch(GS + "?action=sendEventInvite&eventId=" + encodeURIComponent(eid) + "&hostAppearId=" + encodeURIComponent(me()) + "&sessionToken=" + encodeURIComponent(pass()) + "&toEmail=" + encodeURIComponent(t) + "&toName=" + encodeURIComponent((first.value || "").trim()))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.status === "ok") { say(st, "ok", "Sent to " + t + "."); to.value = ""; first.value = ""; load(); }
          else { say(st, "err", (d && d.message) ? d.message : "That did not go through."); }
        })
        .catch(function () { say(st, "err", "Could not reach the server."); });
    };
    if (viewing()) { send.disabled = true; to.disabled = true; first.disabled = true; }
    c._load = load;
    return c;
  }

  var waitTimer = null;
  function waitPaint(){
    if (document.getElementById("cwh-wait-acts") || document.getElementById("cwh-acts")) return;
    var h1 = document.querySelector("#card h1, .cw-rl-main h1");
    if (!h1) return;
    if (!document.getElementById("cwh-css")) { var s = document.createElement("style"); s.id = "cwh-css"; s.textContent = CSS; document.head.appendChild(s); }
    var row = h1.closest(".evt-head-row") || h1.parentNode;
    var w = el("p", "cwh-wait", "Loading this event\u2026"); w.id = "cwh-wait-acts"; w.style.margin = "0 0 12px";
    row.parentNode.insertBefore(w, row.nextSibling);
  }
  window.cwHostWait = function (on) {
    if (waitTimer) { clearInterval(waitTimer); waitTimer = null; }
    var old = document.getElementById("cwh-wait-acts");
    if (!on) { if (old) old.remove(); return; }
    waitPaint();
    var n = 0;
    waitTimer = setInterval(function () { waitPaint(); if (++n > 150) { clearInterval(waitTimer); waitTimer = null; } }, 100);
  };

  function clear(){
    ["cwh-acts", "cwh-invite", "cwh-att"].forEach(function (id) { var n = document.getElementById(id); if (n) n.remove(); });
    state.id = "";
  }

  window.cwHostTools = function (ev, isHost) {
    if (!ev || !isHost) { clear(); return; }
    if (!document.getElementById("cwh-css")) { var s = document.createElement("style"); s.id = "cwh-css"; s.textContent = CSS; document.head.appendChild(s); }
    var eid = String(ev.id || "");
    try { if (me() && !viewing()) localStorage.setItem("cw-hosting|" + eid, String(me())); } catch (e) {}
    var h1 = document.querySelector("#card h1, .cw-rl-main h1");
    if (!h1) return;
    var row = h1.closest(".evt-head-row") || h1.parentNode;
    var acts = document.getElementById("cwh-acts");
    if (!acts || state.id !== eid) {
      clear(); state.id = eid;
      acts = el("div", "cwh-acts"); acts.id = "cwh-acts";
      if (yes(ev.hasBB)) {
        var lb = el("a", "cwh-b"); lb.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"margin-left:1px;margin-right:4px;flex:0 0 auto\"><path d=\"M10 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4\"/><path d=\"M13 8l4 4-4 4\"/><path d=\"M8 12h9\"/></svg>Start 2Gather"; lb.href = "https://2gather.network/attendees/?id=" + encodeURIComponent(eid); acts.appendChild(lb);
      }
      var inv = el("button", "cwh-b"); inv.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"margin-right:6px;flex:0 0 auto\"><circle cx=\"9\" cy=\"8\" r=\"3.2\"/><path d=\"M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M17.5 14.2A4.5 4.5 0 0 1 21.5 18.5V20\"/></svg>Invite people"; inv.type = "button"; inv.setAttribute("aria-expanded", "false"); acts.appendChild(inv);
      var attUrl = "https://2gather.network/mockups/e328/myevents/attendees/?id=" + encodeURIComponent(String(ev.id || ""));
      var ma = el("a", "cwh-b"); ma.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"margin-right:6px;flex:0 0 auto\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"14\" rx=\"2\"/><circle cx=\"9.5\" cy=\"11\" r=\"2\"/><path d=\"M6.5 16c.5-1.6 1.7-2.4 3-2.4s2.5.8 3 2.4\"/><path d=\"M14.5 10h3M14.5 14h3\"/></svg>Manage attendees"; ma.href = attUrl;  acts.appendChild(ma);
      row.parentNode.insertBefore(acts, row.nextSibling);
      inv.onclick = function () {
        var open = document.getElementById("cwh-invite");
        if (open) { open.remove(); inv.classList.remove("on"); inv.setAttribute("aria-expanded", "false"); return; }
        var c = inviteCard(ev); acts.parentNode.insertBefore(c, acts.nextSibling); c._load();
        inv.classList.add("on"); inv.setAttribute("aria-expanded", "true");
      };
      try { if (/[?&]qr=1(&|$)/.test(location.search) && !document.getElementById("cwh-invite")) { setTimeout(function () { inv.click(); var ic = document.getElementById("cwh-invite"); if (ic && ic.scrollIntoView) ic.scrollIntoView({ block: "start" }); }, 0); } } catch (e) {}
      (function () {
        var rail0 = document.querySelector(".cw-rl-rail");
        if (!rail0 || document.getElementById("cwh-att") || document.getElementById("cwh-att-wait")) return;
        var wb = el("div", "cwh-box"); wb.id = "cwh-att-wait"; wb.appendChild(el("span", "cwh-wait", "Loading\u2026"));
        var f0 = rail0.querySelector(".ux105-box") || rail0.firstElementChild;
        if (f0 && f0.nextSibling) rail0.insertBefore(wb, f0.nextSibling); else rail0.appendChild(wb);
      })();
      var dropWait = function () { var w = document.getElementById("cwh-att-wait"); if (w) w.remove(); };
      fetch(GS + "?action=getAttendees&eventId=" + encodeURIComponent(eid) + "&appearId=" + encodeURIComponent(me()) + "&nocache=1")
        .then(function (r) { return r.json(); })
        .then(function (d) {
          dropWait();
          if (state.id !== eid) return;
          var a = ((d && (d.attendees || d.people)) || []).filter(function (x) { return x && !x.isHost; });
          if (!a.length) return;
          var rail = document.querySelector(".cw-rl-rail");
          if (!rail || document.getElementById("cwh-att")) return;
          var box = el("div", "cwh-box"); box.id = "cwh-att";
          box.appendChild(el("p", "cwh-lab", "Attendees"));
          var pl = el("a", "cwh-pill", "Manage attendees"); pl.href = attUrl; box.appendChild(pl);
          box.appendChild(el("div", "cwh-stat", a.length + " registered"));
          var first = rail.querySelector(".ux105-box") || rail.firstElementChild;
          if (first && first.nextSibling) rail.insertBefore(box, first.nextSibling); else rail.appendChild(box);
        })
        .catch(function () { dropWait(); });
    }
  };
})();
