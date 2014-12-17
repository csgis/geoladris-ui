define([ "jquery", "message-bus" ], function($, bus) {
	var CLOSED_CLASS = "handle-closed";
	var OPENED_CLASS = "handle-opened";

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
		handle.addClass(CLOSED_CLASS);
		handle.addClass("ui-sliding-div-handle");
		container.append(handle);

		handle.click(function() {
			if (handle.hasClass(CLOSED_CLASS)) {
				div.slideDown();
				handle.addClass(OPENED_CLASS);
				handle.removeClass(CLOSED_CLASS);
			} else {
				div.slideUp();
				handle.addClass(CLOSED_CLASS);
				handle.removeClass(OPENED_CLASS);
			}
		});
	});
});