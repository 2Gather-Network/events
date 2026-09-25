(function(){
  var SECTION_OF_VIEW = { members: 'members', events: 'events', intro: 'introductions', messages: 'messages', invites: 'invites' };
  window.cwGroupAddress = function(slug, section){
    try {
      slug = String(slug || '').split(',')[0].trim();
      if (!slug || !window.history || !history.replaceState) return;
      var q = new URLSearchParams(location.search);
      ['id', 'groupId', 'group', 'view'].forEach(function(k){ q.delete(k); });
      var rest = q.toString();
      var path = '/group/' + encodeURIComponent(slug) + (section ? '/' + section : '');
      if (location.pathname === path && !location.search.match(/[?&](id|groupId|group|view)=/)) return;
      history.replaceState(history.state, '', path + (rest ? '?' + rest : '') + location.hash);
    } catch (e) {}
  };
  window.cwGroupSectionOfView = function(v){ return SECTION_OF_VIEW[String(v || '')] || ''; };
  window.cwGroupLink = function(slug, groupId, section){
    slug = String(slug || '').split(',')[0].trim();
    if (slug) return 'https://2gather.network/group/' + encodeURIComponent(slug) + (section ? '/' + section : '');
    return 'https://2gather.network/group/?id=' + encodeURIComponent(groupId || '');
  };
})();
