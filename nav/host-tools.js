(function(){
  var GS = "https://cw-api-gate.jessieupp.workers.dev";
  var CSS = "#cwh-acts,#cwh-invite,#cwh-wait-acts{order:4}"
    + "@keyframes cwh-br{0%,100%{opacity:.4}50%{opacity:1}}.cwh-wait{font-size:14px;font-weight:700;color:#1F699E;animation:cwh-br 1.6s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.cwh-wait{animation:none}}"
    + ".cwh-acts{display:flex;gap:8px;flex-wrap:wrap;margin:13px 0 14px}"
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
  var state = { id: "" };

  function cwLobbyLink(eid, done){
    if (!eid || !me() || viewing()) { done(""); return; }
    fetch(GS + "?action=getLobbyQr&eventId=" + encodeURIComponent(eid) + "&appearId=" + encodeURIComponent(me()) + "&meToken=" + encodeURIComponent(pass()) + "&t=" + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (d) { done(d && d.status === "ok" && d.on === true && d.k ? "https://2gather.network/lobby/?id=" + encodeURIComponent(eid) + "&k=" + encodeURIComponent(d.k) : ""); })
      .catch(function () { done(""); });
  }
  window.cwLobbyLink = cwLobbyLink;

  var waitTimer = null;
  function waitPaint(){
    if (document.getElementById("cwh-wait-acts") || document.getElementById("cwh-acts")) return;
    var h1 = document.querySelector("#card h1, .cw-rl-main h1");
    if (!h1) return;
    if (!document.getElementById("cwh-css")) { var s = document.createElement("style"); s.id = "cwh-css"; s.textContent = CSS; document.head.appendChild(s); }
    var row = h1.closest(".evt-head-row") || h1.parentNode;
    var w = el("p", "cwh-wait", "Loading this event\u2026"); w.id = "cwh-wait-acts"; w.style.margin = "13px 0 12px";
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
    ["cwh-acts", "cwh-att"].forEach(function (id) { var n = document.getElementById(id); if (n) n.remove(); });
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
      var inv = el("a", "cwh-b"); inv.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"margin-right:6px;flex:0 0 auto\"><circle cx=\"9\" cy=\"8\" r=\"3.2\"/><path d=\"M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M17.5 14.2A4.5 4.5 0 0 1 21.5 18.5V20\"/></svg>Invite people"; inv.href = "https://2appear.network/event/" + encodeURIComponent(eid) + "/invite"; acts.appendChild(inv);
      var attUrl = "https://2appear.network/myevents/attendees/?id=" + encodeURIComponent(String(ev.id || ""));
      var ma = el("a", "cwh-b"); ma.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" style=\"margin-right:6px;flex:0 0 auto\"><rect x=\"4\" y=\"5\" width=\"16\" height=\"14\" rx=\"2\"/><circle cx=\"9.5\" cy=\"11\" r=\"2\"/><path d=\"M6.5 16c.5-1.6 1.7-2.4 3-2.4s2.5.8 3 2.4\"/><path d=\"M14.5 10h3M14.5 14h3\"/></svg>Manage attendees"; ma.href = attUrl;  acts.appendChild(ma);
      row.parentNode.insertBefore(acts, row.nextSibling);
      try { if (/[?&]qr=1(&|$)/.test(location.search)) location.replace(inv.href + "#lobby"); } catch (e) {}
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
