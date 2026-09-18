/* Where a person belongs the moment we know who they are.
   Version: V2.01 | Date: 2026-09-17

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

  // DID THEY ASK FOR SOMEWHERE? A group, an event, posting, or a group's own doors. The calendar is
  // what `next` says when nobody named anywhere, so it does not count as asking.
  function _asked(next) {
    try {
      var u = String(next || '');
      if (!u) return false;
      var path = u.split('#')[0].split('?')[0].replace(/^https?:\/\/[^/]+/, '');
      return /^\/(group|groups|event|myevents|ikigai|commons)(\/|$)/.test(path);
    } catch (e) { return false; }
  }

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
        // 2026-08-30. This used to send anybody who had said nothing to the questions. Two
        // things were wrong with that. It measured "said nothing" on ikigai, a tab fifteen of
        // six hundred and ninety five people are on, so it marched almost everybody through a
        // form that already had their answers. And the questions are for somebody joining or
        // starting a group, where an empty profile costs the other people in the room
        // something. Arriving is not that moment.
        //
        // A new person lands on the doors instead and picks. Join a group and Start a group are
        // two of them, and that path asks the questions when it needs to.
        // A REAL DESTINATION BEATS /welcome/. Jessie, 2026-09-17: "i want people to go directly to
        // hte group they were invited to and they click join and it then asks them to sign in/up",
        // and "if they dn't get a referral or a direct link to a group or event then go to weolcome".
        //
        // Until tonight an empty profile overruled everything, so somebody invited to a group did
        // exactly the right thing - opened the group, pressed Join, signed up, and was then thrown
        // to /welcome/ at the last step, with the group they were joining discarded. A new person's
        // profile is empty BY DEFINITION, so the people this hurt were the only people it was for.
        //
        // /welcome/ catches somebody who arrived with nowhere in particular to be.
        finish((spoken || _asked(next)) ? next : 'https://2gather.network/welcome/');
      })
      .catch(function () { clearTimeout(timer); finish(next); });
  };
})();
