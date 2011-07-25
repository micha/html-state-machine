(function($) {

  var seen, controlsId="state"+Date().toString().replace(/[ \:\-\(\)]/g, '');

  function accessibleStates(state) {
    return $("[state]:hidden")
      .not("[state]:hidden [state]:hidden")
      .add("[state][add_class]:visible")
      .add("[state][remove_class]:visible")
      .filter(function() {
        var jq = $(this);
        var st = jq.attr('state');
        return ($("[state]:hidden [state='"+st+"']:hidden").size() == 0);
      });
  }

  function mkButton(state) {
    return $(
      "<tt><a href='javascript:void(0)' state='"+state+"'>"+state+"</a></tt>"
    ).click(function() { setState(state) });
  }

  function mkButtons(state) {
    $("#"+controlsId).contents().find("a").remove();
    $("#"+controlsId).contents().find("body").append(mkButton(0));
    accessibleStates(state)
      .sort(function(a,b) {
        return parseInt($(a).attr("state")) > parseInt($(b).attr("state"));
      })
      .each(function() {
        var st = $(this).attr("state");
        if (! $("#"+controlsId).contents().find("[state='"+st+"']").size() 
          && st != state && ! seen[st]) {
          console.log("got here for state '"+st+"'");
          $("#"+controlsId).contents().find("body").append(mkButton(st));
        }
      });
  }

  function setState(state) {
    if (state == 0) {
      seen = {};
      $("[state]")
        .not("[state][add_class],[state][remove_class]")
        .hide();
      $("[state][add_class],[state][remove_class]").each(function() {
        var jq = $(this);
        var ac = jq.attr("add_class");
        var rc = jq.attr("remove_class");
        if (ac) jq.removeClass(ac);
        if (rc) jq.addClass(rc);
      });
    } else {
      $("[state='"+state+"']")
        .show()
        .each(function() {
          var jq = $(this);
          var ds = jq.attr("disable_state");
          var ac = jq.attr("add_class");
          var rc = jq.attr("remove_class");
          if (ac) jq.addClass(ac);
          if (rc) jq.removeClass(rc);
          if (ds) seen[ds] = true;
        })
        .find("[state]")
        .hide();
    }
    mkButtons(state);
    seen[state] = true;
  }

  $(function() {
    if (window.location.search == '?controls') {
      $("body").empty();
      $("body").append("<tt>Available states:&nbsp;<tt><a href='javascript:void(0)'>0</a>");
      $("head").append(
        "<style type='text/css'>"+
          "body { font-family:sans-serif;font-size:15px }"+
          "tt > a { text-decoration:none;color:darkblue;margin-right:.75em;margin-left:.75em; }"+
          "tt > a:hover { color:red; }"+
        "</style>"
      );
    } else {
      $("body").keyup(function() { $("#"+controlsId).toggle() });
      $("body").prepend("<iframe id='"+controlsId+"' scrolling='no' style='border:none;width:100%;position:absolute;top:0;left:0;overflow:hidden;background-color:orange;height:30px;' src='"+window.location+"?controls'/>");
      $("#"+controlsId).load(function() {
        setState(0);
      });
    }
  });

})(jQuery);
