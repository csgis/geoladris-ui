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
			bus.send("ui-button:" + msg.button + ":enable", enabled);
		}

		if (msg.requiredDivs) {
			msg.requiredDivs.forEach(function(div) {
				var container = $("#" + div);
				var input = container.find("input");
				var select = container.find("select");
				if (input.length == 1) {
					bus.listen("ui-input-field:" + div + ":value-changed", updateButton);
				} else if (select.length == 1) {
					bus.listen("ui-choice-field:" + div + ":value-changed", updateButton);
				}
			});

			updateButton();
		}

		$("#" + msg.button).click(function() {
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