define([ "message-bus", "./commons" ], function(bus, commons) {
  return function(props) {
    var container = commons.createContainer(props.id, props.parent, props.css);

    var input = commons.getOrCreateElem("input", {
      id : props.id,
      parent : container,
      css : (props.css || "") + " ui-radio"
    });

    commons.linkDisplay(input, container);

    if (props.parent) {
      var name;
      if (typeof props.parent != "string") {
        name = props.parent.id;
      } else {
        name = props.parent;
      }
      input.name = name;
    }

    input.type = "radio";

    var label = commons.createLabel(props.id, container, props.label);
    label.addEventListener("click", function(event) {
      input.click();
    });

    return input;
  }
});
