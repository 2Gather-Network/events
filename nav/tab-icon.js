(function () {
  var host = '';
  try { host = (window.location.hostname || '').toLowerCase(); } catch (e) { return; }
  if (host.indexOf('appear.network') < 0 && host.indexOf('balance.network') < 0) { return; }
  function own() {
    try {
      var links = document.querySelectorAll('link[rel="icon"]');
      if (!links.length) { var made = document.createElement('link'); made.rel = 'icon'; document.head.appendChild(made); links = [made]; }
      for (var i = 0; i < links.length; i++) { links[i].setAttribute('type', 'image/png'); links[i].setAttribute('href', '/logo.png'); }
    } catch (e) {}
  }
  own();
  document.addEventListener('DOMContentLoaded', own);
})();
