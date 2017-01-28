define([ "jquery", "message-bus", "./commons" ], function($, bus, commons) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);
    var input = commons.getOrCreateElem("input", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-checkbox"
    });
    input.attr("type", "checkbox");

    var label = commons.createLabel(props.id, container, props.label);
    label.click(function(event) {
      input.click();
    });

    return input;
  }
});
