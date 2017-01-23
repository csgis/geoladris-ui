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

		textCell.addClass("radio-text");
		inputCell.addClass("radio-input");

		var container = commons.getOrCreateElem("div", {
			id : msg.id + "-container",
			parent : msg.parent
		})
		container.append(inputCell);
		container.append(textCell);

		textCell.click(function() {
			input.click();
		});

		return input;
	}
});
