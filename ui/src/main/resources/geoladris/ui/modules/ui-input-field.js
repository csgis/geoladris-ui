define([ "jquery", "message-bus", "./ui-commons", "pikaday.jquery" ], function($, bus, commons) {
	return function(msg) {
		var div = commons.getOrCreateElem("div", msg);
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
		} else if (msg.type == "date") {
			input.pikaday({
				format : "YYYY-MM-DD"
			});
			input.attr("type", "text");
			input.attr("geoladris-type", "date");
		}

		input.on("change paste keyup", function() {
			bus.send("ui-input-field:" + msg.id + ":value-changed", input.val());
		});

		bus.listen(msg.id + "-field-value-fill", function(e, message) {
			if (input.attr("type") == "file") {
				message[msg.id] = input[0].files[0];
			} else if (input.attr("type") == "number") {
				message[msg.id] = parseFloat(input.val());
			} else if (input.attr("geoladris-type") == "date") {
				message[msg.id] = new Date(input.val()).toISOString();
			} else {
				message[msg.id] = input.val();
			}
		});

		bus.listen("ui-input-field:" + msg.id + ":set-value", function(e, value) {
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
			bus.send("ui-input-field:" + msg.id + ":value-changed", value);
		});

		bus.listen("ui-input-field:" + msg.id + ":append", function(e, value) {
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

		bus.listen("ui-input-field:" + msg.id + ":keyup", function(e, f) {
			input.keyup(function() {
				f(input.val());
			});
		});

		bus.listen("ui-input-field:" + msg.id + ":value-changed", function() {
			var valid = !!Date.parse(input.val());
			if (input.attr("geoladris-type") == "date") {
				input[0].setCustomValidity(valid ? "" : "Invalid date.");
			}
		});

		return input;
	}
});
