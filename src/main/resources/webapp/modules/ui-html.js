define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	bus.listen("ui-html:create", function(e, msg) {
		commons.getOrCreateDiv(msg).html(msg.html);
	});
});