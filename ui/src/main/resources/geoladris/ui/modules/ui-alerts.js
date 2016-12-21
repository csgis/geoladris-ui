define([ "jquery", "message-bus", "./ui-commons", "layout", "module" ], function($, bus, commons, layout, module) {
	var config = module.config();

	if (!config.timeout) {
		config.timeout = 5;
	}

	if (!config.parentDiv) {
		config.parentDiv = layout.center;
	}

	var wrapper = commons.getOrCreateDiv({
		div : "ui-alerts-wrapper",
		parentDiv : config.parentDiv
	});
	var container = commons.getOrCreateDiv({
		div : "ui-alerts-container",
		parentDiv : wrapper.attr("id")
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
