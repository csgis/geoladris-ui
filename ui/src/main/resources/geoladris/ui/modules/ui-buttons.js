define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	bus.listen("ui-button:create", function(e, msg) {
		var button = commons.getOrCreateDiv(msg);

		var iconDiv = $("<div/>");
		if (msg.image) {
			iconDiv.css("background-image", "url(" + msg.image + ")");
		}
		if (msg.text) {
			iconDiv.text(msg.text);
		}
		iconDiv.addClass("button-content");
		button.append(iconDiv);

		if (msg.tooltip) {
			button.attr("title", msg.tooltip);
		}

		button.addClass("button-enabled");

		if (msg.sendEventName) {
			button.click(function() {
				if ($("#" + msg.div).hasClass("button-enabled")) {
					bus.send(msg.sendEventName, msg.sendEventMessage);
				}
			});
		}

		function enable(enabled) {
			if (enabled !== undefined && !enabled) {
				button.addClass("button-disabled");
				button.removeClass("button-enabled");
			} else {
				button.addClass("button-enabled");
				button.removeClass("button-disabled");
			}
		}

		function activate(active) {
			if (active !== undefined && !active) {
				button.removeClass("button-active");
			} else {
				button.addClass("button-active");
			}
		}

		function toggle() {
			if (button.hasClass("button-active")) {
				button.removeClass("button-active");
			} else {
				button.addClass("button-active");
			}
		}

		bus.listen("ui-button:" + msg.div + ":enable", function(e, enabled) {
			enable(enabled);
		});
		bus.listen("ui-button:" + msg.div + ":activate", function(e, active) {
			activate(active);
		});

		bus.listen("ui-button:" + msg.div + ":toggle", function() {
			toggle();
		});
		bus.listen("ui-button:" + msg.div + ":set-image", function(e, image) {
			var iconDiv = button.children(".button-content");
			iconDiv.css("background-image", "url(" + image + ")");
		});

		bus.listen("ui-button:" + msg.div + ":link-active", function(e, linkedDiv) {
			bus.listen("ui-show", function(e, id) {
				if (linkedDiv == id) {
					activate(true);
				}
			});
			bus.listen("ui-hide", function(e, id) {
				if (linkedDiv == id) {
					activate(false);
				}
			});
			bus.listen("ui-toggle", function(e, id) {
				if (linkedDiv == id) {
					toggle();
				}
			});
		});
	});
});
