define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	return function(msg) {
		var input = $("<input id='" + msg.id + "' name='" + msg.parent + "' type='checkbox'\\>");
		var inputCell = $("<div/>").append(input);
		var textCell = $("<div/>").text(msg.text);

		textCell.addClass("selectable-list-text");
		inputCell.addClass("selectable-list-input");

		var row = $("<div/>").attr("id", msg.id + "-container");
		row.append(inputCell);
		row.append(textCell);

		$("#" + msg.parent).append(row);

		textCell.click(function(event) {
			input.click();
		});

		return input;
	}
});
