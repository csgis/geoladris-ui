define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	function visibility(id, visible) {
		if (visible !== undefined) {
			var div = $("#" + id);
			if (visible) {
				bus.send("ui-show", id);
			} else {
				bus.send("ui-hide", id);
			}
		}
	}

	return function(props) {
		var container = commons.getOrCreateElem("div", {
			id : props.id + "-container",
			parent : props.parent
		});
		var header = $("<div/>").attr("id", props.id + "-header");
		var content = $("<div/>").attr("id", props.id);
		var headerText = $("<p/>").text(props.title);

		header.addClass("accordion-header");
		headerText.addClass("accordion-header-text");

		header.click(function() {
			content.slideToggle({
				duration : 300
			});
		});

		if (props.visible) {
			content.show();
		} else {
			content.hide();
		}

		header.append(headerText);
		container.append(header);
		container.append(content);

		bus.listen("ui-accordion-group:" + props.id + ":visibility", function(e, msg) {
			visibility(props.id + "-header", msg.header);
			visibility(props.id, msg.content);
		});

		return container;
	};
});
