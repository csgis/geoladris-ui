define([ "message-bus", "module", "./commons" ], function(bus, module, commons) {
  var ids = {};

  var config = module.config();
  if (!config.originalMessage) {
    config.originalMessage = "Loading";
  }
  var message;
  var intervalId;

  // Create divs
  var loadingShade = commons.getOrCreateElem("div", {
    id : "wait-mask",
    parent : document.body
  });
  var loadingMsg = commons.getOrCreateElem("div", {
    id : "loading-msg",
    parent : loadingShade
  });

  // Hide divs by default
  loadingShade.style.display = "none";

  function updateMessage() {
    var keys = Object.keys(ids);
    if (keys.length == 1) {
      message = keys[0];
    } else {
      message = config.originalMessage;
    }
    loadingMsg.innerHTML = message + "...";
  }

  bus.listen("ui-loading:start", function(e, msg) {
    if (ids[msg]) {
      ids[msg]++;
    } else {
      ids[msg] = 1;
    }

    updateMessage();
    loadingShade.style.display = "";
    loadingMsg.style["width"] = loadingMsg.offsetWidth + "px";

    if (!intervalId) {
      // Add a dot to the message each 0.5s, up to 3 dots
      intervalId = setInterval(function() {
        var divText = loadingMsg.innerHTML;
        if (divText.length < message.length + 3) {
          loadingMsg.innerHTML = divText + ".";
        } else {
          loadingMsg.innerHTML = message;
        }
      }, 500);
    }
  });

  bus.listen("ui-loading:end", function(e, msg) {
    if (!ids[msg] || ids[msg] <= 0) {
      console.warn("Trying to finish non-started loading: " + msg);
      return;
    }

    ids[msg]--;
    if (!ids[msg]) {
      delete ids[msg];
    }

    var anyoneLoading = false;
    Object.keys(ids).forEach(function(key) {
      if (ids[key]) {
        anyoneLoading = true;
      }
    });

    if (!anyoneLoading) {
      loadingShade.style.display = "none";
      clearInterval(intervalId);
      intervalId = null;
    } else {
      updateMessage();
    }
  });
});