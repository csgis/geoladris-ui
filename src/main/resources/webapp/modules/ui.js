define([ "jquery", "message-bus", "module", //
"ui-selectable-list", "ui-exclusive-list", "ui-accordion", //
"ui-html", "ui-dialog", "ui-search", "ui-buttons", //
"ui-choice-field", "ui-input-field", "ui-text-area-field", //
"ui-form-collector", "ui-divstack", "ui-slider", "ui-autocomplete", "ui-alerts", //
"ui-loading" ], function($, bus, module) {
	bus.listen("ui-show", function(e, id) {
		$("#" + id).show();
	});

	bus.listen("ui-hide", function(e, id) {
		$("#" + id).hide();
	});

	bus.listen("ui-toggle", function(e, id) {
		$("#" + id).toggle();
	});

	bus.listen("ui-set-content", function(e, msg) {
		$("#" + msg.div).html(msg.content);
	});

	bus.listen("ui-open-url", function(e, msg) {
		window.open(msg.url, msg.target);
	});

	// Initialization
	var config = module.config();
	bus.listen("modules-loaded", function() {
		for (var i = 0; i < config.length; i++) {
			var controlInfo = config[i];
			bus.send(controlInfo["eventName"], controlInfo);
		}

		bus.send("ui-loaded");
	});
});