define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-search-box:create", function(e, msg) {
		var placeholderClass = "search-placeholder";

		var input = $("<input type='text' placeholder='" + msg.placeholder + "'>");
		input.addClass(placeholderClass);
		input.addClass("ui-search-input");

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

		var div = $("<div/>").attr("id", msg.div);
		div.append(input);
		div.addClass("ui-search-div");
		div.addClass(msg.css);

		if (msg.icon) {
			var icon = $("<div/>");
			icon.addClass("ui-search-icon");
			icon.click(function() {
				bus.send("ui-search-box:" + msg.div + ":search", input.val());
			});
			div.append(icon);
		}

		$("#" + msg.parentDiv).append(div);
	});

	bus.listen("ui-search-results:create", function(e, msg) {
		var id = msg.div;

		var div = $("<div/>").attr("id", id);
		var title = $("<div>" + msg.title + "</div>");
		var close = $("<div/>");
		var list = $("<ul/>").attr("id", msg.div + "-list");

		div.append(title);
		div.append(close);
		div.append(list);

		div.addClass(msg.css);
		div.addClass("ui-search-results-div");
		title.addClass("ui-search-results-title");
		close.addClass("ui-search-results-close");
		list.addClass("ui-search-results-list");

		$("#" + msg.parentDiv).append(div);

		if (msg.visible) {
			div.show();
		} else {
			div.hide();
		}

		close.click(function() {
			bus.send("ui-hide", id);
		});

		bus.listen("ui-search-results:" + id + ":clear", function() {
			$("#" + id + "-list").empty();
		});

		bus.listen("ui-search-results:" + id + ":add", function(e, value) {
			var li = $("<li/>").text(value);
			li.addClass("ui-search-results-result");
			li.click(function() {
				bus.send("ui-search-results:" + id + ":selected", value);
			});
			$("#" + id + "-list").append(li);
		});
	});

});