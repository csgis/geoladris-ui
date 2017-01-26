define([ "jquery", "message-bus", "./commons", "module" ], function($, bus, commons, module) {
  var ATTR_DIRECTION = "gb-ui-sliding-direction";
  var HANDLE_CLASS = "ui-sliding-div-handle";

  var config = module.config();

  if (!config.duration) {
    config.duration = 0;
  }

  function expand(id) {
    var div = $("#" + id);
    var direction = div.attr(ATTR_DIRECTION);
    var handle = div.siblings("." + HANDLE_CLASS);

    var opts = {};
    if (direction == "horizontal" || direction == "both") {
      opts.width = "show";
    }
    if (direction == "vertical" || direction == "both") {
      opts.height = "show";
    }

    div.animate(opts, config.duration);
    handle.text("-");
  }

  function collapse(id) {
    var div = $("#" + id);
    var direction = div.attr(ATTR_DIRECTION);
    var handle = div.siblings("." + HANDLE_CLASS);

    var opts = {};
    if (direction == "horizontal" || direction == "both") {
      opts.width = "hide";
    }
    if (direction == "vertical" || direction == "both") {
      opts.height = "hide";
    }

    div.animate(opts, config.duration);
    handle.text("+");
  }

  function toggle(id) {
    var div = $("#" + id);
    var handle = div.siblings("." + HANDLE_CLASS);

    if (handle.text() == "+") {
      expand(id);
    } else {
      collapse(id);
    }
  }

  bus.listen("ui-sliding-div:collapse", function(e, id) {
    collapse(id);
  });
  bus.listen("ui-sliding-div:expand", function(e, id) {
    expand(id);
  });
  bus.listen("ui-sliding-div:toggle", function(e, id) {
    toggle(id);
  });

  return function(msg) {
    var direction = msg.direction || "vertical";
    var handlePosition = msg.handlePosition || "bottom";

    // Container
    var containerId = msg.id + "-container";
    var container = commons.getOrCreateElem("div", $.extend({}, msg, {
      id : containerId
    }));
    container.addClass("ui-sliding-div-container");

    // Handle div
    var handle = $("<div/>");
    handle.addClass(HANDLE_CLASS);
    handle.addClass(handlePosition);
    handle.text(msg.visible ? "-" : "+");
    handle.click(function() {
      toggle(msg.id);
    });

    if (handlePosition == "bottom-left" || handlePosition == "top" || handlePosition == "top-left" || handlePosition == "left") {
      container.append(handle);
    }

    // Content div
    var div = commons.getOrCreateElem("div", $.extend({}, msg, {
      parent : containerId
    }));
    div.addClass("ui-sliding-div-content");
    div.attr(ATTR_DIRECTION, direction);

    if (!msg.visible) {
      div.hide();
    }

    if (handlePosition == "bottom" || handlePosition == "bottom-right" || handlePosition == "right" || handlePosition == "top-right") {
      container.append(handle);
    }

    if (handlePosition != "top" && handlePosition != "bottom") {
      div.css("float", "left");
    }

    return container;
  }
});
