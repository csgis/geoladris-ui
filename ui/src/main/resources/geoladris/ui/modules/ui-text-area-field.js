define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
  return function(msg) {
    var div = commons.getOrCreateElem("div", msg);
    div.addClass("ui-text-area-field-container");

    var label = $("<label/>").addClass("ui-text-area-field-label");
    div.append(label);
    if (msg.label) {
      label.text(msg.label);
    } else {
      label.hide();
    }

    var text = $("<textarea/>");
    if (msg.cols) {
      text.attr("cols", msg.cols);
    }
    if (msg.rows) {
      text.attr("rows", msg.rows);
    }

    div.append(text);

    bus.listen(msg.id + "-field-value-fill", function(e, message) {
      message[msg.id] = text.val();
    });

    bus.listen("ui-text-area-field:" + msg.id + ":set-label", function(e, labelText) {
      if (labelText) {
        label.text(labelText);
        label.show();
      } else {
        label.hide();
      }
    });

    return text;
  }
});
