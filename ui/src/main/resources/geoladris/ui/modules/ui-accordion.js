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
		var containerCss = "";
		var headerCss = "";
		if (props.css) {
			containerCss = props.css.split("\s+").map(function(a) {
				return a + "-container";
			}).join(" ");
			headerCss = props.css.split("\s+").map(function(a) {
				return a + "-header";
			}).join(" ");
		}
		var container = commons.getOrCreateElem("div", {
			id : props.id + "-container",
			parent : props.parent,
			css : containerCss
		});

		var header = commons.getOrCreateElem("div", {
			id : props.id + "-header",
			parent : container,
			css : headerCss + " accordion-header"
		});
		var headerText = commons.getOrCreateElem("p", {
			parent : header,
			html : props.title,
			css : "accordion-header-text"
		});
		var content = commons.getOrCreateElem("div", {
			id : props.id,
			parent : container,
			css : props.css
		});

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

		bus.listen("ui-accordion-group:" + props.id + ":visibility", function(e, msg) {
			visibility(props.id + "-header", msg.header);
			visibility(props.id, msg.content);
		});

		return container;
	};
});
