define([ "jquery", "message-bus", "./commons", "pikaday.jquery", "typeahead" ], function($, bus, commons) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var input = commons.getOrCreateElem("input", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-choice"
    });
    input.attr("type", props.type || "text");
    input.attr("placeholder", props.placeholder);

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

    var options = props.options;

    function enableAutocomplete() {
      input.typeahead({
        hint : props.hint,
        highlight : true,
        minLength : props.minQueryLength,
        autoselect : true
      }, {
        source : function(q, cb) {
          if (!options) {
            cb([]);
            return;
          }

          var matches = [];
          var pattern = props.searchMode == "startsWith" ? "^" + q : q;
          var regex = new RegExp(pattern, 'i');
          $.each(options, function(i, option) {
            if (regex.test(option)) {
              matches.push({
                value : option
              });
            }
          });

          if (props.maxResults > 0) {
            matches = matches.slice(0, props.maxResults);
          }
          cb(matches);
        }
      });

      if (props.showOnFocus || props.minQueryLength === 0) {
        // Show dropdown on input focus
        input.focus(function() {
          // This is a bit obscure, but the only way I found to do it
          var query = (input.val() || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
          var data = input.data("ttTypeahead");
          data.dropdown.update(query);
          data.dropdown.open();
        });
      }

      input.keypress(function(event) {
        if (event.which == 13) {
          input[0].dispatchEvent(new Event("change"));
        }
      });

      input.on('typeahead:selected', function(event, selection) {
        input[0].dispatchEvent(new Event("change"));
      });
    }

    var options = props.options;
    if (options && input.attr("type") == "text") {
      enableAutocomplete();
    }

    bus.listen("ui-input:" + props.id + ":set-values", function(e, values) {
      var enable = options === undefined;
      options = values;
      if (enable && input.attr("type") == "text") {
        enableAutocomplete();
      }
    });

    return input;
  }
});
