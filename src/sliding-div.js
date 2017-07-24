define([ "message-bus", "./commons", "module" ], function(bus, commons, module) {
  var ATTR_DIRECTION = "gb-ui-sliding-direction";
  var HANDLE_CLASS = "ui-sliding-div-handle";

  var config = module.config();

  if (!config.duration) {
    config.duration = 0;
  }

  function expand(id) {
    var div = document.getElementById(id);
    var direction = div.getAttribute(ATTR_DIRECTION);
    var handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

    var opts = {};
    if (direction == "horizontal" || direction == "both") {
      opts.width = "show";
    }
    if (direction == "vertical" || direction == "both") {
      opts.height = "show";
    }

    $(div).animate(opts, config.duration);
    handle.innerHTML = "-";
  }

  function collapse(id) {
    var div = document.getElementById(id);
    var direction = div.getAttribute(ATTR_DIRECTION);
    var handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

    var opts = {};
    if (direction == "horizontal" || direction == "both") {
      opts.width = "hide";
    }
    if (direction == "vertical" || direction == "both") {
      opts.height = "hide";
    }

    $(div).animate(opts, config.duration);
    handle.innerHTML = "+";
  }

  function toggle(id) {
    var div = document.getElementById(id);
    var handle = div.parentNode.getElementsByClassName(HANDLE_CLASS)[0];

    if (handle.innerHTML == "+") {
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

  return function(props) {
    var direction = props.direction || "vertical";
    var handlePosition = props.handlePosition || "bottom";

    // Container
    var containerId = props.id + "-container";
    var container = commons.getOrCreateElem("div", {
      id : containerId,
      parent : props.parent,
      css : "ui-sliding-div-container"
    });

    // Handle div
    var handle = commons.getOrCreateElem("div", {
      css : HANDLE_CLASS + " " + handlePosition,
      html : props.visible ? "-" : "+"
    });
    handle.addEventListener("click", function() {
      toggle(props.id);
    });

    if (handlePosition == "bottom-left" || handlePosition == "top" || handlePosition == "top-left" || handlePosition == "left") {
      container.appendChild(handle);
    }

    // Content div
    var div = commons.getOrCreateElem("div", {
      id : props.id,
      parent : containerId,
      css : "ui-sliding-div-content"
    });
    div.setAttribute(ATTR_DIRECTION, direction);

    if (!props.visible) {
      div.style["display"] = "none";
    }

    if (handlePosition == "bottom" || handlePosition == "bottom-right" || handlePosition == "right" || handlePosition == "top-right") {
      container.appendChild(handle);
    }

    if (handlePosition != "top" && handlePosition != "bottom") {
      div.style["float"] = "left";
    }

    return div;
  }
});
