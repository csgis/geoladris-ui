define([ "jquery", "message-bus", "./commons" ], function($, bus, commons) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var input = commons.getOrCreateElem("select", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-choice"
    });

    function addValues(values) {
      if (!values) {
        return;
      }

      $.each(values, function(index, value) {
        var option;
        if (value.text && value.value) {
          option = $("<option/>").text(value.text).attr("value", value.value);
        } else {
          option = $("<option/>").text(value).attr("value", value);
        }
        input.append(option);
      });
    }

    addValues(props.values);

    bus.listen("ui-choice-field:" + props.id + ":set-values", function(e, values) {
      input.empty();
      addValues(values);
    });

    bus.listen(props.id + "-field-value-fill", function(e, message) {
      message[props.id] = input.val();
    });

    return input;
  }
});
