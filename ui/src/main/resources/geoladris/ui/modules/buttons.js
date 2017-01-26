define([ "jquery", "message-bus", "./commons" ], function($, bus, commons) {
  return function(msg) {
    var button = commons.getOrCreateElem("div", msg);

    var iconDiv = $("<div/>");
    if (msg.image) {
      iconDiv.css("background-image", "url(" + msg.image + ")");
    }
    if (msg.text) {
      iconDiv.text(msg.text);
    }
    iconDiv.addClass("button-content");
    button.append(iconDiv);

    if (msg.tooltip) {
      button.attr("title", msg.tooltip);
    }

    button.addClass("button-enabled");

    if (msg.sendEventName) {
      button.click(function() {
        if ($("#" + msg.id).hasClass("button-enabled")) {
          bus.send(msg.sendEventName, msg.sendEventMessage);
        }
      });
    }

    function enable(enabled) {
      if (enabled !== undefined && !enabled) {
        button.addClass("button-disabled");
        button.removeClass("button-enabled");
      } else {
        button.addClass("button-enabled");
        button.removeClass("button-disabled");
      }
    }

    function activate(active) {
      if (active !== undefined && !active) {
        button.removeClass("button-active");
      } else {
        button.addClass("button-active");
      }
    }

    function toggle() {
      if (button.hasClass("button-active")) {
        button.removeClass("button-active");
      } else {
        button.addClass("button-active");
      }
    }

    bus.listen("ui-button:" + msg.id + ":enable", function(e, enabled) {
      enable(enabled);
    });
    bus.listen("ui-button:" + msg.id + ":activate", function(e, active) {
      activate(active);
    });

    bus.listen("ui-button:" + msg.id + ":toggle", function() {
      toggle();
    });

    bus.listen("ui-button:" + msg.id + ":link-active", function(e, linkedDiv) {
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
