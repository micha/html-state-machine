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
    $('.'+controlsClass).empty();
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
      $("body").prepend($(
        "<div/>"
      )).append($(
        "<div style='position:fixed;top:0;left:0;background:orange;width:100%' "
            +"class='"+controlsClass+"'/>"
      ));
      $("[state]")
        .not("[state][add_class],[state][remove_class]")
        .hide();
    } else {
      accessibleStates(state).filter("[state='"+state+"']")
        .show()
        .each(function() {
          var jq = $(this);
          var ds = jq.attr("disable_state");
          jq.addClass(jq.attr("add_class"));
          jq.removeClass(jq.attr("remove_class"));
          if (ds)
            seen[ds] = true;
        })
        .find("[state]")
        .hide();
    }
    mkButtons(state);
    seen[state] = true;
  }

  $(function() {
    setState(0);
  });

})();
