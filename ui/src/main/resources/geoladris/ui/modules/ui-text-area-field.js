define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	return function(msg) {
		var div = commons.getOrCreateElem("div", msg);
		div.addClass("ui-text-area-field-container");

		if (msg.label) {
			var label = $("<label/>").text(msg.label).addClass("ui-text-area-field-label");
			div.append(label);
		}

		var text = $("<textarea/>");
		if (msg.cols) {
			text.attr("cols", msg.cols);
		}
		if (msg.rows) {
			text.attr("rows", msg.rows);
		}

		div.append(text);

		bus.listen(msg.id + "-field-value-fill", function(e, message) {
			message[msg.id] = text.val();
		});

		return text;
	}
});
