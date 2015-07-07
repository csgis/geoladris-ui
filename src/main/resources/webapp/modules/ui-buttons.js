define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
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
	});

	bus.listen("ui-button:enable", function(e, id) {
		var div = $("#" + id);
		div.addClass("button-enabled");
		div.removeClass("button-disabled");
	});

	bus.listen("ui-button:disable", function(e, id) {
		var div = $("#" + id);
		div.addClass("button-disabled");
		div.removeClass("button-enabled");
	});

	bus.listen("ui-button:activate", function(e, id) {
		$("#" + id).addClass("button-active");
	});

	bus.listen("ui-button:deactivate", function(e, id) {
		$("#" + id).removeClass("button-active");
	});

	bus.listen("ui-button:toggle", function(e, id) {
		var div = $("#" + id);
		if (div.hasClass("button-active")) {
			div.removeClass("button-active");
		} else {
			div.addClass("button-active");
		}
	});

	bus.listen("ui-button:set-image", function(e, msg) {
		var iconDiv = $("#" + msg.id).children(".button-content");
		iconDiv.css("background-image", "url(" + msg.image + ")");
	});
});