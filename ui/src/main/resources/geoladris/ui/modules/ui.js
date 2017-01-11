define([ "jquery", "message-bus", "module", //
"./ui-selectable-list", "./ui-exclusive-list", "./ui-accordion", //
"./ui-dialog", "./ui-search", "./ui-buttons", "./ui-sliding-div", //
"./ui-choice-field", "./ui-input-field", "./ui-text-area-field", //
"./ui-form-collector", "./ui-divstack", "./ui-slider", "./ui-autocomplete", "./ui-alerts", //
"./ui-loading", "./ui-dropdown-buttons", "./ui-table", "./ui-commons" ], function($, bus, module,//
selectableList, exclusiveList, accordion, html, dialog, search, buttons, //
slidingDiv, choice, input, textArea, formCollector, divstack, //
slider, autocomplete, alerts, loading, dropdownButtons, table, commons) {
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

	bus.listen("ui-add-class", function(e, msg) {
		$("#" + msg.div).addClass(msg.cssClass);
	});
	bus.listen("ui-remove-class", function(e, msg) {
		$("#" + msg.div).removeClass(msg.cssClass);
	});

	bus.listen("ui-css", function(e, msg) {
		$("#" + msg.div).css(msg.key, msg.value);
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

	return {
		create : function(type, props) {
			// Do not create if already exists
			var jqueryElem = $("#" + props.id);
			if (jqueryElem.length > 0) {
				return jqueryElem.get(0);
			}

			switch (type) {
			case "accordion":
				// TODO implement
				break;
			case "autocomplete":
				jqueryElem = autocomplete(props);
				break;
			case "button":
				jqueryElem = buttons(props);
				break;
			case "choice":
				jqueryElem = choice(props);
				break;
			case "dialog":
				// TODO implement
				break;
			case "divstack":
				jqueryElem = divstack(props);
				break;
			case "dropdown-button":
				// TODO implement
				break;
			case "exclusive-list":
				jqueryElem = exclusiveList(props);
				break;
			case "input":
				jqueryElem = input(props);
				break;
			case "search":
				// TODO implement
				break;
			case "selectable-list":
				jqueryElem = selectableList(props);
				break;
			case "slider":
				jqueryElem = slider(props);
				break;
			case "sliding-div":
				jqueryElem = slidingDiv(props);
				break;
			case "table":
				jqueryElem = table(props);
				break;
			case "text-area":
				jqueryElem = textArea(props);
				break;
			default:
				jqueryElem = commons.getOrCreateElem(type, props);
				break;
			}

			if (jqueryElem) {
				var elem = jqueryElem.get(0);
				bus.send("ui:created", elem);
				return elem;
			}
		}
	}
});
