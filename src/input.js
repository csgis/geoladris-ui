define([ "jquery", "message-bus", "./commons", "pikaday", "typeahead" ], function($, bus, commons, Pikaday) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var input = commons.getOrCreateElem("input", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-choice"
    });

    commons.linkDisplay(input, container);

    input.type = props.type || "text";
    if (props.placeholder) {
      input.placeholder = props.placeholder;
    }

    var placeholder;
    if (props.type == "number") {
      input.step = "any";
    } else if (props.type == "date") {
      new Pikaday({
        field : input,
        format : "YYYY-MM-DD"
      });
      input.type = "text";
      input.setAttribute("geoladris-type", "date");
    } else if (props.type == "file") {
      placeholder = commons.getOrCreateElem("div", {
        id : props.id + "-placeholder",
        parent : container,
        css : (props.css || "") + " ui-file-input-placeholder"
      });
    }

    bus.listen(props.id + "-field-value-fill", function(e, message) {
      if (input.type == "file") {
        message[props.id] = input.files[0];
      } else if (input.type == "number") {
        message[props.id] = parseFloat(input.value);
      } else if (input.getAttribute("geoladris-type") == "date") {
        message[props.id] = new Date(input.value).toISOString();
      } else {
        message[props.id] = input.value;
      }
    });

    input.addEventListener("input", function() {
      var valid = !!Date.parse(input.value);
      if (input.getAttribute("geoladris-type") == "date") {
        input.setCustomValidity(valid ? "" : "Invalid date.");
      } else if (input.type == "file") {
        placeholder.innerHTML = input.files[0].name;
      }
    });

    if (props.autocomplete && input.type == "text") {
      props.minQueryLength = props.minQueryLength || 0;
      $(input).typeahead({
        highlight : true,
        minLength : props.minQueryLength,
        autoselect : true
      }, {
        minLength : props.minQueryLength,
        source : function(q, cb) {
          cb(props.autocomplete(q));
        },
        templates : {
          suggestion : function(data) {
            return "<p class='" + (data.type || "") + "'>" + data.value + "</p>";
          }
        }
      });

      if (props.showOnFocus) {
        // Show dropdown on input focus
        input.addEventListener("focus", function() {
          if (input.value.length >= props.minQueryLength) {
            // This is a bit obscure, but the only way I found to do it
            var query = (input.value || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
            var data = $(input).data("ttTypeahead");
            data.dropdown.update(query);
            data.dropdown.open();
          }
        });
      }

      input.addEventListener("keypress", function(event) {
        if (event.which == 13) {
          input.dispatchEvent(new Event("change"));
        }
      });

      $(input).on('typeahead:selected', function(event, selection) {
        input.dispatchEvent(new Event("change"));
      });
    }

    return input;
  }
});
