define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	var BUTTON_IMAGE_CLASS = "button-image";

	bus.listen("ui-button:create", function(e, msg) {
		var button = $("<div/>");
		if (msg.text) {
			button.text(msg.text);
		} else {
			var imageDiv = $("<div/>");
			if (msg.image) {
				imageDiv.css("background-image", "url(" + msg.image + ")");
			}
			imageDiv.addClass(BUTTON_IMAGE_CLASS);
			button.append(imageDiv);
		}

		if (msg.tooltip) {
			button.attr("title", msg.tooltip);
		}

		button.attr("id", msg.div);
		button.addClass(msg.css);
		button.addClass("button-enabled");

		commons.append(button, $("#" + msg.parentDiv), msg.priority);

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
		var imageDiv = $("#" + msg.id).children("." + BUTTON_IMAGE_CLASS);
		imageDiv.css("background-image", "url(" + msg.image + ")");
	});
});