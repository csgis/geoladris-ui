define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-text-area-field:create", function(e, msg) {
		var div = $("<div/>").attr("id", msg.div);
		div.addClass(msg.css);
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

		$("#" + msg.parentDiv).append(div);

		bus.listen("ui-text-area-field:" + msg.div + ":set-value", function(e, value) {
			text.val(value);
		});

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			message[msg.div] = text.val();
		});

		bus.listen("ui-text-area-field:" + msg.div + ":append", function(e, value) {
			var current = text.val();
			if (current) {
				text.val(current + value);
			} else {
				text.val(value);
			}
		});
	});
});