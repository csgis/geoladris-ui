define([ "jquery", "message-bus", "module" ], function($, bus, module) {
	var CLOSED_CLASS = "handle-closed";
	var OPENED_CLASS = "handle-opened";

	var HANDLE_CLASS = "ui-sliding-div-handle";

	var config = module.config();

	if (!config.duration) {
		config.duration = 0;
	}

	function expand(id) {
		var div = $("#" + id);
		var handle = div.siblings("." + HANDLE_CLASS);

		div.slideDown(config.duration);
		handle.addClass(OPENED_CLASS);
		handle.removeClass(CLOSED_CLASS);
	}

	function collapse(id) {
		var div = $("#" + id);
		var handle = div.siblings("." + HANDLE_CLASS);

		div.slideUp(config.duration);
		handle.addClass(CLOSED_CLASS);
		handle.removeClass(OPENED_CLASS);
	}

	function toggle(id) {
		var div = $("#" + id);
		var handle = div.siblings("." + HANDLE_CLASS);

		if (handle.hasClass(CLOSED_CLASS)) {
			expand(id);
		} else {
			collapse(id);
		}
	}

	bus.listen("ui-sliding-div:create", function(e, msg) {
		// Container
		var container = $("<div/>");
		container.addClass(msg.css);
		container.addClass("ui-sliding-div-container");
		$("#" + msg.parentDiv).append(container);

		// Content div
		var div = $("<div/>").attr("id", msg.div);
		div.addClass(msg.css);
		div.addClass("ui-sliding-div-content");
		div.hide();
		container.append(div);

		// Handle div
		var handle = $("<div/>");
		handle.addClass(HANDLE_CLASS);
		handle.addClass(CLOSED_CLASS);
		container.append(handle);

		handle.click(function() {
			toggle(msg.div);
		});
	});

	bus.listen("ui-sliding-div:collapse", function(e, id) {
		collapse(id);
	});
	bus.listen("ui-sliding-div:expand", function(e, id) {
		expand(id);
	});
	bus.listen("ui-sliding-div:toggle", function(e, id) {
		toggle(id);
	});
});