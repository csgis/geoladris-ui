define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-slider:create", function(e, msg) {

		bus.send("ui-choice-field:create", msg);

		var id = msg.div;
		bus.listen("ui-slider:" + id + ":add-value", function(e, msg) {
			bus.send("ui-choice-field:" + id + ":add-value", msg);
		});
	});
});