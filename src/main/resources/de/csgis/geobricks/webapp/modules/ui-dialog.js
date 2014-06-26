define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	function createDialog(msg) {
		var div = $("<div/>").attr("id", msg.div)
		div.addClass(msg.css);
		div.addClass("dialog");
		$("#" + msg.parentDiv).append(div);

		var title = $("<div/>").addClass("dialog-title");
		if (msg.title) {
			title.html(msg.title);
		}
		div.append(title);

		var dragging = false;
		var startX, startY;
		var startOffset;

		title.mousedown(function(event) {
			title.css('cursor', 'move');
			dragging = true;
			startX = event.clientX;
			startY = event.clientY;
			startOffset = div.offset();
		}).mouseup(function() {
			dragging = false;
			title.css('cursor', 'default');
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
			div.show();
		} else {
			div.hide();
		}
	});
});