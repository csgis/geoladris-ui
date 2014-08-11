define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	var baseEventName = "ui-accordion";

	bus.listen(baseEventName + ":create", function(e, msg) {
		var accordion = commons.getOrCreateDiv(msg.div, msg.parentDiv);
		accordion.addClass(msg.css);
	});

	bus.listen(baseEventName + ":add-group", function(e, msg) {
		var accordionId = msg.accordion;
		var groupId = msg.id;
		var title = msg.title;
		var visible = msg.visible;

		var accordion = $("#" + accordionId);
		var header = $("<div/>").attr("id", groupId + "-header");
		var content = $("<div/>").attr("id", groupId);
		var headerText = $("<p/>").text(title);

		header.addClass("accordion-header");
		headerText.addClass("accordion-header-text");

		header.click(function() {
			content.slideToggle({
				duration : 300
			});
		});

		if (visible) {
			content.show();
		} else {
			content.hide();
		}

		header.append(headerText);
		accordion.append(header);
		accordion.append(content);
	});

	function visibility(id, visibility) {
		if (visibility !== undefined) {
			var div = $("#" + id);
			if (visibility) {
				div.show();
			} else {
				div.hide();
			}
		}
	}

	bus.listen("ui-accordion:visibility", function(e, msg) {
		visibility(msg.id + "-header", msg.header);
		visibility(msg.id, msg.content);
	});
});