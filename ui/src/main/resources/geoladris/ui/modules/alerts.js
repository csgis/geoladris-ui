define([ "message-bus", "./commons", "module" ], function(bus, commons, module) {
  var config = module.config();

  if (!config.timeout) {
    config.timeout = 5;
  }

  var wrapper = commons.getOrCreateElem("div", {
    id : "ui-alerts-wrapper",
    parent : config.parentDiv || "center"
  });
  var container = commons.getOrCreateElem("div", {
    id : "ui-alerts-container",
    parent : wrapper
  });

  bus.listen("ui-alert", function(e, msg) {
    var div = commons.getOrCreateElem("div", {
      parent : container,
      html : msg.message,
      css : "ui-alert ui-alert-" + msg.severity
    });

    var close = commons.getOrCreateElem("div", {
      parent : div,
      css : "ui-alerts-close"
    });
    close.addEventListener("click", function() {
      container.removeChild(div);
    });

    setTimeout(function() {
      container.removeChild(div);
    }, config.timeout * 1000);
  });
});
