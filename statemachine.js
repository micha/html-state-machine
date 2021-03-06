var head      = document.getElementsByTagName("head")[0];
var script    = document.createElement("script");
script.type   = "text/javascript";
script.src    = "http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js";
script.onload = init;
head.appendChild(script);

function init() {
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
        "<tt><a href='javascript:void(0)' state='"+state+"'>["+state+"]</a></tt>"
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
      var moving=0,lastY=Infinity;
      if (window.location.search == '?controls') {
        $("head,body").empty();
        $("head").append(
          "<style type='text/css'>"+
            "body { font-weight:bold;font-family:sans-serif;font-size:12px;"+
            "color:#222; }"+
            "tt > a { text-decoration:none;font-weight:bold;"+
            "color:#222;margin-right:.75em; }"+
            "tt > a:hover { color:red; }"+
            "#anykey { float:right; }"+
          "</style>"
        );
        $("body").append("<tt>Available states:&nbsp;<tt>");
      } else {
        $("body")
          .prepend(
            $("<iframe/>")
              .attr({
                id:controlsId,
                scrolling:'no',
                src:window.location+"?controls"
              })
              .css({
                border:               'none',
                width:                '100%',
                position:             'absolute',
                top:                  '0',
                left:                 '0',
                overflow:             'hidden',
                'background-color':   'orange',
                height:               '30px'
              }))
          .mousemove(function(ev) {
            if (ev.pageY < 60 && moving>=0)
              moving=0;
            else if (ev.pageY > 60 && moving < 0)
              moving=0;
            lastY = ev.pageY;
          });
        $("#"+controlsId)
          .hover(function() { moving=-1 }, function() { moving=0 })
          .load(function() {
            setState(0);
            setTimeout(function() {
              setInterval(function() {
                if (moving<10 && $("#"+controlsId+":hidden").size())
                  $("#"+controlsId).slideDown('fast','linear');
                else if (moving>10 && $("#"+controlsId+":visible").size()
                  && lastY > 60)
                  $("#"+controlsId).slideUp('fast','linear');
                if (moving>=0 && moving<=10)
                  moving++;
              }, 25);
            }, 2500);
          });
      }
    });

  })(jQuery);
}
