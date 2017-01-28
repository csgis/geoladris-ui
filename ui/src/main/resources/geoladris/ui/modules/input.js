define([ "jquery", "message-bus", "./commons", "pikaday.jquery" ], function($, bus, commons) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var input = commons.getOrCreateElem("input", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-choice"
    });
    input.attr("type", props.type || "text");

    var placeholder;
    if (props.type == "number") {
      input.attr("step", "any");
    } else if (props.type == "date") {
      input.pikaday({
        format : "YYYY-MM-DD"
      });
      input.attr("type", "text");
      input.attr("geoladris-type", "date");
    }

    bus.listen(props.id + "-field-value-fill", function(e, message) {
      if (input.attr("type") == "file") {
        message[props.id] = input[0].files[0];
      } else if (input.attr("type") == "number") {
        message[props.id] = parseFloat(input.val());
      } else if (input.attr("geoladris-type") == "date") {
        message[props.id] = new Date(input.val()).toISOString();
      } else {
        message[props.id] = input.val();
      }
    });

    input.on("change paste keyup", function() {
      var valid = !!Date.parse(input.val());
      if (input.attr("geoladris-type") == "date") {
        input[0].setCustomValidity(valid ? "" : "Invalid date.");
      }
    });

    return input;
  }
});
