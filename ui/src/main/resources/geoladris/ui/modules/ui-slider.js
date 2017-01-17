define([ "jquery", "message-bus", "./ui-choice-field" ], function($, bus, choice) {
	return function(msg) {
		return choice(msg);
	}
});