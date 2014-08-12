define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-input-field:create", function(e, msg) {
		var div = $("<div/>");
		div.addClass("ui-input-field-container");
		div.addClass(msg.css);

		if (msg.label) {
			var label = $("<label/>").text(msg.label).addClass("ui-input-field-label");
			div.append(label);
		}

		if (!msg.type) {
			msg.type = "text";
		}

		var text = $("<input/>").attr("type", msg.type);
		div.append(text);
		$("#" + msg.parentDiv).append(div);

		bus.listen(msg.div + "-field-value-fill", function(e, message) {
			message[msg.div] = text.val();
		});
	});
});