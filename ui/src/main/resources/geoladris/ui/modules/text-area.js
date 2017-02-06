define([ "jquery", "message-bus", "./commons" ], function($, bus, commons) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var label = commons.createLabel(props.id, container, props.label);
    var input = commons.getOrCreateElem("textarea", {
      id : props.id,
      parent : container,
      css : props.css + " ui-textarea"
    });

    input.cols = props.cols;
    input.rows = props.rows;

    bus.listen(props.id + "-field-value-fill", function(e, message) {
      message[props.id] = input.value;
    });

    return input;
  }
});
