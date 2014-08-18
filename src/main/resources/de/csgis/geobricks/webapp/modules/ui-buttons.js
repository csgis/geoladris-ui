define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-button:create", function(e, msg) {
		var button;
		if (msg.text) {
			button = $("<button>").text(msg.text);
		} else {
			button = $("<div/>");
			var imageDiv = $("<div/>");
			imageDiv.css("background-image", "url(" + msg.image + ")");
			imageDiv.addClass("button-enabled-image");
			button.addClass("button-enabled");
			button.append(imageDiv);
		}

		if (msg.tooltip) {
			button.attr("title", msg.tooltip);
		}

		button.attr("id", msg.div);
		button.attr("enabled", true);
		button.addClass(msg.css);

		var parent = $("#" + msg.parentDiv);
		var nextDiv;
		if (msg.priority) {
			button.attr("priority", msg.priority);

			var children = parent.children();
			for (var i = 0; i < children.length; i++) {
				var child = $(children[i]);
				var priority = child.attr("priority");
				if (!priority || priority > msg.priority) {
					nextDiv = child;
					break;
				}
			}
		}

		if (nextDiv) {
			nextDiv.before(button);
		} else {
			parent.append(button);
		}

		if (msg.sendEventName) {
			button.click(function() {
				if ($("#" + msg.div).attr("enabled")) {
					bus.send(msg.sendEventName, msg.sendEventMessage);
				}
			});
		}

		if (msg.enableEventName) {
			bus.listen(msg.enableEventName, function() {
				var div = $("#" + msg.div);
				div.addClass("button-enabled");
				div.removeClass("button-disabled");
				div.attr("enabled", true);
			});
		}
		if (msg.disableEventName) {
			bus.listen(msg.disableEventName, function() {
				var div = $("#" + msg.div);
				div.removeClass("button-enabled");
				div.addClass("button-disabled");
				div.removeAttr("enabled");
			});
		}
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
});