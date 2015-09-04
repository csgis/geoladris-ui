define([ "jquery", "message-bus" ], function($, bus) {

	bus.listen("ui-form-collector:extend", function(e, msg) {
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