define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
  return function(msg) {
    var input = $("<input/>");
    input.attr("id", msg.id);
    input.attr("type", "radio");
    if (msg.parent) {
      if (typeof msg.parent == "string") {
        input.attr("name", msg.parent);
      } else {
        input.attr("name", msg.parent.id);
      }
    }
    var inputCell = $("<div/>").append(input);
    var textCell = $("<div/>").text(msg.text);

    textCell.addClass("ui-radio-text");
    inputCell.addClass("ui-radio-input");

    var containerCss = "";
    if (msg.css) {
      containerCss = msg.css.split("\s+").map(function(a) {
        return a + "-container";
      }).join(" ");
    }
    var container = commons.getOrCreateElem("div", {
      id : msg.id + "-container",
      parent : msg.parent,
      css : "ui-radio-container"
    })
    container.append(inputCell);
    container.append(textCell);

    textCell.click(function() {
      input.click();
    });

    return input;
  }
});
