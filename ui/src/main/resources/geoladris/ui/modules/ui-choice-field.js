define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	return function(msg) {
		var id = msg.id;
		var div = commons.getOrCreateElem("div", msg);
		div.addClass("ui-choice-field-container");

		if (msg.label) {
			var label = $("<label/>").text(msg.label).addClass("ui-choice-field-label");
			div.append(label);
		}

		var combo = $("<select/>");

		function addValues(values) {
			if (!values) {
				return;
			}

			$.each(values, function(index, value) {
				var option;
				if (value.text && value.value) {
					option = $("<option/>").text(value.text).attr("value", value.value);
				} else {
					option = $("<option/>").text(value).attr("value", value);
				}
				combo.append(option);
			});
		}

		addValues(msg.values);
		div.append(combo);

		bus.listen("ui-choice-field:" + id + ":set-values", function(e, values) {
			combo.empty();
			addValues(values);
		});

		bus.listen(id + "-field-value-fill", function(e, message) {
			message[id] = combo.val();
		});

		return combo;
	}
});
