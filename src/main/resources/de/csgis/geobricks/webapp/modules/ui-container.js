define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-container:create", function(e, msg) {
		var container = $("<div/>").attr("id", msg.div).addClass(msg.css);
		$("#" + msg.parentDiv).append(container);
	});
});