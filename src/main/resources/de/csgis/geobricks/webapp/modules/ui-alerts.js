define([ "jquery", "message-bus", "ui-commons", "layout", "module" ], function($, bus, commons, layout, module) {
	var config = module.config();

	var timeout = 5;
	if (config.timeout) {
		timeout = config.timeout;
	}

	var wrapper = commons.getOrCreateDiv("ui-alerts-wrapper", layout.center);
	var container = commons.getOrCreateDiv("ui-alerts-container", wrapper.attr("id"));

	bus.listen("ui-alert", function(e, msg) {
		var severity = msg.severity;
		var message = msg.message;

		var div = $("<div/>");
		div.addClass("ui-alert");
		div.addClass("ui-alert-" + severity);
		div.text(message);

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