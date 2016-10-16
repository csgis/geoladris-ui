define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-form-collector:extend", function(e, msg) {
		function updateButton() {
			var enabled = true;
			msg.requiredDivs.forEach(function(div) {
				var container = $("#" + div);
				var input = container.find("input");
				var select = container.find("select");
				if (input.length == 1) {
					if (input.attr("type") == "file") {
						var placeholder = container.find(".ui-file-input-placeholder");
						enabled = enabled && !!placeholder.text();
					} else {
						enabled = enabled && !!input.val();
					}
				} else if (select.length == 1) {
					enabled = enabled && !!select.val();
				}
			});

			if (enabled) {
				msg.divs.forEach(function(div) {
					var input = $("#" + div).find("input");
					if (input.length == 1 && input.attr("type") == "date") {
						enabled = enabled && !!Date.parse(input.val());
					}
				});
			}

			bus.send("ui-button:" + msg.button + ":enable", enabled);
		}

		msg.divs.forEach(function(div) {
			var input = $("#" + div).find("input");
			if (input.length == 1 && input.attr("type") == "date") {
				bus.listen("ui-input-field:" + div + ":value-changed", updateButton);
			}
		});

		if (msg.requiredDivs) {
			msg.requiredDivs.forEach(function(div) {
				var container = $("#" + div);
				var input = container.find("input");
				var select = container.find("select");
				// Check type != date so we don't add listeners twice (see
				// above)
				if (input.length == 1 && input.attr("type") != "date") {
					bus.listen("ui-input-field:" + div + ":value-changed", updateButton);
				} else if (select.length == 1) {
					bus.listen("ui-choice-field:" + div + ":value-changed", updateButton);
				}
			});

			updateButton();
		}

		var button = $("#" + msg.button);
		button.click(function() {
			if (!button.hasClass("button-enabled")) {
				return;
			}

			var rawMessage = {};
			var i;
			for (i = 0; i < msg.divs.length; i++) {
				var fieldName = msg.divs[i];
				bus.send(fieldName + "-field-value-fill", rawMessage);
			}

			var translatedMessage;
			if (msg.names) {
				translatedMessage = {};
				for (i = 0; i < msg.divs.length; i++) {
					translatedMessage[msg.names[i]] = rawMessage[msg.divs[i]];
				}
			} else {
				translatedMessage = rawMessage;
			}
			bus.send(msg.sendEventName, translatedMessage);
		});
	});
});