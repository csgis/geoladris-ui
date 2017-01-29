define([ "jquery", "message-bus", "./commons", "pikaday", "typeahead" ], function($, bus, commons, Pikaday) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var input = commons.getOrCreateElem("input", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-choice"
    });
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
      }
    });

    var options = props.options;

    function enableAutocomplete() {
      $(input).typeahead({
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
          options.forEach(function(option) {
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
        input.addEventListener("focus", function() {
          // This is a bit obscure, but the only way I found to do it
          var query = (input.value || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
          var data = $(input).data("ttTypeahead");
          data.dropdown.update(query);
          data.dropdown.open();
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

    var options = props.options;
    if (options && input.type == "text") {
      enableAutocomplete();
    }

    bus.listen("ui-input:" + props.id + ":set-values", function(e, values) {
      var enable = options === undefined;
      options = values;
      if (enable && input.type == "text") {
        enableAutocomplete();
      }
    });

    return input;
  }
});
