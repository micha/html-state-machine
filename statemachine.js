(function() {

  var seen, controlsClass="state"+Date().toString().replace(/[ \:\-\(\)]/g, '');

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
      "<button state='"+state+"'>State "+state+"</button>"
    ).click(function() {
      setState(state);
    });
  }

  function mkButtons(state) {
    $('.'+controlsClass)
      .empty()
      .append("<button style='background-color:transparent;border:0px'>Available states:&nbsp;</button>")
      .append(mkButton(0));
    accessibleStates(state)
      .sort(function(a,b) {
        return parseInt($(a).attr("state")) > parseInt($(b).attr("state"));
      })
      .each(function() {
        var st = $(this).attr("state");
        if (! $('.'+controlsClass).find("[state='"+st+"']").size() 
          && st != state && ! seen[st])
          $('.'+controlsClass).append(mkButton(st));
      });
    $("div").eq(0).height($('.'+controlsClass).height());
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
    $("body").prepend($(
      "<div/>"
    )).append($(
      "<div style='position:fixed;top:0;left:0;background:orange;width:100%' "
          +"class='"+controlsClass+"'/>"
    ));
    setState(0);
  });

})();
