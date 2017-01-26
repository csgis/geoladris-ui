define([ "jquery", "message-bus", "./ui-commons", "pikaday.jquery" ], function($, bus, commons) {
  return function(msg) {
    var div = commons.getOrCreateElem("div", msg);
    div.addClass("ui-input-field-container");

    var label = $("<label/>").addClass("ui-input-field-label");
    div.append(label);
    if (msg.label) {
      label.text(msg.label);
    } else {
      label.hide();
    }

    if (!msg.type) {
      msg.type = "text";
    }

    var input = $("<input/>").attr("type", msg.type);
    div.append(input);

    var placeholder;
    if (msg.type == "number") {
      input.attr("step", "any");
    } else if (msg.type == "date") {
      input.pikaday({
        format : "YYYY-MM-DD"
      });
      input.attr("type", "text");
      input.attr("geoladris-type", "date");
    }

    bus.listen(msg.id + "-field-value-fill", function(e, message) {
      if (input.attr("type") == "file") {
        message[msg.id] = input[0].files[0];
      } else if (input.attr("type") == "number") {
        message[msg.id] = parseFloat(input.val());
      } else if (input.attr("geoladris-type") == "date") {
        message[msg.id] = new Date(input.val()).toISOString();
      } else {
        message[msg.id] = input.val();
      }
    });

    input.on("change paste keyup", function() {
      var valid = !!Date.parse(input.val());
      if (input.attr("geoladris-type") == "date") {
        input[0].setCustomValidity(valid ? "" : "Invalid date.");
      }
    });

    bus.listen("ui-input-field:" + msg.id + ":set-label", function(e, labelText) {
      if (labelText) {
        label.text(labelText);
        label.show();
      } else {
        label.hide();
      }
    });

    return input;
  }
});
