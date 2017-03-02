define([ "message-bus", "./commons" ], function(bus, commons) {
  return function(props) {
    var containerProps = JSON.parse(JSON.stringify(props));
    containerProps.html = undefined;
    var button = commons.getOrCreateElem("div", containerProps);
    if (props.tooltip) {
      button.title = props.tooltip;
    }
    button.classList.add("button-enabled");

    var iconDiv = commons.getOrCreateElem("div", {
      parent : button,
      html : props.html || props.text,
      css : "button-content"
    });

    if (props.image) {
      iconDiv.style["background-image"] = "url(" + props.image + ")";
    }

    if (props.clickEventName) {
      button.addEventListener("click", function(e) {
        if (button.classList.contains("button-enabled")) {
          e.stopPropagation();
          bus.send(props.clickEventName, props.clickEventMessage);
        }
      });
    } else if (props.clickEventCallback) {
      button.addEventListener("click", function(e) {
        if (button.classList.contains("button-enabled")) {
          e.stopPropagation();
          props.clickEventCallback(button);
        }
      });
    }

    function enable(enabled) {
      if (enabled !== undefined && !enabled) {
        button.classList.remove("button-enabled");
        button.classList.add("button-disabled");
      } else {
        button.classList.add("button-enabled");
        button.classList.remove("button-disabled");
      }
    }

    function activate(active) {
      if (active !== undefined && !active) {
        button.classList.remove("button-active");
      } else {
        button.classList.add("button-active");
      }
    }

    function toggle() {
      if (button.classList.contains("button-active")) {
        button.classList.remove("button-active");
      } else {
        button.classList.add("button-active");
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
