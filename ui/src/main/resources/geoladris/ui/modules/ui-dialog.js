define([ "jquery", "message-bus", "./ui-commons" ], function($, bus, commons) {
	var zIndex;

	function showOnTop(container) {
		var i = parseInt(container.css("z-index"));
		if (!zIndex) {
			zIndex = i + 1;
		} else {
			container.css("z-index", zIndex++);
		}
	}

	function createDialog(msg) {
		var container = commons.getOrCreateElem("div", {
			id : msg.id + "-dialog-container",
			parent : msg.parent,
			css : "dialog-container"
		});

		if (msg.modal) {
			container.addClass("dialog-modal");
		}

		var div = commons.getOrCreateElem("div", {
			id : msg.id,
			parent : container[0],
			css : "dialog " + (msg.css || "")
		});

		bus.listen("ui-show", function(e, id) {
			if (id == msg.id) {
				container.show();
				showOnTop(container);
			}
		});
		bus.listen("ui-hide", function(e, id) {
			if (id == msg.id) {
				container.hide();
			}
		});
		bus.listen("ui-toggle", function(e, id) {
			if (id == msg.id) {
				container.toggle();
				if (container.css("display") != "none") {
					showOnTop(container);
				}
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
				bus.send("ui-hide", msg.id);
			});
		}

		return div;
	}

	return function(msg) {
		var div = $("#" + msg.id);
		if (div.length === 0) {
			div = createDialog(msg);
		}

		if (msg.visible) {
			bus.send("ui-show", msg.id);
		} else {
			bus.send("ui-hide", msg.id);
		}

		return div;
	};
});
