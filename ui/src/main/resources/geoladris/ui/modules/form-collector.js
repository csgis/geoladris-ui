define([ "message-bus" ], function(bus) {
  bus.listen("ui-form-collector:extend", function(e, msg) {
    function updateButton() {
      var enabled = true;
      msg.requiredDivs.forEach(function(id) {
        var input = document.getElementById(id);
        var tag = input.tagName.toLowerCase();
        if (tag == "input" && input.type == "file") {
          var parent = input.parentNode;
          var placeholder = parent.getElementsByClassName("ui-file-input-placeholder")[0];
          enabled = enabled && !!placeholder.text();
        } else {
          enabled = enabled && !!input.value;
        }
      });

      if (enabled) {
        msg.divs.forEach(function(id) {
          var input = document.getElementById(id);
          if (input && input.getAttribute("geoladris-type") == "date") {
            enabled = enabled && !!Date.parse(input.value);
          }
        });
      }

      bus.send("ui-button:" + msg.button + ":enable", enabled);
    }

    msg.divs.forEach(function(id) {
      var input = document.getElementById(id);
      if (input && input.getAttribute("geoladris-type") == "date") {
        input.addEventListener("input", updateButton);
      }
    });

    if (msg.requiredDivs) {
      msg.requiredDivs.forEach(function(id) {
        var input = document.getElementById(id);
        var tag = input.tagName.toLowerCase();
        // Check type != date so we don't add listeners twice (see
        // above)
        if (input && input.getAttribute("geoladris-type") != "date") {
          input.addEventListener("input", updateButton);
        } else if (tag == "select") {
          input.addEventListener("change", updateButton);
        }
      });

      updateButton();
    }

    var button = document.getElementById(msg.button);
    button.addEventListener("click", function() {
      if (!button.classList.contains("button-enabled")) {
        return;
      }

      var rawMessage = {};
      var i;
      for (i = 0; i < msg.divs.length; i++) {
        var fieldName = msg.divs[i];
        bus.send(fieldName + "-field-value-fill", rawMessage);
      }

      var translatedMessage;
      if (msg.names) {
        translatedMessage = {};
        for (i = 0; i < msg.divs.length; i++) {
          translatedMessage[msg.names[i]] = rawMessage[msg.divs[i]];
        }
      } else {
        translatedMessage = rawMessage;
      }
      bus.send(msg.clickEventName, translatedMessage);
    });
  });
});