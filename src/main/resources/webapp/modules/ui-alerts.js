define([ "jquery", "message-bus", "ui-commons", "layout", "module" ], function($, bus, commons, layout, module) {
	var config = module.config();

	var timeout = 5;
	if (config.timeout) {
		timeout = config.timeout;
	}

	var parentDiv = layout.center;
	if (config.parentDiv) {
		parentDiv = config.parentDiv;
	}

	var wrapper = commons.getOrCreateDiv({
		div : "ui-alerts-wrapper",
		parentDiv : parentDiv
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
		}, timeout * 1000);
	})
});