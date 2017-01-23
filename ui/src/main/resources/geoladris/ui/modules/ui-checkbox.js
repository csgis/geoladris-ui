define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	return function(msg) {
		var input = $("<input/>");
		input.attr("id", msg.id);
		input.attr("type", "checkbox");
		if (msg.parent) {
			if (typeof msg.parent == "string") {
				input.attr("name", msg.parent);
			} else {
				input.attr("name", msg.parent.id);
			}
		}
		var inputCell = $("<div/>").append(input);
		var textCell = $("<div/>").text(msg.text);

		textCell.addClass("checkbox-text");
		inputCell.addClass("checkbox-input");

		var row = commons.getOrCreateElem("div", {
			id : msg.id + "-container",
			parent : msg.parent
		});
		row.append(inputCell);
		row.append(textCell);

		textCell.click(function(event) {
			input.click();
		});

		return input;
	}
});
