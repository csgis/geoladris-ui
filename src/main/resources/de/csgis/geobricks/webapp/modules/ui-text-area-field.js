define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-text-area-field:create", function(e, msg) {
		var div = $("<div/>");
		div.addClass(msg.css);
		div.addClass("ui-text-area-field-container");

		var label = $("<label/>").text(msg.label).addClass("ui-text-area-field-label");
		var text = $("<textarea/>");
		if (msg.cols) {
			text.attr("cols", msg.cols);
		}
		if (msg.rows) {
			text.attr("rows", msg.rows);
		}

		div.append(label);
		div.append(text);

		$("#" + msg.parentDiv).append(div);

		bus.listen("ui-text-area-field:" + msg.div + ":set-value", function(e, value) {
			text.val(value);
		});

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			message[msg.div] = text.val();
		});
	});
});