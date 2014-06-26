define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	var baseEventName = "ui-exclusive-list";

	function addItemToList(divId, id, text) {
		var input = $("<input id='" + id + "' name='" + divId + "' type='radio'\>");
		var inputCell = $("<td/>").append(input);
		var textCell = $("<td/>").text(text);

		textCell.addClass("exclusive-list-text");
		inputCell.addClass("exclusive-list-input");

		var row = $("<tr/>");
		row.append(inputCell);
		row.append(textCell);

		$("#" + divId).find("table").first().append(row);

		input.change(id, function(event) {
			if (input.get(0).checked) {
				bus.send("ui-exclusive-list:" + divId + ":item-selected", event.data);
			}
		});
		textCell.click(id, function(event) {
			input.click();
		});
	}

	bus.listen(baseEventName + ":create", function(e, msg) {
		var id = msg["div"];
		var div = commons.getOrCreateDiv(id, msg["parentDiv"]);
		div.append($("<table/>"));
		var dataGetter = msg["data-getter"];
		if (dataGetter) {
			var callback = function(ids, options) {
				for (var i = 0; i < options.length; i++) {
					addItemToList(id, ids[i], options[i]);
				}
			};

			dataGetter(callback);
		}
	});

	bus.listen(baseEventName + ":add-item", function(e, msg) {
		addItemToList(msg.listId, msg.id, msg.text);
	});

	bus.listen(baseEventName + ":set-item", function(e, msg) {
		var div = $("#" + msg.id);
		if (div.length > 0) {
			div.get(0).checked = true;
		}
	});
});