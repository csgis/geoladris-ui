define([ "jquery", "message-bus","ui-commons" ], function($, bus, commons) {
	bus.listen("ui-input-field:create", function(e, msg) {
		var div = commons.getOrCreateDiv(msg);
		div.addClass("ui-input-field-container");

		if (msg.label) {
			var label = $("<label/>").text(msg.label).addClass("ui-input-field-label");
			div.append(label);
		}

		if (!msg.type) {
			msg.type = "text";
		}

		var input = $("<input/>").attr("type", msg.type);
		div.append(input);

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			message[msg.div] = input.val();
		});

		bus.listen("ui-input-field:" + msg.div + ":set-value", function(e, value) {
			input.val(value);
		});

		bus.listen("ui-input-field:" + msg.div + ":append", function(e, value) {
			var current = input.val();
			if (current) {
				input.val(current + value);
			} else {
				input.val(value);
			}
		});
	});
});
