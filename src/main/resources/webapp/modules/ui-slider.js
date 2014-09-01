define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-slider:create", function(e, msg) {
		bus.send("ui-choice-field:create", msg);
	});
	
	bus.listen("ui-slider:add-value", function(e, msg) {
		bus.send("ui-choice-field:add-value", msg);
	});
});