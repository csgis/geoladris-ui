define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-dropdown-button:create", function(e, msg) {
		// Map id -> image
		var buttons = {};

		var divId = msg.div;
		var containerId = divId + "-container";
		var slidingId = divId + "-sliding";

		var container = $("<div/>").attr("id", containerId);
		container.addClass(msg.css);
		container.addClass("ui-dropdown-button-container");
		$("#" + msg.parentDiv).append(container);

		var buttonMsg = $.extend({}, msg);
		buttonMsg.css = "ui-dropdown-button-button";
		buttonMsg.parentDiv = containerId;

		bus.send("ui-button:create", buttonMsg);

		bus.send("ui-sliding-div:create", {
			div : slidingId,
			parentDiv : containerId
		});

		bus.listen("ui-dropdown-button:" + divId + ":add-item", function(e, msg) {
			buttons[msg.id] = msg.image;

			var item = $("<div/>").addClass("ui-dropdown-button-item");
			$("#" + slidingId).append(item);
			item.css("background-image", "url('" + msg.image + "')")

			item.click(function() {
				bus.send("ui-sliding-div:collapse", slidingId);
				bus.send("ui-button:set-image", {
					id : divId,
					image : msg.image
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
			bus.send("ui-button:set-image", {
				id : divId,
				image : buttons[itemId]
			});
		});
	});
});