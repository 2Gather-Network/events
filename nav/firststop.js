/* Where a person belongs the moment we know who they are.
   Version: V1.00 | Date: 2026-08-27

   Somebody signing in for the first time and somebody signing in for the hundredth are the
   same request as far as the code is concerned, so the difference has to be read from what
   they have actually said about themselves. A person with nothing in their profile is sent
   to the questions, where writing a sentence is the whole task. Everybody else goes where
   they were already headed.

   This deliberately does not read answeredIntro. That column has never been filled for
   anybody, so it answers "no" for the whole database, which is what sent every established
   person into the gate the first time they tried to start a group.
*/
(function () {
  var GS = 'https://cw-api-gate.jessieupp.workers.dev';
  var CW = window.CW = window.CW || {};

  // The five things the profile is made of, under both the names the profile uses and the
  // older names the questions wrote. Anything in any of them means this person has spoken.
  var SAID = ['needs', 'interests', 'skills', 'values', 'haves',
              'introNeed', 'introEnjoy', 'introSkills', 'introValues', 'introOffer'];

  function blank(v) { return !String(v == null ? '' : v).trim(); }

  CW.firstStop = function (id, next, done) {
    var settled = false;
    function finish(url) { if (settled) return; settled = true; try { done(url); } catch (e) {} }
    if (!id) { finish(next); return; }

    // Apps Script answers anywhere between three and fifty seconds, and nobody waits on a
    // blank screen that long. After eight seconds they go where they asked to go, which is
    // never worse than where they are.
    var timer = setTimeout(function () { finish(next); }, 8000);

    fetch(GS + '?action=getIntake&appearId=' + encodeURIComponent(id))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        var row = (d && d.data) || {};
        var spoken = SAID.some(function (k) { return !blank(row[k]); });
        // Somebody who has just written five sentences about themselves should land on the page
        // that shows them, not on an empty list of groups, which is where the questions go by
        // default.
        // Finishing the questions lands on a choice of doors rather than on the profile, because
        // somebody who came to start a group should not be marched through their profile first.
        finish(spoken ? next : '/intro/?first=1&next=' +
               encodeURIComponent('https://2gather.network/welcome/'));
      })
      .catch(function () { clearTimeout(timer); finish(next); });
  };
})();
