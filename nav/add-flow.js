
(function () {
  if (window.CWAdd) return;
  var CSS = ".cwadd{--brand:#1F699E;--ink:#1A2E42;--soft:#2F3D4F;--muted:#5A6878;--line:#DDE4EE;--panel-line:#C9DFF3;font-family:'Nunito Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);line-height:1.5}.cwadd .cw-btn{background:#fff;color:var(--brand);border:0;padding:10px 18px;border-radius:24px;font-family:inherit;font-size:15px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}.cwadd .cw-btn.solid{background:var(--brand);color:#fff;border:1.5px solid var(--brand)}.cwadd .cw-btn.ghost{background:transparent;color:var(--brand);border:1.5px solid var(--brand)}.cwadd .cw-btn.form{padding:11px 22px;border-radius:26px}.cwadd .cw-btn.sm{padding:7px 14px;font-size:13px}.cwadd .cw-fq{font-size:16px;font-weight:700;margin:0 0 4px}.cwadd .cw-fhelp{font-size:13.5px;color:var(--soft);margin:0 0 10px}.cwadd .cw-fchips{display:flex;gap:8px;flex-wrap:wrap}.cwadd .cw-fchip{background:#fff;border:1.5px solid var(--line);border-radius:22px;padding:8px 16px;font-size:14px;font-weight:600;color:var(--ink);cursor:pointer;user-select:none;font-family:inherit}.cwadd .cw-fchip.on{background:var(--brand);color:#fff;border-color:var(--brand)}.cwadd .cw-fbox{border:1.5px solid var(--panel-line);border-radius:14px;padding:12px 20px 16px}.cwadd .cw-status{border-radius:10px;padding:11px 14px;font-size:14px}.cwadd .cw-status.info{background:#E8F2F9;padding:10px 14px;font-size:13.5px;line-height:1.5}.cwadd .cw-search{display:flex;align-items:center;background:#F7F9FC;border:1.5px solid #DDE4EE;border-radius:999px;padding:2px 6px 2px 14px;max-width:320px}.cwadd .cw-search input{flex:1;border:0;background:transparent;font-family:inherit;font-size:14px;padding:8px 4px;outline:none}.cwadd .cw-savestat{font-size:13px;color:var(--muted);font-weight:600}.cwadd .cw-statement{font-size:16px;line-height:1.55;margin:0 0 20px}.cwadd .cw-pq{font-size:20px;font-weight:800;line-height:1.3;margin:0 0 12px}.cwadd .cw-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:32px}.cwadd .cw-foot .cw-btn{min-height:44px}@media(max-width:600px){.cwadd .cw-foot{flex-wrap:wrap}}@media(max-width:600px){.cwadd .cw-foot .cw-btn{flex:1 1 0;text-align:center}}.cwadd .ico{display:inline-block;line-height:0}.cwadd .ico svg{fill:none;stroke:#1F699E;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cwadd .scard{display:flex;gap:12px;align-items:center;border:1.5px solid var(--line);border-radius:14px;padding:12px 14px;margin:22px 0 0;background:#fff}.cwadd .scard p{margin:0;font:400 16px/1.45 'Nunito Sans',sans-serif;color:var(--ink)}.cwadd .scard .ico{flex:none}.cwadd .prompt{font:400 16px/1.45 'Nunito Sans',sans-serif;color:var(--ink);margin:0 0 10px}.cwadd .pq{font-size:20px;font-weight:800;line-height:1.3;margin:0 0 12px}.cwadd .fq{font-size:16px;font-weight:700;margin:18px 0 4px}.cwadd .help{font-size:13.5px;color:var(--soft);margin:0 0 10px}.cwadd .pills{display:flex;gap:8px;flex-wrap:wrap}.cwadd .pill{background:#fff;border:1.5px solid var(--line);border-radius:22px;padding:8px 16px;min-height:38px;font:600 14px 'Nunito Sans',sans-serif;color:var(--ink);cursor:pointer}.cwadd .pill.on{background:var(--brand);border-color:var(--brand);color:#fff;font-weight:700}.cwadd .pill.other{color:var(--brand);font-weight:700}.cwadd .nsec{margin-top:18px}.cwadd .nsec:first-child{margin-top:0}.cwadd .ind{margin:14px 0 0 6px;padding-left:14px;border-left:3px solid var(--panel-line)}.cwadd .sec{margin-top:18px}.cwadd .sec:first-child{margin-top:0}.cwadd .sec+.sec{border-top:1.5px solid var(--line);padding-top:16px}.cwadd .sec+.sec.noline{border-top:0;padding-top:0;margin-top:16px}.cwadd .past.lock{pointer-events:none}.cwadd .past .pq,.cwadd .past .help,.cwadd .past .fq,.cwadd .past .foot{display:none}.cwadd input.field{width:100%;height:44px;border:1.5px solid var(--line);border-radius:12px;padding:0 14px;font:600 16px 'Nunito Sans',sans-serif;color:var(--ink)}.cwadd input.field:focus{outline:0;border-color:var(--brand)}.cwadd .sug{border:1.5px solid var(--line);border-radius:12px;overflow:hidden;margin:6px 0 0}.cwadd .sug button{display:block;width:100%;text-align:left;background:#fff;border:0;border-top:1px solid var(--line);padding:11px 14px;min-height:44px;font:600 15px 'Nunito Sans',sans-serif;color:var(--ink);cursor:pointer}.cwadd .sug button:first-child{border-top:0}.cwadd .sug button.own{color:var(--brand);font-weight:700}.cwadd .foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:32px}.cwadd .foot .r{display:flex;gap:4px;align-items:center;margin-left:auto}.cwadd .foot .cw-btn{min-height:44px}.cwadd .link{font:700 14px 'Nunito Sans',sans-serif;color:var(--brand);background:none;border:0;padding:12px 8px;cursor:pointer}.cwadd label.cw-lp{display:inline-flex;align-items:center;gap:8px;box-sizing:border-box;min-height:34px;padding:5px 12px 5px 6px;border:1.5px solid #DDE4EE;border-radius:24px;background:#fff;font-size:13px;font-weight:700;color:#5A6878;cursor:pointer;position:relative}.cwadd .cw-lp-in{position:absolute;opacity:0;width:1px;height:1px;margin:0}.cwadd .cw-lp-trk{width:34px;height:20px;border-radius:10px;background:#C9D3DE;position:relative;flex-shrink:0}.cwadd .cw-lp-trk>span{position:absolute;top:3px;left:3px;width:14px;height:14px;border-radius:50%;background:#fff}.cwadd .cw-lp-pin{display:inline-flex;visibility:hidden;margin-left:-5px;line-height:0}.cwadd .cw-lp-in:checked~.cw-lp-trk{background:#1F699E}.cwadd .cw-lp-in:checked~.cw-lp-trk>span{left:17px}.cwadd .cw-lp-in:checked~.cw-lp-pin{visibility:visible}.cwadd label.cw-lp:has(.cw-lp-in:checked){border-color:#1F699E;color:#1F699E}.cwadd label.cw-lp:has(.cw-lp-in:focus-visible){box-shadow:0 0 0 2px #fff,0 0 0 4px #1F699E}";
  function css() { if (document.getElementById('cwadd-css')) return; var s = document.createElement('style'); s.id = 'cwadd-css'; s.textContent = CSS; document.head.appendChild(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var KINDS = ['Experience', 'Skill or service', 'Thing', 'Place'];
  var TIMES = ['One-time', 'Part-time', 'Full-time'];
  var ROLES = { Paid: ['Building', 'Speaking', 'Fundraising', 'Other'], Unpaid: ['Volunteering', 'Building', 'Board seat', 'Speaking', 'Other'] };
  var PHOW = ['Solo work', 'Collaborative work', 'Both'];
  var JOB = { type: ['Full-time employment', 'Part-time employment', 'Temp work'], where: ['Onsite full-time', 'Hybrid', 'Remote full-time'], pay: ['Paid work', 'Unpaid work', 'Both'], how: ['Freelance/gig work', 'Subcontractor work', 'Through my own entity', 'Other'] };
  var WAYS8 = ['Paid', 'Hourly', 'On call', 'Salary', 'Volunteer', 'Trade', 'Time bank', 'Gift'];
  var MONEY = ['Paid', 'Hourly', 'On call', 'Salary'];
  var REASONS = ['earn money', 'feel better', 'express myself', 'find purpose', 'build confidence', 'home life', 'essentials'];
  var IC = { need: '<path d="M4 12v8h16v-8"/><path d="M12 3v11"/><path d="M8 10l4 4 4-4"/>', offer: '<path d="M4 15v4h16v-4"/><path d="M12 15V4"/><path d="M8 8l4-4 4 4"/>' };
  var PIN = '<svg class="cw-pin" width="18" height="18" viewBox="0 0 24 24" stroke="#1F699E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-4px"><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" fill="#1F699E"/><circle cx="12" cy="11" r="2.6" fill="#fff" stroke="none"/></svg>';
  function flowOf(dk, onDone, onCancel) {
    var TREE={
     Creating:{q:'Analogue or digital?',k:{
      Analogue:{'Art and music':['Instruments','Art supplies','Singing lessons'],'Food and drink':{'People/skills':['Beginner','Experienced','Guide'],'Things':['Kitchen supplies'],'Space':['A kitchen to use','A place to cook together'],'Experiences':['Cooking classes']},'Building':['Power tools','Plumber','Woodworking']},
      Digital:{'Art and design':['Design software','Graphic designer','Animation'],'Music and sound':['Audio gear','Sound engineer','Podcasting']}}},
     Playing:{q:'Analogue or digital?',k:{
      Analogue:{'Sports':['Sports gear','A coach','Pickleball'],'Board and table games':['Game sets','Game night host','Chess'],'Puzzles and collecting':['Model kits','Trivia host','Puzzles']},
      Digital:{'Video games':['Consoles','A gaming coach','Playing together'],'eSports':{'People/skills':['Beginner','Experienced','Guide'],'Things':['Gaming gear'],'Space':['A gaming space','A place to meet other players'],'Experiences':['Joining a team','Tournaments']},'Fantasy sports':['A league app','A league manager','Joining a league']}}},
     Experiencing:{q:'Which fits best?',k:{
      'Nature and events':{'Outdoors':['Camping gear','A guide','Hiking'],'Festivals':['Tickets','Someone to go with','Local festivals'],'Live arts':['Theater tickets','Acting lessons','Live music']},
      'Going places':{'Far away':['Travel gear','Travel planner','Cultural tours'],'Weekends':['A place to stay','A travel buddy','Road trips'],'Close to home':['A bike','A local guide','Local exploring']},
      'Vehicles and rides':{'Cars':['Car parts','Auto mechanic','Car shows'],'Bikes and motorcycles':['A bike','Bike repair','Group rides'],'Trains and planes':['Model trains','A pilot','Train journeys']}}},
     Caring:{q:'For myself or for others?',k:{
      'For myself':{'My body':['Health supplies','Massage therapist','Yoga'],'My mind and meaning':['Books and journals','Counselor','Meditation'],'My home and safety':['Home supplies','Plumber','Mold check']},
      'For others':{'People':['Supplies to share','Childcare','Volunteering'],'Animals':['Pet supplies','Pet sitting','Animal rescue'],'Nature':['Garden supplies','Arborist','Tree planting']}}},
     Fixing:{q:'What kind of thing?',k:{'Things at home':{'Plumbing':[],'Electrical':[],'Walls and floors':[]},'Things I own':{'Appliances':[],'Clothes and furniture':[],'Bikes and cars':[]},'Digital things':{'Computers and phones':[],'Websites and apps':[],'Accounts and data':[]}}}
    };
    var ICON={offer:'<path d="M4 15v4h16v-4"/><path d="M12 15V4"/><path d="M8 8l4-4 4 4"/>',seek:'<path d="M4 12v8h16v-8"/><path d="M12 3v11"/><path d="M8 10l4 4 4-4"/>'};
    var LEAD={offer:"I'm offering",seek:"I'm seeking"};
    var WHAT={offer:'what I\'m offering',seek:'what I\'m seeking'};
    var VERB={Creating:'to create',Playing:'to play',Experiencing:'to experience',Caring:'to care',Fixing:'to fix'};
    var NEEDMAP={'Plumbing':[['Plumbing tools'],['A place to practise'],['Repair workshops']],'Electrical':[['Electrical tools'],['A workshop'],['Repair workshops']],'Walls and floors':[['Paint and tools'],['A workshop'],['Home repair days']],'Appliances':[['Spare parts'],['A repair space'],['Repair cafes']],'Clothes and furniture':[['Sewing supplies','Furniture tools'],['A sewing or woodworking space'],['Mending circles']],'Bikes and cars':[['Bike and car parts'],['A garage'],['Repair days']],'Computers and phones':[['Spare parts and cables'],['A quiet place to work on it'],['Tech help sessions']],'Websites and apps':[['Software tools'],['A shared workspace'],['Code and fix sessions']],'Accounts and data':[['Backup tools'],['A quiet place to sort it out'],['Digital tidy-up sessions']],'Art and music':[['Instruments','Art supplies'],['A studio','A practice space'],['Singing lessons']],'Building':[['Power tools'],['A workshop','A shared garage'],['Woodworking']],'Art and design':[['Design software'],['A shared studio'],['Animation']],'Music and sound':[['Audio gear'],['A recording space'],['Podcasting']],'Sports':[['Sports gear'],['A court or field'],['Pickleball']],'Board and table games':[['Game sets'],['A game table'],['Chess','Game nights']],'Puzzles and collecting':[['Model kits'],['A place to display or trade'],['Puzzles','Trivia nights']],'Video games':[['Consoles'],['A gaming space'],['Playing together']],'Fantasy sports':[['A league app'],['A place to watch together'],['Joining a league']],'Outdoors':[['Camping gear'],['A trail or campsite'],['Hiking']],'Festivals':[['Tickets'],['A venue'],['Local festivals']],'Live arts':[['Theater tickets'],['A venue'],['Live music','Acting lessons']],'Far away':[['Travel gear'],['A place to stay'],['Cultural tours']],'Weekends':[['Travel gear'],['A place to stay'],['Road trips']],'Close to home':[['A bike'],['A local spot to explore'],['Local exploring']],'Cars':[['Car parts'],['A garage'],['Car shows']],'Bikes and motorcycles':[['A bike'],['A repair space'],['Group rides']],'Trains and planes':[['Model trains'],['A hobby space'],['Train journeys']],'My body':[['Health supplies'],['A quiet place to move'],['Yoga']],'My mind and meaning':[['Books and journals'],['A quiet place'],['Meditation']],'My home and safety':[['Home supplies'],['A safe place'],['Mold check']],'People':[['Supplies to share'],['A place to gather'],['Volunteering']],'Animals':[['Pet supplies'],['A place for animals'],['Animal rescue']],'Nature':[['Garden supplies'],['A garden or green space'],['Tree planting']]};
    Object.keys(TREE).forEach(function(c){var sp=TREE[c].k;Object.keys(sp).forEach(function(g){var ar=sp[g];Object.keys(ar).forEach(function(a){if(Array.isArray(ar[a])&&NEEDMAP[a]){var m=NEEDMAP[a];ar[a]={'People/skills':['Beginner','Experienced','Guide'],'Things':m[0],'Space':m[1],'Experiences':m[2]};}});});});
    var KE={'People/skills':'👤 ','Things':'📦 ','Space':'🏠 ','Experiences':'💫 '};var NSTEM={'People/skills':'meeting people who are','Things':'with these things','Space':'with these places','Experiences':'with these experiences'};var LV={Beginner:'beginners',Experienced:'experienced people',Guide:'guides'};
    var KFIRST={'Experience':'an experience','Skill or service':'a skill or service','Thing':'a thing','Place':'a place'};
    var BEC={'Earn money':[],'Exchange value':{'Exchange resources':['My time','My skills','My labor'],'Give to others':[]},'Connect with people':['Experience with others','Build with others','Grow with others'],'Grow myself':{'Improve my skills':[],'Feel better':['Express myself','Find purpose','Build confidence'],'Discover something new':[]}};
    var BECT={'Personal use':['Projects','Home life','Trying out'],'Professional use':['Client work','My business','Leading'],'Community use':['Giving','Volunteering','Essentials']};
    var WAYS=['Paid','Hourly','On call','Salary','Volunteer','Trade','Time bank','Gift'];var LVO={Beginner:'as a beginner',Experienced:'as an experienced person',Guide:'as a guide'};var LVS={Beginner:'from a beginner',Experienced:'from someone experienced',Guide:'from a guide'};
    var TW={seek:{'Buy':'buy','Borrow':'borrow','Trade':'trade','Gift':'receive as a gift','Time bank':'use a time bank','Pay what I can':'pay what I can'},offer:{'Sell':'sell','Lend':'lend','Trade':'trade','Gift':'gift','Time bank':'use a time bank','Pay what you can':'accept what people can pay'}};
    var XKIND={'Plumbing':'Skill or service','Massage':'Skill or service','Hair stylist':'Skill or service','Gardening':'Skill or service','Guitar':'Skill or service','Watercolor painting':'Skill or service','Cat care':'Skill or service','Gunpla':'Thing','Road trips':'Experience'};
    var STOP='a an the some someone anyone who whom that which i im i\'m me my mine we our us you your to for of in on at with and or but is are be am was want wants need needs looking look seeking seek find finding get getting have has had like would could can please something anything thing things know knows person people help helper'.split(' ');
    var ALLWORDS=[];
    (function walk(n){if(Array.isArray(n)){n.forEach(function(w){if(ALLWORDS.indexOf(w)<0)ALLWORDS.push(w);});return;}Object.keys(n).forEach(function(k){walk(n[k].k||n[k]);});})(TREE);
    Object.keys(XKIND).forEach(function(w){if(ALLWORDS.indexOf(w)<0)ALLWORDS.push(w);});
    ALLWORDS=ALLWORDS.filter(function(w){return ['Beginner','Experienced','Guide'].indexOf(w)<0;});
    var S={tick:{},own:{},otherKey:null,lastN:0,hist:[],screen:'start',kind:dk,path:[],word:null,top:null,saved:[],exchange:null,skipEx:false,other:false,typed:'',lk:null,lj:null,lkApplied:{},askCat:false,pendingWord:null,level:null,way:null,ways:[],xt:{},xo:{},xtext:'',xother:null,wpick:{}};
    var root=null,app=null;
    function icon(k){var sp=el('span',{cls:'ico'});sp.innerHTML='<svg width="28" height="28" viewBox="0 0 24 24">'+ICON[k]+'</svg>';return sp;}
    function listOf(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' or '+a[a.length-1];}
    function listAnd(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
    function lc(x){return x.charAt(0).toLowerCase()+x.slice(1);}
    function plab(path,k){if(path.length===3&&(k in KE))return KE[k]+k;return path[0]==='Playing'&&path.length===1&&(k==='Analogue'||k==='Digital')?k+' style':k;}
    function nodeAt(path){var n=TREE[path[0]].k;for(var i=1;i<path.length;i++){if(!n||Array.isArray(n)||!(path[i] in n))return null;n=n[path[i]];}return n;}
    function pkey(path){return path.join('>');}
    function tickedOf(path){var n=nodeAt(path);if(!n)return [];var list=Array.isArray(n)?n:Object.keys(n);var t=list.filter(function(k){return S.tick[pkey(path.concat(k))];});var o=S.own[pkey(path)]||[];if(o.length)S.leafFlag=true;return t.concat(o);}
    function desc(path){var t=tickedOf(path);if(!t.length)return '';var n=nodeAt(path);
     if(n&&!Array.isArray(n)&&('Things' in n)){S.leafFlag=true;t.forEach(function(kd){if(!(kd in n)){S.leafWords.push(lc(kd));return;}var w=tickedOf(path.concat([kd]));
      if(kd==='People/skills')S.leafWords.push((S.kind==='offer'?'welcoming ':'meeting ')+(w.length?listAnd(w.map(function(x){return LV[x]||lc(x);})):'people'));
      else if(w.length)w.forEach(function(x){S.leafWords.push(lc(x));});else S.leafWords.push(lc(kd));});return '';}
     if(Array.isArray(n)){S.leafFlag=true;S.leafWords=S.leafWords.concat(t.map(lc));return '';}
     var depth=path.length;var parts=t.map(function(k){var sub=nodeAt(path.concat([k]))?desc(path.concat([k])):'';var base=depth===1?((k==='Analogue'||k==='Digital')?'something '+lc(plab(path,k)):lc(k)):k;return base+(sub?' '+sub:'');});
     return depth===1?parts.join(', and '):'in: '+parts.join(' and ');}
    function prefix(path){if(path.length===4&&(path[3] in NSTEM))return prefix(path.slice(0,3)).replace(/…$/,'')+', '+(path[3]==='People/skills'&&S.kind==='offer'?'welcoming people who are':NSTEM[path[3]])+'…';var t=LEAD[S.kind]+' '+VERB[path[0]];
     if(path.length===1){var n=nodeAt(path);return t+(n&&!Array.isArray(n)&&('Analogue' in n)?' something…':'…');}
     path.slice(1).forEach(function(k,i){if(i===0)t+=(k==='Analogue'||k==='Digital')?' something '+lc(plab(path.slice(0,1),k)):' '+lc(k);else if(i===1)t+=' in: '+k;else t+=', '+lc(k);});return t+'…';}
    function isThingSeek(){return S.kind==='seek'&&!(S.path&&S.path.length)&&S.lk==='Thing';}
    function isThingOffer(){return S.kind==='offer'&&!(S.path&&S.path.length)&&S.lk==='Thing';}
    function isThing(){return !(S.path&&S.path.length)&&S.lk==='Thing';}
    function isSvc(){return !S.path.length&&S.lk==='Skill or service';}
    function BECX(){return isThingSeek()?BECT:BEC;}
    function bnode(path){var n=BECX();path.forEach(function(k){n=n[k];});return n;}
    function becWords(){var out=[];var xt=S.xt||{},xo=S.xo||{};
     Object.keys(BECX()).forEach(function(g){if(!xt[g])return;var sub=BECX()[g];var n0=out.length;
      if(Array.isArray(sub)){sub.forEach(function(k){if(xt[g+'>'+k])out.push(k.toLowerCase());});}
      else Object.keys(sub).forEach(function(m){var mk=g+'>'+m;if(!xt[mk])return;var kids=[];sub[m].forEach(function(c){if(xt[mk+'>'+c])kids.push(c.toLowerCase());});(xo[mk]||[]).forEach(function(w){kids.push(w.toLowerCase());});
       out.push(kids.length?m.toLowerCase()+' ('+listAnd(kids)+')':m.toLowerCase());});
      (xo[g]||[]).forEach(function(w){out.push(w.toLowerCase());});if(out.length===n0)out.push(g.toLowerCase());});
     var xt2=(S.xtext||'').trim().replace(/^i['’]d like (it for|to)\s+/i,'').replace(/[.]+$/,'');if(xt2)out.push(xt2.charAt(0).toLowerCase()+xt2.slice(1));
     return out;}
    function build(withVia){var t=LEAD[S.kind];var cat=S.path&&S.path[0];S.leafFlag=false;S.leafWords=[];
     if(cat){t+=' '+VERB[cat];var d=desc([cat]);if(d)t+=' '+d;}
     else if(S.word){if(S.lk&&KFIRST[S.lk])t+=': '+lc(S.word);else t+=' '+lc(S.word);S.leafFlag=true;}
     if(!S.leafFlag)return t+'…';
     if(isSvc()){if(S.level)t+=' '+(S.kind==='offer'?LVO:LVS)[S.level];}
     else if(withVia&&!isThingOffer()){var bw=becWords();if(bw.length)t+=(isThingSeek()?' because I\'d like it for ':' because I\'d like to ')+listAnd(bw);}
     return t+'.'+(S.leafWords.length&&cat?' This includes '+listAnd(S.leafWords)+'.':'');}
    function sentence(){return build(true);}
    function lev(a,b){var m=[],i,j;for(i=0;i<=b.length;i++)m[i]=[i];for(j=0;j<=a.length;j++)m[0][j]=j;for(i=1;i<=b.length;i++)for(j=1;j<=a.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(b[i-1]===a[j-1]?0:1));return m[b.length][a.length];}
    function stem(w){var r=w.toLowerCase();[['ers',''],['ing',''],['ists',''],['ist',''],['ians',''],['ian',''],['er',''],['es',''],['s','']].some(function(p){if(r.length>p[0].length+3&&r.slice(-p[0].length)===p[0]){r=r.slice(0,-p[0].length);return true;}return false;});return r;}
    function findWords(v){var toks=v.toLowerCase().split(/[^a-z']+/).filter(function(t){return t.length>=2&&STOP.indexOf(t)<0;});if(!toks.length)return [];var res=[];ALLWORDS.forEach(function(w){var wl=w.toLowerCase();var parts=wl.split(/\s+/);var best=0;toks.forEach(function(t){var st=stem(t);var sc=0;if(wl.indexOf(t)>=0)sc=3;else if(st.length>=3&&wl.indexOf(st)>=0)sc=2;else if(t.length>=5&&parts.concat([wl]).some(function(p){return lev(p,t)<=(t.length>=8?2:1);}))sc=1;if(sc>best)best=sc;});if(best)res.push([best,w]);});res.sort(function(x,y){return y[0]-x[0];});return res.slice(0,3).map(function(x){return x[1];});}
    function suggestBox(inp,list){function paint(){list.innerHTML='';var v=inp.value.trim();if(!v)return;var box=el('div',{cls:'sug'});findWords(v).filter(function(w){var kd=S.lk&&kindOf(w);return !kd||kd===S.lk;}).forEach(function(w){box.appendChild(btn(w,'',function(){S.typed='';pick(w);}));});box.appendChild(btn('Use "'+v+'" as I typed it','own',function(){S.typed='';pick(v);}));list.appendChild(box);}inp.addEventListener('input',paint);inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&inp.value.trim()){e.preventDefault();var v=inp.value.trim();S.typed='';pick(v);}});paint();}
    function waysFor(){return isThing()?Object.keys(TW[S.kind]):WAYS;}
    function wayNext(){return isThing()?go('vis'):go('review');}
    function el(t,a,c){var e=document.createElement(t);if(a)for(var k in a){if(k==='on')for(var ev in a.on)e.addEventListener(ev,a.on[ev]);else if(k==='cls')e.className=a[k];else e.setAttribute(k,a[k]);}(c||[]).forEach(function(x){e.appendChild(typeof x==='string'?document.createTextNode(x):x);});return e;}
    function btn(txt,cls,fn){return el('button',{type:'button',cls:cls,on:{click:fn}},[txt]);}
    function inVocab(w){var L=String(w).toLowerCase().trim();return ALLWORDS.some(function(x){return x.toLowerCase()===L;});}
    function finish(){var wl=(S.saved||[]).filter(function(x){return !x.free;}).map(function(x){return String(x.word||'');}).filter(function(w){return w&&['Beginner','Experienced','Guide'].indexOf(w)<0;});onDone({words:wl,free:!!(S.wordFree||Object.keys(S.own).some(function(k){return (S.own[k]||[]).length;})||(S.xtext||'').trim()||Object.keys(S.xo).some(function(k){return (S.xo[k]||[]).length;})),dir:S.kind==='offer'?'Offering it':'Seeking it',kind:S.path.length?'':(S.lk||''),sub:!S.path.length&&S.lk==='Experience'?(S.lj||''):'',sentence:sentence(),level:isSvc()?(S.level||''):'',ways:(isSvc()||isThing())?S.ways.slice():null,anyWay:!!S.anyWay,cue:String(S.word||'')});}
    function clearPick(){S.anyWay=false;S.wordFree=false;S.level=null;S.way=null;S.ways=[];S.exchange=null;S.skipEx=false;S.xt={};S.xo={};S.xtext='';S.word=null;S.saved=[];S.lastN=0;}
    function go(s){if(s==='review'&&isSvc()){if(!S.level)s='level';else if(!S.way)s='way';}else if(s==='review'&&isThingOffer()){s=S.way?'vis':'way';}else if(s==='review'){if(S.skipEx)s='vis';else if(!S.exchange)s='exchange';}
     if(s==='review'){after();return;}
     if(s==='vis'){finish();return;}
     S.other=false;S.hist.push({s:s});S.screen=s;render();}
    function toStart(){S.hist=[];S.typed='';S.screen='start';S.path=[];S.tick={};S.own={};S.otherKey=null;clearPick();render();}
    function rewind(E){var i=S.hist.indexOf(E);S.hist=S.hist.slice(0,i+1);if(S.word)undoWord();E.chosen=null;S.otherKey=null;if(E.s==='add'){S.tick={};S.own={};S.path=[];}}
    function undoWord(){for(var i=0;i<(S.lastN||1);i++)S.saved.pop();S.word=null;S.lastN=0;}
    function back(){var E=S.hist.pop();var prev=S.hist[S.hist.length-1];if(!prev||(prev.s==='add'&&prev.fromMenu&&E.s==='explore')){toStart();return;}
     if(E.s==='explore'){S.tick={};S.own={};S.otherKey=null;S.path=[];}
     else if(E.s==='review'){if(isSvc()&&S.word)S.way=null;else undoWord();}
     else if(E.s==='exchange'){undoWord();S.exchange=null;}
     else if(E.s==='level'){undoWord();S.level=null;S.way=null;}
     else if(E.s==='way'){S.way=null;S.ways=[];}
     prev.chosen=null;S.other=false;S.screen=prev.s;render();}
    function kindOf(w){var L=w.toLowerCase(),found=null;Object.keys(XKIND).forEach(function(x){if(x.toLowerCase()===L)found=XKIND[x];});if(found)return found;Object.keys(TREE).forEach(function(c){var sp=TREE[c].k;Object.keys(sp).forEach(function(g){var ar=sp[g];Object.keys(ar).forEach(function(a){var n=ar[a];if(n&&!Array.isArray(n)&&('Things' in n)){[['People/skills','Skill or service'],['Things','Thing'],['Space','Place']].forEach(function(p){if((n[p[0]]||[]).some(function(x){return x.toLowerCase()===L&&['beginner','experienced','guide'].indexOf(L)<0;}))found=p[1];});}});});});return found;}
    function pick(word){if(S.otherKey){var k=S.otherKey;S.own[k]=(S.own[k]||[]).concat(word.charAt(0).toUpperCase()+word.slice(1));S.otherKey=null;render();return;}
     if(S.screen==='start'&&!S.lk){var kd=kindOf(word);if(kd)S.lk=kd;else{S.pendingWord=word;S.askCat=true;render();return;}}
     S.word=word;S.wordFree=!inVocab(word);S.lastN=1;S.saved.push({word:word,kind:S.kind,free:S.wordFree});go('review');}
    function after(){if(isThingOffer()){if(!S.way)return go('way');return go('vis');}if(isSvc())return go('vis');if(!S.exchange)return go('exchange');go('vis');}
    function proceed(){var w=[];(function walk(path){var n=nodeAt(path);if(!n)return;var t=tickedOf(path);if(Array.isArray(n)){w=w.concat(t);return;}if(!Array.isArray(n)&&('Things' in n)){t.forEach(function(k){var st=nodeAt(path.concat([k]))?tickedOf(path.concat([k])):[];if(st.length)w=w.concat(st);else w.push(k);});return;}t.forEach(function(k){if(nodeAt(path.concat([k])))walk(path.concat([k]));else w.push(k);});})([S.path[0]]);
     if(!w.length)return;S.word=listAnd(w);S.lastN=w.length;var ownAll={};Object.keys(S.own).forEach(function(k){(S.own[k]||[]).forEach(function(o){ownAll[String(o).toLowerCase()]=1;});});w.forEach(function(x){S.saved.push({word:x,kind:S.kind,free:!!ownAll[String(x).toLowerCase()]||!inVocab(x)});});go('review');}
    function otherBox(){var wrap=el('div',{style:'margin-top:10px'});var inp=el('input',{cls:'field',placeholder:'Add my own',type:'text'});var list=el('div');wrap.appendChild(inp);wrap.appendChild(list);suggestBox(inp,list);setTimeout(function(){inp.focus();},0);return wrap;}
    function makeCard(){var txt=sentence();if(!S.leafFlag)return null;var cd=el('div',{cls:'scard'});cd.appendChild(icon(S.kind));cd.appendChild(el('p',{},[txt]));return cd;}
    function render(){if(!root)return;root.innerHTML='';app=root;
     if(S.screen==='start'){start();return;}
     var st=0,incl=false;S.hist.forEach(function(E,i){if(E.s==='review'){st=i;incl=false;}else if(E.s==='exchange'){st=i;incl=true;}});if(!incl&&st>0&&S.hist[S.hist.length-1].s!=='review')st=st+1;
     S.hist.forEach(function(E,i){if(i<st)return;var last=i===S.hist.length-1;var prevE=S.hist[i-1];var d=el('div',{cls:'sec'+(last?'':' past'+(E.s==='add'||E.s==='explore'?'':' lock'))+(prevE&&prevE.s==='add'?' noline':'')});root.appendChild(d);app=d;section(E,last);if(last){var f=d.querySelector('.foot');if(!f){f=el('div',{cls:'foot'});d.appendChild(f);}if(E.s!=='add'&&E.s!=='review'){var cd=makeCard();if(cd)d.insertBefore(cd,f);}}});
     app=root;}
    function start(){var m=el('div');
     var HQ={seek:'What are you seeking?',offer:'What are you offering?'};
     m.appendChild(el('p',{cls:'pq',style:'margin:0 0 4px'},[HQ[S.kind]]));m.appendChild(el('p',{cls:'help'},['Write it, select from a category, or explore more below.']));
     var spl=el('p',{cls:'fq',style:'margin-top:14px'},['What specifically '+({seek:'are you seeking?',offer:'are you offering?'})[S.kind]]);if(!S.askCat)m.appendChild(spl);
     var fi=el('input',{cls:'field',type:'text',placeholder:'Add a word or a sentence'});var fl=el('div');if(!S.askCat){m.appendChild(fi);m.appendChild(fl);suggestBox(fi,fl);}else{var chip=el('span',{cls:'pill on',style:'display:inline-flex;align-items:center;gap:8px;margin-top:14px'},[String(S.pendingWord||'')]);var x=el('button',{type:'button','aria-label':'Remove',style:'background:none;border:0;color:#fff;font:700 16px Nunito Sans,sans-serif;cursor:pointer;padding:0 0 0 2px;line-height:1'},['\u00d7']);x.addEventListener('click',function(){S.askCat=false;S.pendingWord=null;S.lk=null;S.lj=null;S.lx=null;S.lkApplied={};render();});chip.appendChild(x);m.appendChild(chip);}
     var LKS=[['Experience','<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>'],['Skill or service','<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>'],['Thing','<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5"/><path d="M12 12v9"/>'],['Place','<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>']];
     m.appendChild(el('p',{cls:'fq'},[S.askCat?'Select a category for '+(S.pendingWord||'')+':':'Category:']));var kr=el('div',{cls:'pills'});
     LKS.forEach(function(x){if(S.lk&&S.lk!==x[0])return;var kb=btn('','pill'+(S.lk===x[0]?' on':''),function(){if(S.askCat){S.lk=x[0];S.askCat=false;var pw=S.pendingWord;S.pendingWord=null;pick(pw);return;}S.lk=S.lk===x[0]?null:x[0];S.lj=null;S.lkApplied={};render();});kb.style.cssText='display:inline-flex;align-items:center;gap:8px';var sp=el('span',{cls:'ico'});sp.style.marginBottom='0';sp.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" style="stroke:'+(S.lk===x[0]?'#fff':'#1F699E')+'">'+x[1]+'</svg>';kb.appendChild(sp);kb.appendChild(el('span',{},[x[0]]));kr.appendChild(kb);});m.appendChild(kr);
     if(S.lk==='Experience'){var XG={'Work':['Job','Project','Volunteering'],'Events':['Gathering','Class or workshop','Performance or show'],'Adventures':['Outdoors','Trip','Retreat']};m.appendChild(el('p',{cls:'fq'},['Which kind of experience?']));var xr=el('div',{cls:'pills'});Object.keys(XG).forEach(function(g){xr.appendChild(btn(g,'pill'+(S.lx===g?' on':''),function(){S.lx=S.lx===g?null:g;S.lj=null;render();}));});m.appendChild(xr);if(S.lx){var jr=el('div',{cls:'pills',style:'margin-top:10px'});XG[S.lx].forEach(function(j){jr.appendChild(btn(j,'pill'+(S.lj===j?' on':''),function(){S.lj=S.lj===j?null:j;render();}));});m.appendChild(jr);}}
     if(S.lk){m.appendChild(spl);m.appendChild(fi);m.appendChild(fl);}
     var exBox=el('div');var r2=el('div',{cls:'pills',style:'display:flex;flex-direction:column;align-items:flex-start;gap:10px'});
     if(!S.lk&&!S.askCat){exBox.appendChild(el('p',{cls:'fq'},['Explore:']));exBox.appendChild(el('p',{cls:'prompt',style:'margin:0 0 10px'},[S.kind==='offer'?"I'm offering ...":"I'm seeking ..."]));
      [['to create something','Creating'],['to play something','Playing'],['to experience something','Experiencing'],['to care for something','Caring'],['to fix something','Fixing']].forEach(function(x){r2.appendChild(btn(x[0],'pill',function(){S.top=x[1];S.path=[x[1]];S.word=null;S.tick={};S.own={};S.otherKey=null;S.hist=[{s:'add',chosen:x[1],fromMenu:true},{s:'explore'}];S.screen='explore';render();}));});
      exBox.appendChild(r2);m.appendChild(exBox);fi.addEventListener('input',function(){exBox.style.display=fi.value.trim()?'none':'';});}
     S.startBack=function(){if(S.lk||S.askCat||S.pendingWord){S.lk=null;S.lj=null;S.askCat=false;S.pendingWord=null;S.lkApplied={};render();return;}if(fi.value.trim()){render();return;}onCancel();};
     app.appendChild(m);}
    function section(E,last){var s=E.s;
     if(s==='add'){
      var inp=el('input',{cls:'field',type:'text',placeholder:'Add a word or a sentence',value:S.typed});var list=el('div');
      inp.addEventListener('input',function(){S.typed=inp.value;});app.appendChild(inp);app.appendChild(list);if(last)suggestBox(inp,list);return;}
     if(s==='explore'){var cat=S.path[0];
      function toggle(path,k){if(!last)rewind(E);var key=pkey(path.concat(k));if(S.tick[key]){Object.keys(S.tick).forEach(function(x){if(x===key||x.indexOf(key+'>')===0)delete S.tick[x];});Object.keys(S.own).forEach(function(x){if(x.indexOf(key+'>')===0||x===key)delete S.own[x];});}else S.tick[key]=true;S.other=false;render();}
      function nodeSec(path){var n=nodeAt(path);var isWords=Array.isArray(n);var list=isWords?n:Object.keys(n);var pk=pkey(path);
       var box=el('div',{cls:'nsec'});box.appendChild(el('p',{cls:'prompt'},[prefix(path)]));var p=el('div',{cls:'pills'});
       list.forEach(function(k){p.appendChild(btn(plab(path,k),'pill'+(S.tick[pkey(path.concat(k))]?' on':''),function(){toggle(path,k);}));});
       (S.own[pk]||[]).forEach(function(w,i){p.appendChild(btn(w,'pill on',function(){if(!last)rewind(E);S.own[pk].splice(i,1);render();}));});
       if(path.length>1)p.appendChild(btn('+ Other','pill other',function(){if(!last)rewind(E);S.otherKey=S.otherKey===pk?null:pk;render();}));
       box.appendChild(p);if(!isWords&&('Things' in n)){var hp=el('div',{cls:'help'});[['People/skills','Opportunities for work or community connections'],['Things','Such as gear, tools, or supplies'],['Space','Where to go'],['Experiences','Where people, things, and spaces come together']].forEach(function(h){hp.appendChild(el('p',{style:'margin:2px 0'},[h[0]+': '+h[1]]));});box.appendChild(hp);}var ownL=S.own[pk]||[];if(ownL.length||(S.otherKey===pk&&last))box.appendChild(el('p',{cls:'prompt',style:'margin-top:12px'},['Specifically, '+WHAT[S.kind]+' in '+lc(path[path.length-1])+' is'+(ownL.length?' '+listAnd(ownL.map(lc))+'.':'...')]));if(S.otherKey===pk&&last)box.appendChild(otherBox());
       if(!isWords)list.forEach(function(k){if(S.tick[pkey(path.concat(k))]){var ind=el('div',{cls:'ind'});ind.appendChild(nodeSec(path.concat(k)));box.appendChild(ind);}});return box;}
      app.appendChild(nodeSec([cat]));
      app.appendChild(el('p',{cls:'prompt',style:'margin-top:22px'},['Would you like to add why you’re '+(S.kind==='offer'?'offering':'seeking')+' this? This includes connecting with people, growing yourself, or exchanging value within a community.']));
      app.appendChild(el('div',{cls:'foot'},[el('span',{cls:'r'},[btn('No','pill',function(){S.skipEx=true;S.exchange='skipped';proceed();}),btn('Yes','pill on',function(){S.skipEx=false;S.exchange=null;proceed();})])]));return;}
     if(s==='review'){var cd=makeCard();if(cd){cd.style.marginTop='0';app.appendChild(cd);}app.appendChild(el('p',{cls:'pq',style:'margin-top:22px'},['Look good?']));app.appendChild(el('div',{cls:'pills'},[btn('Yes','pill',function(){after();})]));return;}
     if(s==='exchange'){
      app.appendChild(el('p',{cls:'prompt'},[build(false).split('. This includes')[0].replace(/\.$/,'')+(isThingSeek()?' because I’d like it for…':' because I’d like to…')]));
      var xi=el('input',{cls:'field',type:'text',placeholder:'In my own words',value:S.xtext||''});xi.addEventListener('input',function(){S.xtext=xi.value;var cp=root.querySelector('.sec:last-child .scard p');if(cp)cp.textContent=sentence();});xi.style.marginBottom='16px';app.appendChild(xi);app.appendChild(el('p',{cls:'prompt',style:'margin:0 0 10px'},['Or select from the following:']));
      function bsec(path){var n=bnode(path);var list=Array.isArray(n)?n:Object.keys(n);var pk=path.join('>');var box=el('div',{cls:'nsec'});var p=el('div',{cls:'pills'});
       list.forEach(function(k){var key=pk?pk+'>'+k:k;p.appendChild(btn(k,'pill'+(S.xt[key]?' on':''),function(){if(S.xt[key]){Object.keys(S.xt).forEach(function(x){if(x===key||x.indexOf(key+'>')===0)delete S.xt[x];});}else S.xt[key]=true;render();}));});
       (S.xo[pk]||[]).forEach(function(w,i){p.appendChild(btn(w,'pill on',function(){S.xo[pk].splice(i,1);render();}));});
       if(path.length)p.appendChild(btn('+ Other','pill other',function(){S.xother=S.xother===pk?null:pk;render();}));
       box.appendChild(p);
       if(S.xother===pk){var inp=el('input',{cls:'field',placeholder:'My own words'});inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&inp.value.trim()){var w=inp.value.trim();w=w.charAt(0).toUpperCase()+w.slice(1);(S.xo[pk]=S.xo[pk]||[]).push(w);S.xother=null;render();}});box.appendChild(inp);setTimeout(function(){inp.focus();},0);}
       if(!Array.isArray(n)||path.length===0)list.forEach(function(k){var key=pk?pk+'>'+k:k;var sv=n[k];if(S.xt[key]&&sv&&(!Array.isArray(sv)||sv.length)){var ind=el('div',{cls:'ind'});ind.appendChild(el('p',{cls:'prompt',style:'margin:0 0 10px;font-weight:700'},[k]));ind.appendChild(bsec(path.concat(k)));box.appendChild(ind);}});
       return box;}
      app.appendChild(bsec([]));
      app.appendChild(el('div',{cls:'foot'},[el('span',{cls:'r'},[btn('Skip','link',function(){S.exchange='skipped';pick3();}),btn('Continue','cw-btn solid form',function(){S.exchange=becWords().join(', ')||'skipped';pick3();})])]));return;}
     if(s==='level'){app.appendChild(el('p',{cls:'pq'},[S.kind==='offer'?'What is my level?':'What level am I seeking?']));var p=el('div',{cls:'pills'});['Beginner','Experienced','Guide'].forEach(function(o){p.appendChild(btn(o,'pill'+(S.level===o?' on':''),function(){if(!last)return;S.level=o;go('review');}));});app.appendChild(p);return;}
     if(s==='way'){var ANY='Any of these';if(!Object.keys(S.wpick).some(function(k){return S.wpick[k];}))S.wpick[ANY]=true;app.appendChild(el('p',{cls:'pq'},['Which of the following would you consider?']));var p2=el('div',{cls:'pills'});waysFor().concat([ANY]).forEach(function(o){p2.appendChild(btn(o,'pill'+(S.wpick[o]?' on':''),function(){if(!last)return;if(o===ANY){S.wpick={};S.wpick[ANY]=true;}else{S.wpick[o]=!S.wpick[o];S.wpick[ANY]=false;if(!waysFor().some(function(k){return S.wpick[k];}))S.wpick[ANY]=true;}render();}));});app.appendChild(p2);
      app.appendChild(el('div',{cls:'foot'},[el('span',{cls:'r'},[btn('Skip','link',function(){S.way='skipped';S.ways=[];S.anyWay=false;S.wpick={};wayNext();}),btn('Continue','cw-btn solid form',function(){var any=!!S.wpick['Any of these'];S.anyWay=any;var keys=any?waysFor().slice():waysFor().filter(function(k){return S.wpick[k];});var w=keys.map(function(k){return isThing()?TW[S.kind][k]:lc(k);});S.ways=keys;S.way=w.length?listOf(w):'skipped';S.wpick={};wayNext();})])]));return;}
    }
    function pick3(){if(isThingSeek()&&!S.way)return go('way');go('vis');}
    return { mount: function (r) { root = r; render(); }, goBack: function () { if (S.screen === 'start') { if (S.startBack) S.startBack(); } else back(); } };
  }
  function start(root, o) {
    css();
    o = o || {};
    var gs = o.gs || 'https://cw-api-gate.jessieupp.workers.dev';
    var dk = o.dir === 'offer' ? 'offer' : 'seek';
    var P = { screen: 'flow', step: 0, note: '', busy: false, cats: null, savedDraft: false, flow: null };
    P.ans = { dir: dk === 'offer' ? 'Offering it' : 'Seeking it', kind: '', sub: '', paid: 'Paid', roles: [], type: '', where: '', pay: '', how: '', time: '', cat: '', catGuess: '', detailOn: 'No', detail: '', local: false, anyWay: false, ex: 'Volunteer', needs: '', stay: 'Show my name to people who know me', kindKnown: false, subKnown: false, exAsked: false, ways: [], level: '', sentence: '', words: [], forceAnon: false };
    root.classList.add('cwadd');
    function top() { try { window.scrollTo(0, 0); } catch (e) {} }
    function timeAsked() { var A = P.ans; return A.kind === 'Experience' && (A.sub === 'Job' || A.sub === 'Project'); }
    function svcAnswers() { var A = P.ans, x = {}; if (A.level) x.level = A.level; if (A.local && A.detailOn === 'Yes') x.local = 'Local'; return Object.keys(x).length ? JSON.stringify(x) : ''; }
    function answersJson() {
      var A = P.ans, x = {};
      if (A.kind !== 'Experience') return '';
      if (A.sub === 'Project') { x.paid = A.paid; var allowed = ROLES[A.paid] || []; var rl = (A.roles || []).filter(function (r) { return allowed.indexOf(r) > -1; }); if (rl.length) x.roles = rl; if (PHOW.indexOf(A.how) > -1) x.how = A.how; }
      else if (A.sub === 'Job') { ['type', 'where', 'pay'].forEach(function (k) { if (A[k]) x[k] = A[k]; }); if (JOB.how.indexOf(A.how) > -1) x.how = A.how; }
      else return '';
      return JSON.stringify(x);
    }
    function reviewPicks() {
      var A = P.ans, r = [];
      if (A.sub === 'Project') { r.push(A.paid); (A.roles || []).forEach(function (x) { r.push(x); }); if (PHOW.indexOf(A.how) > -1) r.push(A.how); }
      else { [A.type, A.where, A.pay].forEach(function (x) { if (x) r.push(x); }); if (JOB.how.indexOf(A.how) > -1) r.push(A.how); }
      return r;
    }
    function steps() {
      var A = P.ans, out = [];
      if (!A.kindKnown) out.push({ q: 'What kind of opportunity is it?', help: 'Pick the one that fits best.', key: 'kind', opts: KINDS });
      if (A.kind === 'Experience') {
        if (!A.subKnown) out.push({ q: 'Which kind of experience?', help: 'Pick the one that fits best.', key: 'sub', opts: ['Job', 'Project', 'Volunteering', 'Gathering', 'Class or workshop', 'Performance or show', 'Outdoors', 'Trip', 'Retreat'] });
        if (A.sub === 'Project') {
          out.push({ q: 'Is the project paid or unpaid?', help: 'Pick the one that fits best.', key: 'paid', opts: ['Paid', 'Unpaid'] });
          out.push({ q: 'What kind of project is it?', help: 'Pick any that fit.', key: 'roles', multi: true, opts: ROLES[A.paid] || ROLES.Paid });
          out.push({ q: 'How is the work done?', help: 'Pick the one that fits best.', key: 'how', opts: PHOW });
        } else if (A.sub === 'Job') {
          out.push({ q: 'What type of job is it?', help: 'Pick the one that fits best.', key: 'type', opts: JOB.type });
          out.push({ q: 'Where is the work?', help: 'Pick the one that fits best.', key: 'where', opts: JOB.where });
          out.push({ q: 'Is the job paid?', help: 'Pick the one that fits best.', key: 'pay', opts: JOB.pay });
          out.push({ q: 'How is the work done?', help: 'Pick the one that fits best.', key: 'how', opts: JOB.how });
        }
      }
      if (timeAsked()) out.push({ q: 'How much time does it take?', help: 'Pick the one that fits best.', key: 'time', opts: TIMES });
      if (A.kind === 'Skill or service') out.push({ q: 'Do you want to add any detail?', help: '', key: 'detailOn', detail: true, opts: ['Yes', 'No'] });
      out.push({ q: A.catGuess ? 'Is this the right category?' : 'Which category fits best?', help: A.catGuess ? 'Pick another if one fits better.' : 'Pick the one that fits best.', key: 'cat', search: true, opts: (P.cats || []).map(function (c) { return c.label; }) });
      if (!A.exAsked) out.push({ q: 'How is it exchanged?', help: 'Pick the one that fits best. You can add more later.', key: 'ex', opts: WAYS8 });
      return out;
    }
    function openTo() { var A = P.ans; if (!A.exAsked || !A.ways.length) return ''; if (A.anyWay) return 'any exchange'; var r = []; A.ways.forEach(function (w) { var t = MONEY.indexOf(w) >= 0 ? 'money' : w.toLowerCase(); if (r.indexOf(t) < 0) r.push(t); }); return r.join(', '); }
    function postCard(full) {
      var A = P.ans, ls = [esc(String(A.sentence || '').replace(/^I'm (offering|seeking): /, function (m, v) { return v.charAt(0).toUpperCase() + v.slice(1) + ': '; }))];
      if (A.detailOn === 'Yes' && String(A.detail || '').trim()) ls.push(esc(String(A.detail).trim()));
      if (full) { if (openTo()) ls.push('Open to: ' + esc(openTo())); if (A.cat) ls.push('Category: ' + esc(A.cat) + '.'); if (A.local && A.detailOn === 'Yes') ls.push(PIN + ' Local'); }
      return '<div class="aof"><div class="scard" style="margin:0 0 18px"><span class="ico"><svg width="28" height="28" viewBox="0 0 24 24">' + (A.dir === 'Offering it' ? IC.offer : IC.need) + '</svg></span><p>' + ls.join('<br>') + '</p></div></div>';
    }
    function loadCats() {
      if (P.cats) return; P.cats = [];
      fetch(gs + '?action=getCategories', { cache: 'no-store', referrerPolicy: 'no-referrer' }).then(function (r) { return r.json(); }).then(function (j) { P.cats = (j && j.categories) || []; if (P.screen === 'post') draw(); }).catch(function () {});
    }
    function guessCat(words) {
      var A = P.ans, want = words.map(function (w) { return String(w).toLowerCase().trim(); }).filter(function (w) { return w.length > 2; });
      if (!want.length) return;
      fetch(gs + '?action=getReferenceData', { referrerPolicy: 'no-referrer' }).then(function (r) { return r.json(); }).then(function (d) {
        var labels = (P.cats || []).map(function (c) { return c.label; }), rows = [];
        ['skills', 'recreation', 'resources'].forEach(function (k) { (d && d[k] || []).forEach(function (x) { if (x && x.item) rows.push({ item: String(x.item).toLowerCase(), cat: String(x.category || x.parent || ''), assoc: String(x.associations || '').toLowerCase().split(/\s*,\s*/) }); }); });
        function score(w, x) { if (x.item === w) return 3; if (x.item.split(/\s+/).indexOf(w) > -1 || w.split(/\s+/).indexOf(x.item) > -1) return 2; if (x.assoc.indexOf(w) > -1) return 1; return 0; }
        var best = null, hi = 0;
        want.forEach(function (w) { rows.forEach(function (x) { var sc = score(w, x); if (sc > hi && labels.indexOf(x.cat) > -1) { hi = sc; best = x.cat; } }); });
        if (best && P.ans === A && !A.cat) { A.cat = A.catGuess = best; if (P.screen === 'post') draw(); }
      }).catch(function () {});
    }
    function postHtml() {
      var ST = steps(), N = ST.length, s = P.step, A = P.ans, h = '';
      if (P.screen === 'done') {
        if (P.savedDraft) return '<p class="cw-pq">Saved for now</p><p class="cw-statement">It is in My opportunities. No one sees it until you publish it.</p><a class="cw-btn solid sm" data-cwa="mine">See my opportunities</a>';
        return '<p class="cw-pq">Your opportunity is live</p><p class="cw-statement">We are looking for who matches. You will get an email when someone is interested. ' + (A.stay.indexOf('anonymous') > -1 ? 'No name or photo shows until you both say yes.' : 'People you are connected with, and people in a group or at an event with you, see your name and photo. Everyone else sees them when you both say yes.') + '</p><a class="cw-btn solid sm" data-cwa="list">See opportunities</a>';
      }
      h += '<p class="cw-fhelp" style="margin:0 0 8px;font-weight:700">Step ' + (Math.min(s, N) + 1) + (A.kind && (A.kind !== 'Experience' || A.sub) ? ' of ' + (N + 1) : '') + '</p>';
      if (s < N) {
        var q = ST[s]; h += postCard(false) + '<p class="cw-pq">' + q.q + '</p>' + (q.help ? '<p class="cw-fhelp">' + q.help + '</p>' : '');
        if (q.search) h += '<div class="cw-search" style="max-width:none;margin:0 0 12px"><input id="cwa-catq" placeholder="Search categories" autocomplete="off"></div>';
        if (q.detail) {
          h += '<div class="cw-fchips">' + ['Yes', 'No'].map(function (v) { return '<button type="button" class="cw-fchip' + (A.detailOn === v ? ' on' : '') + '" data-cwa="pick" data-k="detailOn" data-v="' + v + '">' + v + '</button>'; }).join('') + '</div>';
          if (A.detailOn === 'Yes') h += '<div class="cw-fbox" style="margin-top:14px"><textarea id="cwa-dtl" maxlength="300" placeholder="Details (optional)" style="width:100%;border:0;font:inherit;font-size:15px;outline:none;min-height:70px">' + esc(A.detail || '') + '</textarea></div><label class="cw-lp" style="margin:12px 0 0"><input type="checkbox" id="cwa-loc" class="cw-lp-in" role="switch"' + (A.local ? ' checked aria-checked="true"' : ' aria-checked="false"') + '><span class="cw-lp-trk" aria-hidden="true"><span></span></span><span class="cw-lp-w">Local</span><span class="cw-lp-pin" aria-hidden="true">' + PIN + '</span></label>';
        } else {
          h += '<div class="cw-fchips">'; q.opts.forEach(function (v) { var on = q.multi ? (A[q.key] || []).indexOf(v) > -1 : A[q.key] === v; h += '<button type="button" class="cw-fchip' + (on ? ' on' : '') + '" data-cwa="' + (q.multi ? 'pickm' : 'pick') + '" data-k="' + q.key + '" data-v="' + esc(v) + '" data-txt="' + esc(v.toLowerCase()) + '">' + esc(v) + '</button>'; }); h += '</div>';
        }
      } else {
        var parts = [];
        if (!A.kindKnown) parts.push('Kind: ' + A.kind.toLowerCase() + (A.kind === 'Experience' ? ', ' + A.sub.toLowerCase() : ''));
        if (A.kind === 'Experience' && reviewPicks().length) parts.push(A.sub + ': ' + reviewPicks().join(', ').toLowerCase());
        if (!A.exAsked) parts.push('Exchange: ' + A.ex.toLowerCase());
        if (timeAsked()) parts.push('Time: ' + A.time.toLowerCase());
        if (A.forceAnon) parts.push('This post stays private because of the reason you picked. It is not matched with anyone');
        h += '<p class="cw-pq">Here is your post</p>' + postCard(true) + '<p class="cw-statement">' + esc(parts.concat(['Matching starts as soon as you publish']).join('. ')) + '.</p>';
      }
      if (P.note) h += '<div class="cw-status info" style="margin-top:14px">' + esc(P.note) + '</div>';
      return h + '<div class="cw-foot" style="margin-top:44px;justify-content:flex-end">' + (s === N ? '<a class="cw-btn ghost form" data-cwa="savenow">' + (P.busy === 'draft' ? 'Saving...' : 'Save for now') + '</a>' : '') + '<a class="cw-btn solid form" data-cwa="next">' + (s === N ? (P.busy === true ? 'Saving...' : 'Publish and match') : 'Continue') + '</a></div>';
    }
    var flowBox = null;
    function draw() {
      if (P.screen === 'flow') {
        root.innerHTML = '<div class="cwadd-flow aof"></div>'; flowBox = root.firstChild; P.flow.mount(flowBox);
      } else root.innerHTML = postHtml();
      if (o.onChange) { try { o.onChange(P.screen); } catch (e) {} }
    }
    function save(draft) {
      var A = P.ans;
      P.busy = draft ? 'draft' : true; draw();
      var body = { dir: A.dir, kind: A.kind, sub: A.kind === 'Experience' ? A.sub : '', time: timeAsked() ? A.time : '', category: A.cat, answers: A.kind === 'Skill or service' ? svcAnswers() : answersJson(), ex: A.exAsked ? A.ways.join(', ') : A.ex, words: (A.words || []).join('|'), needs: String(A.needs + (A.detailOn === 'Yes' && String(A.detail || '').trim() ? ' ' + String(A.detail).trim() : '')).slice(0, 600), who: 'Anyone', stayAnonymous: A.stay.indexOf('anonymous') > -1 ? 'TRUE' : 'FALSE', groupId: o.group || '', draft: draft ? 'TRUE' : '' };
      Promise.resolve(o.send('saveOpportunity', body)).then(function (j) { P.busy = false; if (j && j.ok) { P.savedDraft = draft; P.screen = 'done'; P.note = ''; if (o.onSaved) { try { o.onSaved({ draft: draft }); } catch (e) {} } top(); } else P.note = 'That did not save. Please try again.'; draw(); }).catch(function () { P.busy = false; P.note = 'That did not save. Please try again.'; draw(); });
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cwa]'); if (!t || !root.contains(t) || P.busy) return;
      e.preventDefault();
      var a = t.getAttribute('data-cwa'), k = t.getAttribute('data-k'), v = t.getAttribute('data-v'), A = P.ans;
      if (a === 'pick') A[k] = v;
      else if (a === 'pickm') { var m = A[k] = (A[k] || []).slice(), mi = m.indexOf(v); if (mi > -1) m.splice(mi, 1); else m.push(v); }
      else if (a === 'mine') { if (o.onMine) o.onMine(); return; }
      else if (a === 'list') { if (o.onList) o.onList(); return; }
      else if (a === 'savenow') { save(true); return; }
      else if (a === 'next') {
        var ST = steps(), q = ST[P.step] || {};
        if (q.key === 'cat' && !A.cat) P.note = 'Pick a category.';
        else if (P.step < ST.length && q.opts && q.key !== 'ex' && (q.multi ? !(A[q.key] && A[q.key].length) : !A[q.key])) P.note = 'Pick one to continue.';
        else if (P.step < ST.length) { P.step++; P.note = ''; }
        else { save(false); return; }
      }
      draw();
    });
    root.addEventListener('input', function (e) {
      if (!e.target) return;
      if (e.target.id === 'cwa-dtl') { P.ans.detail = e.target.value; return; }
      if (e.target.id === 'cwa-catq') { var cq = String(e.target.value || '').toLowerCase().trim(); Array.prototype.forEach.call(root.querySelectorAll('.cw-fchip[data-k="cat"]'), function (b) { b.style.display = !cq || b.getAttribute('data-txt').indexOf(cq) > -1 ? '' : 'none'; }); }
    });
    root.addEventListener('change', function (e) { if (e.target && e.target.id === 'cwa-loc') { P.ans.local = !!e.target.checked; e.target.setAttribute('aria-checked', e.target.checked ? 'true' : 'false'); } });
    P.flow = flowOf(dk, function (r) {
      var A = P.ans; A.dir = r.dir; A.kind = r.kind; A.sub = r.sub; A.kindKnown = !!r.kind; A.subKnown = !!r.sub; A.sentence = r.sentence; A.needs = r.sentence; A.level = r.level; A.exAsked = !!r.ways; A.ways = r.ways || []; A.anyWay = !!r.anyWay; A.time = timeAsked() ? 'One-time' : '';
      A.cat = ''; A.catGuess = ''; guessCat((r.words || []).concat(r.cue ? [r.cue] : []));
      A.words = r.words || [];
      var t = ' ' + String(r.sentence || '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
      A.forceAnon = REASONS.some(function (w) { return t.indexOf(' ' + w + ' ') > -1; });
      A.stay = A.forceAnon ? 'Keep me anonymous until we both say yes' : 'Show my name to people who know me';
      P.screen = 'post'; P.step = 0; P.note = ''; draw(); top();
    }, function () { if (o.onExit) o.onExit(); });
    loadCats();
    draw();
    return {
      back: function () {
        if (P.busy) return;
        if (P.screen === 'flow') P.flow.goBack();
        else if (P.screen === 'done') { if (o.onExit) o.onExit(); }
        else if (P.step === 0) { P.screen = 'flow'; P.note = ''; draw(); top(); }
        else { P.step--; P.note = ''; draw(); }
      },
      screen: function () { return P.screen; }
    };
  }
  function fromHash(h) { var m = String(h == null ? location.hash : h).match(/^#(offer|seek)$/); return m ? { dir: m[1] } : null; }
  window.CWAdd = { start: start, fromHash: fromHash };
})();
