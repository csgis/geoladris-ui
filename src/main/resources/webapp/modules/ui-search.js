define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	bus.listen("ui-search-box:create", function(e, msg) {
		var placeholderClass = "search-placeholder";

		var input = $("<input type='text' placeholder='" + msg.placeholder + "'>");
		input.addClass(placeholderClass);
		input.addClass("search-input");

		input.focus(function() {
			if (input.val() == input.attr("placeholder")) {
				input.val("");
				input.removeClass(placeholderClass);
			}
		}).blur(function() {
			if (input.val() == "" || input.val() == input.attr("placeholder")) {
				input.addClass(placeholderClass);
				input.val(input.attr("placeholder"));
			}
		}).blur();

		input.keypress(function(e) {
			if (e.which == 13) {
				bus.send("ui-search-box:" + msg.div + ":search", input.val());
				return false;
			}
		});

		var div = commons.getOrCreateDiv(msg);
		div.append(input);
		div.addClass("search");

		if (msg.icon) {
			var icon = $("<div/>");
			icon.addClass("search-icon");
			icon.click(function() {
				bus.send("ui-search-box:" + msg.div + ":search", input.val());
			});
			div.append(icon);
		}
	});

	bus.listen("ui-search-results:create", function(e, msg) {
		bus.send("ui-dialog:create", {
			div : msg.div,
			parentDiv : msg.parentDiv,
			css : "search-results-div",
			title : msg.title,
			visible : msg.visible,
			closeButton : true
		});

		var id = msg.div;
		var list = $("<ul/>").attr("id", msg.div + "-list");
		list.addClass("search-results-list");
		$("#" + id).append(list);

		bus.listen("ui-search-results:" + id + ":clear", function() {
			$("#" + id + "-list").empty();
		});

		bus.listen("ui-search-results:" + id + ":add", function(e, value) {
			var li = $("<li/>").text(value);
			li.addClass("search-results-result");
			li.click(function() {
				bus.send("ui-search-results:" + id + ":selected", value);
			});
			$("#" + id + "-list").append(li);
			$("#" + id + "-list").scrollTop(0);
		});
	});
});