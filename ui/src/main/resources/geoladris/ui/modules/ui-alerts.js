define([ "jquery", "message-bus", "./ui-commons", "module" ], function($, bus, commons, module) {
	var config = module.config();

	if (!config.timeout) {
		config.timeout = 5;
	}

	var wrapper = commons.getOrCreateElem("div", {
		id : "ui-alerts-wrapper",
		parent : config.parentDiv || "center"
	});
	var container = commons.getOrCreateElem("div", {
		id : "ui-alerts-container",
		parent : wrapper.attr("id")
	});

	bus.listen("ui-alert", function(e, msg) {
		var div = commons.getOrCreateElem("div", {
			parent : container,
			html : msg.message,
			css : "ui-alert ui-alert-" + msg.severity
		});

		var close = commons.getOrCreateElem("div", {
			parent : div,
			css : "ui-alerts-close"
		});
		close.click(function() {
			div.remove();
		});

		setTimeout(function() {
			div.remove();
		}, config.timeout * 1000);
	});
});
