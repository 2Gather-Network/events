(function () {
  var OLD = {
    "Social Events & Gatherings": ["Community & Culture"],
    "Events & Gatherings": ["Community & Culture"],
    "Community & Civic": ["Community & Culture"],
    "Physical Wellbeing": ["Movement", "Medical"],
    "Mental Wellbeing": ["Rest & Recovery", "Medical", "Belief & Meaning"],
    "Arts & Culture": ["Arts & Expression", "Community & Culture"],
    "Self-Expression & Beauty": ["Arts & Expression", "Personal Care"],
    "Recreation & Hobbies": ["Play", "Outdoors", "Movement"],
    "Family Wellbeing": ["Home Life", "Rest & Recovery"],
    "Business & Finance": ["Professional", "Finance"],
    "Nature & Outdoors": ["Outdoors"],
    "Technology & Communications": ["Technology", "Communications"],
    "Pets & Animal Care": ["Animals"],
    "Home & Construction": ["Home Life", "Building & Repurposing"],
    "Mechanical & Manufacturing": ["Building & Repurposing", "Technology"]
  };
  var cache = null;
  window.cwEventCats = {
    load: function (base) {
      if (!cache) {
        cache = fetch(base + "?action=getReferenceData").then(function (r) { return r.json(); }).then(function (d) {
          return (d.topicCategories || []).filter(function (c) { return c && c.label; })
            .map(function (c) { return { label: c.label, emoji: c.emoji || "" }; });
        }).catch(function () { cache = null; return []; });
      }
      return cache;
    },
    labels: function (val, list) {
      val = String(val || "").trim();
      if (!val) return [];
      var any = list && list.length;
      var has = function (l) { return !any || list.some(function (c) { return c.label === l; }); };
      if (OLD[val] && !(any && has(val))) return OLD[val].filter(has);
      return has(val) ? [val] : [];
    },
    map: function (arr, list) {
      var out = [];
      (arr || []).forEach(function (v) {
        window.cwEventCats.labels(v, list).forEach(function (l) { if (out.indexOf(l) < 0) out.push(l); });
      });
      return out;
    }
  };
})();
