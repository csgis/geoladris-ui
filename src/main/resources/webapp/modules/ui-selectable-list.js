define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	var baseEventName = "ui-selectable-list";

	function addItemToList(parentDiv, div, text) {
		var input = $("<input id='" + div + "' name='" + parentDiv + "' type='checkbox'\>");
		var inputCell = $("<div/>").append(input);
		var textCell = $("<div/>").text(text);

		textCell.addClass("selectable-list-text");
		inputCell.addClass("selectable-list-input");

		var row = $("<div/>").attr("id", div + "-container");
		row.append(inputCell);
		row.append(textCell);

		$("#" + parentDiv).append(row);

		input.change(function() {
			if (input.get(0).checked) {
				bus.send("ui-selectable-list:" + parentDiv + ":item-selected", div);
			} else {
				bus.send("ui-selectable-list:" + parentDiv + ":item-unselected", div);
			}
		});
		textCell.click(div, function(event) {
			input.click();
		});
	}

	bus.listen(baseEventName + ":create", function(e, msg) {
		var id = msg.div;
		var div = commons.getOrCreateDiv(msg);

		bus.listen(baseEventName + ":" + id + ":add-item", function(e, msg) {
			addItemToList(id, msg.id, msg.text);
		});

		bus.listen(baseEventName + ":" + id + ":remove-item", function(e, id) {
			$("#" + id + "-container").remove();
		});

		bus.listen(baseEventName + ":" + id + ":set-item", function(e, msg) {
			var div = $("#" + msg.id);
			if (div.length > 0) {
				div.get(0).checked = msg.selected;
			}
		});
	});
});