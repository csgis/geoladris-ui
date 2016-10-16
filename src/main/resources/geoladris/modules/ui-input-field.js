define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
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

		var placeholder;
		if (msg.type == "file") {
			input.change(function() {
				placeholder.text(input.val());
			});
			placeholder = $("<div/>");
			placeholder.addClass("ui-file-input-placeholder");
			div.append(placeholder);
		} else if (msg.type == "number") {
			input.attr("step", "any");
		}

		input.on("change paste keyup", function() {
			bus.send("ui-input-field:" + msg.div + ":value-changed", input.val());
		});

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			if (input.attr("type") == "file") {
				message[msg.div] = input[0].files[0];
			} else if (input.attr("type") == "number") {
				message[msg.div] = parseFloat(input.val());
			} else if (input.attr("type") == "date") {
				message[msg.div] = new Date(input.val()).toISOString();
			} else {
				message[msg.div] = input.val();
			}
		});

		bus.listen("ui-input-field:" + msg.div + ":set-value", function(e, value) {
			if (input.attr("type") == "file") {
				if (!value) {
					placeholder.text("");
					input.val(null);
				} else {
					placeholder.text(value);
				}
			} else {
				input.val(value);
			}
			bus.send("ui-input-field:" + msg.div + ":value-changed", value);
		});

		bus.listen("ui-input-field:" + msg.div + ":append", function(e, value) {
			if (input.attr("type") == "file") {
				placeholder.text((placeholder.text() || "") + value);
			} else {
				var current = input.val();
				if (current) {
					input.val(current + value);
				} else {
					input.val(value);
				}
			}
		});

		bus.listen("ui-input-field:" + msg.div + ":keyup", function(e, f) {
			input.keyup(function() {
				f(input.val());
			});
		});

		bus.listen("ui-input-field:" + msg.div + ":value-changed", function() {
			var valid = !!Date.parse(input.val());
			if (input.attr("type") == "date") {
				input[0].setCustomValidity(valid ? "" : "Invalid date.");
			}
		});
	});
});
