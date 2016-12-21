define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	bus.listen("ui-dropdown-button:create", function(e, msg) {
		// Map id -> image
		var buttons = {};

		var divId = msg.div;
		var containerId = divId + "-container";
		var slidingId = divId + "-sliding";

		var newMsg = $.extend({}, msg, {
			div : containerId
		});
		var container = commons.getOrCreateDiv(newMsg);
		container.addClass("ui-dropdown-button-container");

		bus.send("ui-button:create", $.extend({}, msg, {
			css : "ui-dropdown-button-button",
			parentDiv : containerId
		}));

		bus.send("ui-sliding-div:create", {
			div : slidingId,
			parentDiv : containerId
		});

		var selected;
		bus.listen("ui-dropdown-button:" + divId + ":add-item", function(e, msg) {
			buttons[msg.id] = msg.image;

			var item = $("<div/>").addClass("ui-dropdown-button-item");

			$("#" + slidingId).append(item);
			item.css("background-image", "url('" + msg.image + "')");

			if (msg.tooltip) {
				item.attr("title", msg.tooltip);
			}

			item.click(function() {
				if (msg.id != selected) {
					selected = msg.id;
					bus.send("ui-sliding-div:collapse", slidingId);
					bus.send("ui-button:" + divId + ":set-image", msg.image);
					bus.send("ui-dropdown-button:" + divId + ":item-selected", msg.id);
				} else {
					bus.send("ui-sliding-div:collapse", slidingId);
				}
			});
		});

		if (msg.dropdownOnClick) {
			$("#" + divId).click(function() {
				bus.send("ui-sliding-div:toggle", slidingId);
			});
		}

		bus.listen("ui-dropdown-button:" + divId + ":set-item", function(e, itemId) {
			selected = itemId;
			bus.send("ui-button:" + divId + ":set-image", buttons[itemId]);
		});
	});
});
