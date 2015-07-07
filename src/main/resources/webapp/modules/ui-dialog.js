define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	function createDialog(msg) {
		var container = $("<div/>");
		container.addClass("dialog-container");
		if (msg.modal) {
			container.addClass("dialog-modal");
		}

		var div = $("<div/>").attr("id", msg.div);
		div.addClass(msg.css);
		div.addClass("dialog");

		container.append(div);
		$("#" + msg.parentDiv).append(container);

		bus.listen("ui-show", function(e, id) {
			if (id == msg.div) {
				container.show();
			}
		});
		bus.listen("ui-hide", function(e, id) {
			if (id == msg.div) {
				container.hide();
			}
		});
		bus.listen("ui-toggle", function(e, id) {
			if (id == msg.div) {
				container.toggle();
			}
		});

		var title = $("<div/>").addClass("dialog-title");
		if (msg.title) {
			title.html(msg.title);
		}
		div.append(title);

		var dragging = false;
		var startX, startY;
		var startOffset;

		var originalCursor = title.css("cursor");
		title.mousedown(function(event) {
			title.css('cursor', 'move');
			dragging = true;
			startX = event.clientX;
			startY = event.clientY;
			startOffset = div.offset();
		}).mouseup(function() {
			dragging = false;
			title.css('cursor', originalCursor);
		});

		$(window).mousemove(function(event) {
			if (!dragging) {
				return;
			}

			div.css({
				position : "fixed",
				top : startOffset.top + (event.clientY - startY),
				left : startOffset.left + (event.clientX - startX),
			});
		});

		if (msg.closeButton) {
			var close = $("<div/>").addClass("dialog-close");
			div.append(close);
			close.click(function() {
				bus.send("ui-hide", msg.div);
			});
		}

		return div;
	}

	bus.listen("ui-dialog:create", function(e, msg) {
		var div = $("#" + msg.div);
		if (div.length == 0) {
			div = createDialog(msg);
		}

		if (msg.visible) {
			bus.send("ui-show", msg.div);
		} else {
			bus.send("ui-hide", msg.div);
		}
	});
});