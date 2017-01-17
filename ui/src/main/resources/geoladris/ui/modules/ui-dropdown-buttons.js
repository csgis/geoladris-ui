define([ "jquery", "message-bus", "./ui-commons", "./ui-buttons", "./ui-sliding-div" ], function($, bus, commons, uiButtons, uiSliding) {
	return function(msg) {
		// Map id -> image
		var buttons = {};

		var id = msg.id;
		var containerId = id + "-container";
		var slidingId = id + "-sliding";

		var newMsg = $.extend({}, msg, {
			id : containerId
		});
		var container = commons.getOrCreateElem("div", newMsg);
		container.addClass("ui-dropdown-button-container");

		uiButtons($.extend({}, msg, {
			css : "ui-dropdown-button-button",
			parent : containerId
		}));

		uiSliding({
			id : slidingId,
			parent : containerId
		});

		var selected;
		bus.listen("ui-dropdown-button:" + id + ":add-item", function(e, msg) {
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
					var iconDiv = $(document.getElementById(id)).children(".button-content");
					iconDiv.css("background-image", "url(" + msg.image + ")");
					bus.send("ui-dropdown-button:" + id + ":item-selected", msg.id);
				} else {
					bus.send("ui-sliding-div:collapse", slidingId);
				}
			});
		});

		if (msg.dropdownOnClick) {
			$("#" + id).click(function() {
				bus.send("ui-sliding-div:toggle", slidingId);
			});
		}

		bus.listen("ui-dropdown-button:" + id + ":set-item", function(e, itemId) {
			selected = itemId;
			var iconDiv = $(document.getElementById(id)).children(".button-content");
			iconDiv.css("background-image", "url(" + buttons[itemId] + ")");
		});

		return container;
	}
});
