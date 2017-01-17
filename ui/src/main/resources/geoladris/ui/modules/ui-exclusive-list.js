define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	var baseEventName = "ui-exclusive-list";

	return function(msg) {
		var containerId = msg.id;
		var container = commons.getOrCreateElem("div", msg);
		container.append($("<table/>"));

		bus.listen(baseEventName + ":" + containerId + ":add-item", function(e, msg) {
			var id = msg.id;
			var text = msg.text;

			var input = $("<input id='" + id + "' name='" + containerId + "' type='radio'\\>");
			var inputCell = $("<td/>").append(input);
			var textCell = $("<td/>").text(text);

			textCell.addClass("exclusive-list-text");
			inputCell.addClass("exclusive-list-input");

			var row = $("<tr/>").attr("id", id + "-container");
			row.append(inputCell);
			row.append(textCell);

			$("#" + containerId).find("table").first().append(row);

			input.change(function() {
				if (input.get(0).checked) {
					bus.send(baseEventName + ":" + containerId + ":item-selected", id);
				}
			});
			textCell.click(id, function(event) {
				input.click();
			});
		});

		return container;
	}
});
