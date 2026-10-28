(function () {
  var params = new URLSearchParams(location.search);
  if (params.get('balance') !== '1') { return; }
  var EMO = {"Rest":"💙","Eat and drink":"🥘","Move":"🌀","Play":"🏓","Connect":"🌐","Create":"🎨","Connected":"🌐","Expressed":"🎨","Nourished":"🥘","Energized":"🌀","Playful":"🏓","Rested":"💙","Walking":"👣","Running":"⏱️","Cycling":"🚲","Swimming":"🌊","Dancing":"🎶","Yoga":"🪷","Climbing":"⛰️","Weightlifting":"🔩","Gardening":"🌱","Playing sports":"⚽"};
  var STEPS = {"Joys":[{"k":"lose","t":"What is one thing that, when you do it, you lose track of time?","sub":"","text":1,"box":1},{"k":"move","t":"How do you like to move?","sub":"","l":["Workout","Walk","Stretch","Garden","Cycle","Swim","Run","Dance","Sport"]},{"k":"rest","t":"How do you like to rest?","sub":"","l":["Soak","Float","Nap time","Breathing","Body scan","Massage","Foam roll","Ball roll","Visualization","Journaling","Sound","Music","Meditation","Sun","Light therapy","Slow movement","Relaxing walk","Time outdoors"]},{"k":"energize","t":"Which of these energize you most?","sub":"","l":["Connect","Create","Eat and drink","Move","Play","Rest"]},{"k":"helpfeel","t":"What do you most like helping other people feel and experience?","sub":"","l":["Connected","Expressed","Nourished","Energized","Playful","Rested"]},{"k":"services","feeds":1,"t":"Acts of service is a way to appreciate people in your life. In which ways do you enjoy serving others the most?","sub":"","l":["Home/life (cleaning/ organizing/ pet care/ family care)","Transportation/logistics (delivery/ moving/ courier)","Food/hospitality (chef/ catering/ restaurant services)","Beauty/expression (hair/ styling/ personal brand)","Creative/design (graphics/ photography/ videography/ writing/ branding)","Fine/performing arts (visual art/ music/ dance/ theater/ performance)","Skilled trades (construction/ plumbing/ landscaping/ mechanical)","Health/wellness (supporting physical/ mental/ emotional wellbeing)","Professional (tech/ software/ operations/ real estate/ legal/ finance)"],"noOther":1,"box":1},{"k":"sharing","dark":1,"t":"What do find yourself sharing a lot these days that you enjoy?","sub":"","l":["Feedback","Knowledge","Access","Accountability","Collaboration","Funding","A workspace","A resource"]},{"k":"roles","dark":1,"t":"Are you interested in serving in any of these non-paid roles, where others tap into your experience?","sub":"","l":["Feedback provider","Mentor","Apprentice","Accountability advocate","Volunteer","Board member","Partner","Cofounder","Collaborator","Advisor","Fundraiser","Speaker","Coach","Tutor","Resource provider"]},{"k":"works","t":"Do you work or want to work right now?","sub":"","l":["Yes","No"],"noOther":1,"one":1,"box":1},{"k":"aligned","when":{"k":"works","v":"Yes"},"area":1,"t":"Think about a time when work and life felt aligned - when you were energized rather than drained. What was happening?","sub":"","text":1},{"k":"best","when":{"k":"works","v":"Yes"},"t":"I do my best when I'm [fill in the blank].","sub":"","text":1},{"k":"influenced","t":"Who has influenced your thinking that you'd enjoy discussing?","sub":"","text":1,"box":1},{"k":"people","t":"Name 1-5 people you spend the most time with.","sub":"","text":1},{"k":"showsup","t":"Who in your life shows up for you - and you for them - even if you don't see them often?","sub":"","text":1},{"k":"inspires","t":"Who in your life inspires you or brings out the best in you?","sub":"","text":1},{"k":"chars","feeds":1,"t":"How do you enjoy showing up for the people around you?","sub":"","l":["Help when asked","Show up consistently","Share what I know","Tell the truth","Treat people fairly","Care for others","Ask good questions","Listen deeply","See what's possible","Offer perspective","Lead by example","Be playful","Be encouraging","Be warm","Be curious about people","Be collaborative","Be welcoming","Be steady"],"box":1},{"k":"charnat","from":"chars","noOther":1,"t":"Out of your selections above, what comes most naturally - without much effort?","sub":"","l":[]},{"k":"express","t":"These days, do you feel like you express these often?","sub":"","l":["Enough","Not enough"],"noOther":1,"one":1},{"k":"blockers","when":{"k":"express","v":"Not enough"},"t":"These days, what gets in the way of expressing them?","sub":"","l":["Not enough time","Too tired","Feeling stressed","Too busy with work","Too busy caring for others","Not feeling well","Feeling alone","Feeling unsure","Not sure how","Others don’t respond","Too far away"]}],"Skills":[{"lead":1,"t":"When you're at your best, what are your natural tendencies?","box":1},{"k":"think","t":"Approach to thinking:","l":["I tend to appreciate structure/ practicality/ convention","I tend to balance structure with creative flexibility","I tend to seek novelty/ creativity/ abstract thinking"],"noOther":1,"one":1},{"k":"tasks","t":"Approach to tasks:","l":["I tend to approach life with flexibility and spontaneity","I tend to balance structure with adaptability","I tend to be organized/ methodical/ detail-oriented"],"noOther":1,"one":1},{"k":"energy","t":"Approach to energy:","l":["I tend to draw energy from quiet reflection and deeper connections","I tend to enjoy both social interaction and solitary activities","I tend to draw energy from social engagement and external activities"],"noOther":1,"one":1},{"k":"prorel","t":"Approach professional relationships:","l":["I tend to be independent-minded and prioritize objective reasoning","I tend to balance cooperation with healthy boundaries","I tend to be empathetic/ trusting/ focused on harmony"],"noOther":1,"one":1},{"k":"emotions","t":"Emotions:","l":["I tend to remain composed and stable under pressure","I tend to experience a balanced range of emotional responses","I tend to be emotionally responsive and sensitive to my environment"],"noOther":1,"one":1},{"k":"learn","t":"How do you learn and communicate best?","l":["I am multi-passionate.","I process ideas best through verbal discussion.","I'm a holistic big-picture thinker.","I excel at managing multiple projects simultaneously.","I focus intensely on tasks and maintain persistence until completion.","I am a serial list maker. I even have a list of all my lists.","I have a short attention span outside of my key interests but have extreme focus in areas I'm passionate about - often leading to expertise.","I tend to neglect self-care when deeply immersed in projects or topics.","I need clear expectations and struggle with ambiguity.","I prefer independent work and value autonomy.","I can talk at length about topics I'm passionate about.","I process information logically - and others may sometimes read this as unempathetic.","I excel when given creative freedom but struggle with repetitive tasks."],"noOther":1,"box":1},{"k":"tools","t":"What tools, resources, or support systems help set you up for success?","l":["A.I. tools","Regular check-ins","Peer mentorship","Shadowing someone","Buddy system","Surveys and questionnaires","Interactive workshops","Presentations (videos/speeches/lectures)","Self-paced learning","Coaching","Structured plans","Accountability advocate","Knowledge repositories","Q&A"]},{"k":"traits","t":"Top traits you identify with most.","l":["Analytically inclined (enjoys data analysis/ weighs risks/ makes evidence-based decisions)","Strategically inclined (focuses on big-picture planning and goal-oriented decisions)","Problem-solving inclined (thrives on challenges/ identifies issues quickly/ adapts solutions)","Conflict-resolution inclined (values relationships/ understands human behavior/ communicates effectively)","Situationally inclined (maintains composure under pressure/ manages stress rationally)","Independently inclined (works well with tools and systems/ solves problems directly)","Written communication expressive (creates precise/ well-structured content)","Creatively expressive (excels in design/ visual composition/ and artistic judgment)","Musically expressive (creates or analyzes music/ focuses on rhythm and sound)","Physically expressive (engages through movement/ sports/ dance/ or hands-on activities)","Organizationally inclined (maintains systems and order/ follows effective procedures)","Teamwork inclined (collaborates effectively/ builds trust/ coordinates group efforts)","Self-aware inclined (focuses on personal growth/ reflects on strengths and areas to build)","Nature inclined (connects with environment/ observes and appreciates ecosystems)"],"noOther":1,"box":1},{"k":"mbti","t":"If you know your Myers Briggs Type Indicator (MBTI) personality type, please share it below.","text":1},{"k":"disc","t":"If you know your DISC type, please share it below.","text":1},{"k":"enneagram","t":"If you know your Enneagram type, please share it below.","text":1},{"k":"hdesign","t":"If you know your Human Design type, please share it below.","text":1},{"k":"kw1","t":"Share the tools you work with the most and enjoy.","text":1,"area":1,"box":1},{"k":"kw2","t":"Paste anything from your website, resume, or deck that describes your expertise.","text":1,"area":1},{"k":"kw3","t":"What keywords do you want people to be matched to you on?","text":1},{"k":"leadcomm","t":"Do you lead a community or group?","l":["Yes","Not right now"],"noOther":1,"one":1,"box":1},{"k":"commtype","when":{"k":"leadcomm","v":"Yes"},"t":"What type of community do you lead right now?","noOther":1,"l":["Travel (Trips, road trips, cruises, local exploring, travel planning)","Outdoors (Being in nature and caring for it: hiking, camping, kayaking, fishing, gardening, birdwatching, foraging, conservation, habitat restoration, tree planting, ecology, biodiversity, composting, climate action)","Home Life (Childcare, elder care, parenting, family routines, organizing, decorating, cleaning, indoor plants)","Animals (Dogs, cats, horses, pet training, animal care, pet food, animal rescue, beekeeping)","Technology (Coding, AI, analytics, engineering, experience design, gadgets, robotics, web design)","Personal Care (Showering, bathing, toothbrushing, personal hygiene, hygiene kits, laundry, menstrual supplies, diaper supplies, skincare, nail care, grooming, spa)","Belief & Meaning (Prayer, worship, scripture, faith communities, spiritual reading, pilgrimages)","Professional (Entrepreneurship, administration, HR, operations, procurement, project management, strategy, marketing, sales, product direction, nonprofits, real estate)","Communications (Writing, public speaking, podcasting, journalism, social media, translation)","Building & Repurposing (Construction, home repairs, plumbing, electrical, carpentry, trade skills, woodworking, 3D printing, recycling, upcycling, repair cafés)","Transportation (Cars, car restoration, motorcycles, cycling, boating, aviation, trains, transit)","Finance (Investing, budgeting, bookkeeping, taxes, crypto, financial literacy)","Science (Space, astronomy, biology, chemistry, research, data science, citizen science)","Medical (Diagnosing, treating, nursing, patient care, pharmacy, dentistry, first aid, preventative medicine)"]}],"Open to opportunities":[{"lead":1,"t":"Which best describes you?","box":1},{"k":"wstyle","pair":1,"t":"Work style:","l":["Working independently","Collaborating with a team","It depends"],"noOther":1,"one":1},{"k":"wdecide","pair":1,"t":"Decision-making:","l":["Collaborative decision-making","Established protocols","It depends"],"noOther":1,"one":1},{"k":"wadapt","pair":1,"t":"Adaptability:","l":["Quick adaptation","Methodical planning","It depends"],"noOther":1,"one":1},{"k":"wcomm","pair":1,"t":"Communication:","l":["Direct, brief communication","Detailed, contextual communication","It depends"],"noOther":1,"one":1},{"k":"wtask","pair":1,"t":"Task vs relationship:","l":["Task completion and deliverables","Stakeholder relationships and engagement","It depends"],"noOther":1,"one":1},{"k":"strengths","feeds":1,"t":"Which strengths would others most likely use to describe you in a working relationship?","l":["Meet deadlines consistently","Maintain a positive approach","Handle confidential information properly","Communicate clearly","Share information appropriately","Deliver on commitments","Maintain productivity under pressure","Work effectively with diverse people","Build strong professional relationships","Adapt to change","Address issues proactively","Achieve goals collaboratively","Pursue continuous improvement","Resolve conflicts professionally","Take ownership of outcomes","Support collaborators","Consider diverse perspectives","Make well-informed decisions","Include collaborator input in decisions","Read and adapt to group dynamics","Navigate complex problems effectively"],"noOther":1,"box":1},{"k":"build","from":"strengths","one":1,"noOther":1,"t":"From the list above, which one do you most want to build on right now?","l":[]},{"k":"contrib","t":"How do you most like to contribute to a team right now?","l":["Solve complex challenges","Innovate new solutions","Develop team potential","Share my expertise","Lead initiatives","Build team culture","Scale successful programs","Build collaboration","Create sustainable systems","Optimize processes","Evaluate effectiveness"],"noOther":1},{"k":"healthadv","when":{"k":"services","v":"Health/wellness"},"t":"You selected health/wellness as a service offering. Do you want to be included as a health advocate in our ecosystem?","l":["Yes","Not right now"],"noOther":1,"one":1,"box":1},{"k":"healthoff","when":{"k":"healthadv","v":"Yes"},"t":"What do you want to share as your specific health offering(s)?","text":1},{"k":"led","t":"Have you led or managed people - formally (with direct reports) or informally (projects, teams, initiatives)?","l":["No","Informally - some","Informally - a great deal","Formally - some (with direct reports)","Formally - a great deal"],"noOther":1,"one":1,"box":1},{"k":"ledleaders","t":"Have you led other leaders?","l":["No","C-Level","Executive Director","Vice President","Director","People managers","Independent contributors","Contractors"],"noOther":1},{"k":"openleaders","t":"Are you open to leading other leaders?","l":["No","Informally - some","Informally - a great deal","Formally - some (with direct reports)","Formally - a great deal"],"noOther":1,"one":1}],"Appreciation":[{"k":"services","feeds":1,"t":"Acts of service is a way to appreciate people in your life. In which ways do you enjoy serving others the most?","sub":"","l":["Home/life (cleaning/ organizing/ pet care/ family care)","Transportation/logistics (delivery/ moving/ courier)","Food/hospitality (chef/ catering/ restaurant services)","Beauty/expression (hair/ styling/ personal brand)","Creative/design (graphics/ photography/ videography/ writing/ branding)","Fine/performing arts (visual art/ music/ dance/ theater/ performance)","Skilled trades (construction/ plumbing/ landscaping/ mechanical)","Health/wellness (supporting physical/ mental/ emotional wellbeing)","Professional (tech/ software/ operations/ real estate/ legal/ finance)"],"noOther":1,"box":1},{"k":"sharing","dark":1,"t":"What do find yourself sharing a lot these days that you enjoy?","sub":"","l":["Feedback","Knowledge","Access","Accountability","Collaboration","Funding","A workspace","A resource"]}]};
  var MSG = "You said you don't work or don't want to work right now so we'll skip these next set of questions. If you'd like to answer them, then please change your answer to yes.";
  var WORK = ['Open to opportunities'];
  var S = {};
  var hosts = {};

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function emo(x) { return EMO[x] ? EMO[x] + ' ' : ''; }
  function parts(x) { var m = x.match(/^(.*?) \((.*)\)$/); return m ? { k: m[1], ex: m[2] } : { k: x, ex: '' }; }
  function wc(x) { return x.trim().split(/\s+/).length; }
  function ans(k) { return S[k] || (S[k] = []); }

  var css = document.createElement('style');
  css.textContent =
    '.balm{margin-top:18px;}' +
    '.balm .balbox{background:#fff;border:1.5px solid #C9DFF3;border-radius:16px;padding:18px 20px;margin:0 0 16px;}' +
    '.balm .qb{margin-top:22px;}.balm .qb:first-child{margin-top:0;}' +
    '.balm h2{font:inherit;font-size:17px;font-weight:800;line-height:1.35;letter-spacing:0;text-transform:none;margin:0 0 10px;color:#1A2E42;}' +
    '.balm .opts{display:flex;flex-wrap:wrap;gap:7px;}' +
    '.balm .opt{font:inherit;font-size:13.5px;line-height:1.3;font-weight:600;color:#1F699E;background:#fff;border:1px solid #C9DFF3;border-radius:20px;padding:7px 14px;cursor:pointer;}' +
    '.balm .opt.on{background:#1F699E;border-color:#1F699E;color:#fff;font-weight:700;}' +
    '.balm .opt.other{border:1.5px solid #1F699E;font-weight:700;}' +
    '.balm .opt .x{margin-left:8px;font-size:15px;font-weight:400;opacity:.85;}' +
    '.balm .opts.pair{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:stretch;}' +
    '.balm .pair .opt{text-align:center;display:flex;align-items:center;justify-content:center;}' +
    '.balm .pair .opt:nth-child(2){order:3;}.balm .pair .opt:nth-child(3){order:2;}' +
    '.balm .crow{display:flex;align-items:flex-start;gap:10px;margin-top:10px;}' +
    '.balm .chk{display:flex;gap:10px;align-items:flex-start;margin-top:10px;font-size:14px;line-height:1.4;cursor:pointer;color:#1A2E42;}' +
    '.balm .crow .chk{margin:0;flex:1;}' +
    '.balm .chk input{margin-top:2px;width:17px;height:17px;flex:none;accent-color:#1F699E;}' +
    '.balm .ib{flex:none;width:22px;height:22px;border-radius:50%;border:1.5px solid #1F699E;background:#fff;color:#1F699E;font:italic 700 13px/1 Georgia,serif;cursor:pointer;padding:0;}' +
    '.balm .exn{font-size:13.5px;color:#4B5A6D;margin:4px 0 0 27px;line-height:1.45;}' +
    '.balm .own{display:flex;gap:8px;margin-top:10px;}' +
    '.balm .own input,.balm .own textarea{flex:1;min-width:0;font:inherit;font-size:15px;padding:10px 12px;border:1.5px solid #C9DFF3;border-radius:10px;color:#1A2E42;}' +
    '.balm .own textarea{min-height:90px;resize:vertical;}' +
    '.balm .abtn{font:inherit;font-size:14px;font-weight:700;padding:9px 18px;border-radius:20px;border:0;background:#1F699E;color:#fff;cursor:pointer;}' +
    '.balm .msg{font-size:14px;line-height:1.5;color:#4B5A6D;margin:12px 0 0;}' +
    '.balm .lead{font:inherit;font-size:17px;font-weight:800;color:#1F699E;margin:0 0 4px;}';
  document.head.appendChild(css);

  function visible(st, stepName) {
    if (st.when && ans(st.when.k).indexOf(st.when.v) < 0) { return false; }
    return true;
  }
  function gated(stepName) { return WORK.indexOf(stepName) > -1; }
  function isNo() { return ans('works').indexOf('No') > -1; }
  function isYes() { return ans('works').indexOf('Yes') > -1; }

  function toggleHtml() {
    return '<div class="balbox"><div class="qb"><h2>Do you work or want to work right now?</h2><div class="opts">' +
      ['Yes', 'No'].map(function (v) { return '<button type="button" class="opt swbtn' + (ans('works').indexOf(v) > -1 ? ' on' : '') + '" data-v="' + v + '">' + v + (ans('works').indexOf(v) > -1 ? '<span class="x" aria-hidden="true">\u00D7</span>' : '') + '</button>'; }).join('') +
      '</div>' + (isNo() ? '<p class="msg">' + esc(MSG) + '</p>' : '') + '</div></div>';
  }

  function questionHtml(st, n) {
    if (st.lead) { return '<h3 class="lead">' + esc(st.t) + '</h3>'; }
    var h = '<div class="qb" data-n="' + n + '"><h2>' + esc(st.t) + '</h2>';
    if (st.text) {
      var v = S[st.k] && S[st.k][0] ? S[st.k][0] : '';
      h += '<div class="own">' + (st.area ? '<textarea class="jt" aria-label="Your answer">' + esc(v) + '</textarea>' : '<input type="text" class="jt" maxlength="120" aria-label="Your answer" value="' + esc(v) + '">') + '</div></div>';
      return h;
    }
    var src = st.l;
    if (st.from) { src = ans(st.from).slice(); S[st.k] = ans(st.k).filter(function (x) { return src.indexOf(x) > -1; }); }
    var mine = ans(st.k);
    var keys = src.map(function (x) { return parts(x).k; });
    var all = src.concat(mine.filter(function (x) { return src.indexOf(x) < 0 && keys.indexOf(x) < 0; }));
    var cbm = !st.pair && src.some(function (x) { return wc(x) > 3; });
    if (cbm) {
      all.forEach(function (x, i) {
        var p = parts(x);
        h += '<div class="crow"><label class="chk"><input type="checkbox" data-c="' + i + '"' + (mine.indexOf(p.k) > -1 ? ' checked' : '') + '><span>' + emo(p.k) + esc(p.k) + '</span></label>' +
          (p.ex ? '<button type="button" class="ib" aria-label="Examples for ' + esc(p.k) + '">i</button>' : '') + '</div>' +
          (p.ex ? '<div class="exn" hidden>' + esc(p.ex) + '</div>' : '');
      });
      if (!st.noOther) { h += '<label class="chk"><input type="checkbox" class="oth"><span>+ Other</span></label>'; }
    } else {
      var shorts = all.concat(st.noOther ? [] : ['+ Other']);
      h += '<div class="opts' + (st.pair ? ' pair' : '') + '">' + shorts.map(function (x, i) {
        return '<button type="button" class="opt' + (x === '+ Other' ? ' other' : '') + (mine.indexOf(x) > -1 ? ' on' : '') + '" data-i="' + i + '">' + emo(x) + esc(x) + (mine.indexOf(x) > -1 ? '<span class="x" aria-hidden="true">\u00D7</span>' : '') + '</button>';
      }).join('') + '</div>';
    }
    return h + '<div class="ownhost"></div></div>';
  }

  function paint(stepName) {
    var host = hosts[stepName], list = STEPS[stepName], h = '', y = window.scrollY;
    var hide = gated(stepName) && !isYes();
    var cur = '', count = 0;
    function flush() { if (count > 0) { h += '<div class="balbox">' + cur + '</div>'; } cur = ''; count = 0; }
    if (gated(stepName)) { h += toggleHtml(); }
    list.forEach(function (st, n) {
      if (st.box) { flush(); }
      if (st.k === 'works') { flush(); h += toggleHtml(); return; }
      if (hide) { return; }
      if (!visible(st, stepName)) { return; }
      if (st.from && !ans(st.from).length) { return; }
      if (st.k === 'aligned' || st.k === 'best') { if (!isYes()) { return; } }
      cur += questionHtml(st, n);
      if (!st.lead) { count++; }
    });
    flush();
    if (stepName === 'Skills') { h += toggleHtml(); }
    host.innerHTML = h;
    wire(stepName);
    window.scrollTo(0, y);
  }
  function paintAll() { Object.keys(hosts).forEach(paint); }

  function addOwn(st, host, stepName) {
    if (host.firstChild) { return; }
    host.innerHTML = '<div class="own"><input type="text" maxlength="60" placeholder="Add your own" aria-label="Add your own"><button class="abtn" type="button">Add</button></div>';
    var i = host.querySelector('input');
    function add() { var v = i.value.trim(); if (!v) { return; } if (ans(st.k).indexOf(v) < 0) { ans(st.k).push(v); } paintAll(); }
    host.querySelector('button').addEventListener('click', add);
    i.addEventListener('keydown', function (e) { if (e.key === 'Enter') { add(); } });
    i.focus();
  }

  function wire(stepName) {
    var host = hosts[stepName], list = STEPS[stepName];
    host.querySelectorAll('.swbtn').forEach(function (b) {
      b.addEventListener('click', function () { S.works = [b.getAttribute('data-v')]; paintAll(); });
    });
    host.querySelectorAll('.qb[data-n]').forEach(function (q) {
      var st = list[+q.getAttribute('data-n')];
      var jt = q.querySelector('.jt');
      if (jt) { jt.addEventListener('input', function () { S[st.k] = [jt.value.trim()]; }); return; }
      var mine = ans(st.k), src = st.from ? ans(st.from).slice() : st.l;
      var keys = src.map(function (x) { return parts(x).k; });
      var all = src.concat(mine.filter(function (x) { return src.indexOf(x) < 0 && keys.indexOf(x) < 0; }));
      var cbm = !st.pair && src.some(function (x) { return wc(x) > 3; });
      var shorts = cbm ? [] : all.concat(st.noOther ? [] : ['+ Other']);
      var oh = q.querySelector('.ownhost');
      var oc = q.querySelector('.oth');
      if (oc) { oc.addEventListener('change', function () { if (oc.checked) { addOwn(st, oh, stepName); } oc.checked = false; }); }
      q.querySelectorAll('input[data-c]').forEach(function (c) {
        c.addEventListener('change', function () {
          var v = parts(all[+c.getAttribute('data-c')]).k, k = mine.indexOf(v);
          if (c.checked) { if (st.one) { mine.length = 0; } mine.push(v); } else if (k > -1) { mine.splice(k, 1); }
          if (st.feeds || st.one || st.k === 'services') { paintAll(); }
        });
      });
      q.querySelectorAll('.ib').forEach(function (b) {
        b.addEventListener('click', function () { var e = b.parentNode.nextSibling; if (e) { e.hidden = !e.hidden; } });
      });
      q.querySelectorAll('.opt').forEach(function (b) {
        b.addEventListener('click', function () {
          var v = shorts[+b.getAttribute('data-i')];
          if (v === '+ Other') { addOwn(st, oh, stepName); return; }
          if (st.one) { mine.length = 0; mine.push(v); paintAll(); return; }
          var i = mine.indexOf(v);
          if (i > -1) { mine.splice(i, 1); b.classList.remove('on'); } else { mine.push(v); b.classList.add('on'); }
          if (st.feeds) { paintAll(); }
        });
      });
    });
  }

  function mount() {
    var titles = window._gpTitles || [];
    Object.keys(STEPS).forEach(function (name) {
      if (hosts[name]) { return; }
      var n = titles.indexOf(name);
      if (n < 0) { return; }
      var nodes = document.querySelectorAll('[data-gp-step="' + n + '"]');
      if (!nodes.length) { return; }
      var last = nodes[nodes.length - 1];
      var host = document.createElement('div');
      host.className = 'balm';
      host.setAttribute('data-gp-step', String(n));
      host.style.display = last.style.display;
      last.parentNode.insertBefore(host, last.nextSibling);
      hosts[name] = host;
      paint(name);
    });
    return Object.keys(hosts).length === Object.keys(STEPS).length;
  }
  var tries = 0, t = setInterval(function () { tries++; if (mount() || tries > 120) { clearInterval(t); } }, 250);
})();
