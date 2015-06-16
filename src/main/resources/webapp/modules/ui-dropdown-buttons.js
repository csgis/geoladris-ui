define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	bus.listen("ui-dropdown-button:create", function(e, msg) {
		// Map id -> image
		var buttons = {};

		var divId = msg.div;
		var containerId = divId + "-container";
		var slidingId = divId + "-sliding";
		var useLigatures = msg.useLigatures;

		var container = $("<div/>").attr("id", containerId);
		container.addClass(msg.css);
		container.addClass("ui-dropdown-button-container");

		commons.append(container, $("#" + msg.parentDiv), msg.priority);

		var buttonMsg = $.extend({}, msg);
		buttonMsg.css = "ui-dropdown-button-button";
		buttonMsg.parentDiv = containerId;

		bus.send("ui-button:create", buttonMsg);

		bus.send("ui-sliding-div:create", {
			div : slidingId,
			parentDiv : containerId
		});

		bus.listen("ui-dropdown-button:" + divId + ":add-item", function(e, msg) {
			buttons[msg.id] = msg.text;

			var item = $("<div/>").addClass("ui-dropdown-button-item");
			if (useLigatures) {
				item.addClass("geobricks-icons");
			}

			$("#" + slidingId).append(item);

			item.text(msg.text);

			if (msg.tooltip) {
				item.attr("title", msg.tooltip);
			}

			item.click(function() {
				bus.send("ui-sliding-div:collapse", slidingId);
				bus.send("ui-set-content", {
					div : divId,
					content : msg.text
				});
				bus.send("ui-dropdown-button:" + divId + ":item-selected", msg.id);
			});
		});

		if (msg.dropdownOnClick) {
			$("#" + divId).click(function() {
				bus.send("ui-sliding-div:toggle", slidingId);
			});
		}

		bus.listen("ui-dropdown-button:" + divId + ":set-item", function(e, itemId) {
			bus.send("ui-set-content", {
				div : divId,
				content : buttons[itemId]
			});
		});
	});
});