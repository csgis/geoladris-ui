define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	bus.listen("ui-html", function(e, msg) {
		var div = commons.getOrCreateDiv(msg.div, msg.parentDiv);
		div.html(msg.html);
		div.addClass(msg.css);
	});
});