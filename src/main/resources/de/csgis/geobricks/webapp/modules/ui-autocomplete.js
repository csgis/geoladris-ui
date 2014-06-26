define([ "jquery", "message-bus", "typeahead" ], function($, bus) {
	bus.listen("ui-autocomplete:create", function(e, msg) {
		var div = $("<div/>").attr("id", msg.div);

		var input = $("<input/>");
		input.attr("type", "text");
		input.attr("placeholder", msg.placeholder);

		var icon = $("<div/>").addClass("autocomplete-icon")

		div.append(input);
		div.append(icon);
		$("#" + msg.parentDiv).append(div);

		div.addClass(msg.css);
		div.addClass("autocomplete");
		input.addClass("typeahead");
		input.addClass("autocomplete-input");
		icon.addClass("autocomplete-icon");

		input.typeahead({
			hint : true,
			highlight : true,
			minLength : 1,
			autoselect : true
		}, {
			source : function(q, cb) {
				var matches = [];
				var regex = new RegExp(q, 'i');

				$.each(msg.options, function(i, option) {
					if (regex.test(option)) {
						matches.push({
							value : option
						});
					}
				});

				cb(matches.slice(0,5));
			}
		});

		var eventName = "ui-autocomplete:" + msg.div + ":selected";

		input.keypress(function(event) {
			if (event.which == 13) {
				bus.send(eventName, input.typeahead("val"));
			}
		});

		icon.click(function() {
			bus.send(eventName, input.typeahead("val"));
		});

		input.on('typeahead:selected', function(event, selection) {
			bus.send(eventName, selection.value);
		});
	});
});