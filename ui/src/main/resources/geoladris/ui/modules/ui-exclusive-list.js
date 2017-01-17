define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	return function(msg) {
		var input = $("<input id='" + msg.id + "' name='" + msg.parent + "' type='radio'\\>");
		var inputCell = $("<div/>").append(input);
		var textCell = $("<div/>").text(msg.text);

		textCell.addClass("exclusive-list-text");
		inputCell.addClass("exclusive-list-input");

		var container = $("<div/>").attr("id", msg.id + "-container");
		container.append(inputCell);
		container.append(textCell);

		$("#" + msg.parent).append(container);

		input.change(function() {
			if (this.checked) {
				bus.send("ui-exclusive-list:" + msg.parent + ":item-selected", msg.id);
			}
		});

		textCell.click(msg.id, function(event) {
			input.click();
		});

		return input[0];
	}
});
