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
		var div = $("<div/>");
		div.addClass("ui-alert");
		div.addClass("ui-alert-" + msg.severity);
		div.text(msg.message);

		var close = $("<div/>");
		close.addClass("ui-alerts-close");
		close.click(function() {
			div.remove();
		});

		div.append(close);
		container.append(div);

		setTimeout(function() {
			div.remove();
		}, config.timeout * 1000);
	});
});
