define([ "jquery", "message-bus", "./ui-choice-field" ], function($, bus, choice) {
	return function(msg) {
		var id = msg.id;
		bus.listen("ui-slider:" + id + ":add-value", function(e, msg) {
			bus.send("ui-choice-field:" + id + ":add-value", msg);
		});

		return choice(msg);
	}
});