define([ "message-bus" ], function(bus) {
  var divLists = [];

  bus.listen("ui-show", function(e, id) {
    for (var i = 0; i < divLists.length; i++) {
      var j;
      var divList = divLists[i];
      var showIndex = -1;
      for (j = 0; j < divList.length; j++) {
        if (divList[j] == id) {
          showIndex = j;
          break;
        }
      }

      if (showIndex != -1) {
        for (j = 0; j < divList.length; j++) {
          if (divList[j] != showIndex) {
            bus.send("ui-hide", divList[j]);
          }
        }
      }
    }
  });

  return function(msg) {
    divLists.push(msg.divs);
    for (var i = 1; i < msg.divs.length; i++) {
      bus.send("ui-hide", msg.divs[i]);
    }
  }
});