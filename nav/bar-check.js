(function () {
  var box = document.createElement("div");
  box.id = "cw-bar-check";
  box.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:100001;background:#1A2E42;color:#fff;font:12px/1.4 ui-monospace,Menlo,monospace;padding:calc(6px + env(safe-area-inset-top,0px)) 10px 6px;pointer-events:none;";
  document.body.appendChild(box);
  var typed = "no";
  document.addEventListener("focusin", function (e) { var t = e.target && e.target.tagName; if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") { typed = "open"; paint(); } });
  document.addEventListener("focusout", function () { if (typed === "open") { typed = "closed"; paint(); } });
  function bar() {
    var ids = ["cw-m2-foot", "cw-me-actbar"];
    for (var i = 0; i < ids.length; i++) { var el = document.getElementById(ids[i]); if (el && el.offsetHeight) return el; }
    var nav = document.querySelector(".manage-nav");
    return nav && nav.offsetHeight ? nav : null;
  }
  function paint() {
    var vv = window.visualViewport, vh = vv ? vv.height : window.innerHeight, vt = vv ? vv.offsetTop : 0;
    var b = bar(), gap = "no bar";
    if (b) { gap = Math.round(vt + vh - b.getBoundingClientRect().bottom); }
    var top = document.getElementById("back-to-top"), tg = "none";
    if (top && top.offsetHeight) { tg = Math.round(vt + vh - top.getBoundingClientRect().bottom); }
    box.textContent = "Bar gap " + gap + " | Top gap " + tg + " | window " + Math.round(window.innerHeight) + " | visible " + Math.round(vh) + " at " + Math.round(vt) + " | scroll " + Math.round(window.scrollY) + " | keyboard " + typed;
  }
  window.addEventListener("scroll", paint, { passive: true });
  window.addEventListener("resize", paint);
  if (window.visualViewport) { window.visualViewport.addEventListener("resize", paint); window.visualViewport.addEventListener("scroll", paint); }
  setInterval(paint, 500);
  paint();
})();
