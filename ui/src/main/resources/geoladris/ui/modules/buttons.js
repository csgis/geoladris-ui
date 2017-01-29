define([ "message-bus", "./commons" ], function(bus, commons) {
  return function(props) {
    var button = commons.getOrCreateElem("div", props);
    if (props.tooltip) {
      button.title = props.tooltip;
    }
    button.className += " button-enabled";

    var iconDiv = commons.getOrCreateElem("div", {
      parent : button,
      html : props.text,
      css : "button-content"
    });

    if (props.image) {
      iconDiv.style["background-image"] = "url(" + props.image + ")";
    }

    if (props.clickEventName) {
      button.addEventListener("click", function() {
        if (button.className.indexOf("button-enabled") >= 0) {
          bus.send(props.clickEventName, props.clickEventMessage);
        }
      });
    } else if (props.clickEventCallback) {
      button.addEventListener("click", function() {
        if (button.className.indexOf("button-enabled") >= 0) {
          props.clickEventCallback(button);
        }
      });
    }

    function enable(enabled) {
      if (enabled !== undefined && !enabled) {
        button.className = button.className.replace("button-enabled", "button-disabled");
      } else {
        button.className = button.className.replace("button-disabled", "button-enabled");
      }
    }

    function activate(active) {
      if (active !== undefined && !active) {
        button.className = button.className.replace("button-active", "");
      } else {
        button.className += " button-active";
      }
    }

    function toggle() {
      if (button.className.indexOf("button-active") >= 0) {
        button.className = button.className.replace("button-active", "");
      } else {
        button.className += " button-active";
      }
    }

    bus.listen("ui-button:" + props.id + ":enable", function(e, enabled) {
      enable(enabled);
    });
    bus.listen("ui-button:" + props.id + ":activate", function(e, active) {
      activate(active);
    });

    bus.listen("ui-button:" + props.id + ":toggle", function() {
      toggle();
    });

    bus.listen("ui-button:" + props.id + ":link-active", function(e, linkedDiv) {
      bus.listen("ui-show", function(e, id) {
        if (linkedDiv == id) {
          activate(true);
        }
      });
      bus.listen("ui-hide", function(e, id) {
        if (linkedDiv == id) {
          activate(false);
        }
      });
      bus.listen("ui-toggle", function(e, id) {
        if (linkedDiv == id) {
          toggle();
        }
      });
    });

    return button;
  }
});
