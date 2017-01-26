define([ "jquery", "message-bus", "./ui-commons", "typeahead" ], function($, bus, commons) {
  return function(msg) {
    var div = commons.getOrCreateElem("div", msg);

    var label = $("<label/>").addClass("autocomplete-label");
    div.append(label);
    if (msg.label) {
      label.text(msg.label);
    } else {
      label.hide();
    }

    var input = $("<input/>");
    input.attr("type", "text");
    input.attr("placeholder", msg.placeholder);

    var icon = $("<div/>").addClass("autocomplete-icon");
    var options = msg.options;

    div.append(input);
    div.append(icon);

    div.addClass("autocomplete");
    input.addClass("typeahead");
    input.addClass("autocomplete-input");
    icon.addClass("autocomplete-icon");

    var inputTypeahead = input.typeahead({
      hint : msg.hint,
      highlight : true,
      minLength : msg.minQueryLength,
      autoselect : true
    }, {
      source : function(q, cb) {
        if (!options) {
          cb([]);
          return;
        }

        var matches = [];
        var pattern = msg.searchMode == "startsWith" ? "^" + q : q;
        var regex = new RegExp(pattern, 'i');
        $.each(options, function(i, option) {
          if (regex.test(option)) {
            matches.push({
              value : option
            });
          }
        });

        if (msg.maxResults > 0) {
          matches = matches.slice(0, msg.maxResults);
        }
        cb(matches);
      }
    });
    var eventName = "ui-autocomplete:" + msg.id + ":selected";

    input.keypress(function(event) {
      if (event.which == 13) {
        bus.send(eventName, input.typeahead("val"));
      }
    });

    icon.click(function() {
      bus.send(eventName, input.typeahead("val"));
    });

    input.on('typeahead:selected', function(event, selection) {
      bus.send(eventName, selection.value);
    });

    if (msg.showOnFocus || msg.minQueryLength === 0) {
      // Show dropdown on input focus
      input.focus(function() {
        // This is a bit obscure, but the only way I found to do it
        var query = (input.val() || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        var data = input.data("ttTypeahead");
        data.dropdown.update(query);
        data.dropdown.open();
      });
    }

    bus.listen("ui-autocomplete:" + msg.id + ":set-values", function(e, values) {
      options = values;
    });

    bus.listen(msg.id + "-field-value-fill", function(e, message) {
      message[msg.id] = input.val();
    });

    bus.listen("ui-autocomplete:" + msg.id + ":set-label", function(e, labelText) {
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
