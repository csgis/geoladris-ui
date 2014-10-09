define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-choice-field:create", function(e, msg) {
		var id = msg.div;
		var div = $("<div/>").attr("id", id);
		div.addClass("ui-choice-field-container");
		div.addClass(msg.css);

		if (msg.label) {
			var label = $("<label/>").text(msg.label).addClass("ui-choice-field-label");
			div.append(label);
		}

		var combo = $("<select/>");
		if (msg.values) {
			$.each(msg.values, function(index, value) {
				var option;
				if (value.text && value.value) {
					option = $("<option/>").text(value.text).attr("value", value.value);
				} else {
					option = $("<option/>").text(value).attr("value", value);
				}
				combo.append(option);
			});
		}
		div.append(combo);

		$("#" + msg.parentDiv).append(div);

		bus.listen("ui-choice-field:" + id + ":add-value", function(e, value) {
			var select = $($("#" + id).find("select")[0]);
			var option = $("<option/>").text(value).attr("value", value);
			select.append(option);
		});

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			message[msg.div] = combo.val();
		});
	});
});