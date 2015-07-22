define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-input-field:create", function(e, msg) {
		var div = $("<div/>").attr("id", msg.div);
		div.addClass("ui-input-field-container");
		div.addClass(msg.css);

		if (msg.label) {
			var label = $("<label/>").text(msg.label).addClass("ui-input-field-label");
			div.append(label);
		}

		if (!msg.type) {
			msg.type = "text";
		}

		var input = $("<input/>").attr("type", msg.type);
		div.append(input);
		$("#" + msg.parentDiv).append(div);

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

		bus.listen("ui-input-field:" + msg.div + ":keyup", function(e, f) {
			input.keyup(function() {
				f(input.val());
			});
		});
	});
});
