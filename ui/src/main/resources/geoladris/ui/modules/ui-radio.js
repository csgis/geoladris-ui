define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	return function(msg) {
		var input = $("<input id='" + msg.id + "' name='" + msg.parent + "' type='radio'\\>");
		var inputCell = $("<div/>").append(input);
		var textCell = $("<div/>").text(msg.text);

		textCell.addClass("radio-text");
		inputCell.addClass("radio-input");

		var container = $("<div/>").attr("id", msg.id + "-container");
		container.append(inputCell);
		container.append(textCell);

		$("#" + msg.parent).append(container);

		textCell.click(function() {
			input.click();
		});

		return input[0];
	}
});
