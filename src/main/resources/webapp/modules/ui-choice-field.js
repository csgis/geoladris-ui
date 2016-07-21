define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {

	bus.listen("ui-choice-field:create", function(e, msg) {
		var id = msg.div;
		var div = commons.getOrCreateDiv(msg);
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

		bus.listen("ui-choice-field:" + id + ":add-value", function(e, value) {
			var select = $($("#" + id).find("select")[0]);
			var option = $("<option/>").text(value).attr("value", value);
			select.append(option);
		});

		bus.listen("ui-choice-field:" + id + ":set-values", function(e, values) {
			combo.empty();
			addValues(values);
		});

		bus.listen("ui-choice-field:" + id + ":set-value", function(e, value) {
			combo.val(value || combo.find("option")[0].value);
			bus.send("ui-choice-field:" + id + ":value-changed", value);
		});

		combo.change(function() {
			bus.send("ui-choice-field:" + id + ":value-changed", combo.val());
		});

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			message[msg.div] = combo.val();
		});
	});
});