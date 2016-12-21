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
				showOnTop(container);
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
				bus.send("ui-hide", msg.div);
			});
		}

		return div;
	}

	bus.listen("ui-dialog:create", function(e, msg) {
		var div = $("#" + msg.div);
		if (div.length === 0) {
			div = createDialog(msg);
		}

		if (msg.visible) {
			bus.send("ui-show", msg.div);
		} else {
			bus.send("ui-hide", msg.div);
		}
	});

	bus.listen("ui-confirm-dialog:create", function(e, msg) {
		msg.modal = true;
		msg.css = (msg.css || "") + " ui-confirm-dialog";
		if (!msg.messages) {
			msg.messages = {};
		}

		bus.send("ui-dialog:create", msg);

		if (msg.messages.question) {
			bus.send("ui-html:create", {
				div : msg.div + "-message",
				parentDiv : msg.div,
				css : "ui-confirm-dialog-message",
				html : msg.messages.question
			});
		}

		var buttonsContainer = msg.div + "-confirm-buttons-container";
		bus.send("ui-html:create", {
			div : buttonsContainer,
			parentDiv : msg.div,
			css : "ui-confirm-dialog-buttons-container"
		});
		bus.send("ui-button:create", {
			div : msg.div + "-ok",
			parentDiv : buttonsContainer,
			css : "dialog-ok-button ui-confirm-dialog-ok",
			text : msg.messages.ok,
			sendEventName : "ui-confirm-dialog:" + msg.div + ":ok"
		});
		bus.send("ui-button:create", {
			div : msg.div + "-cancel",
			parentDiv : buttonsContainer,
			css : "dialog-ok-button ui-confirm-dialog-cancel",
			text : msg.messages.cancel,
			sendEventName : "ui-confirm-dialog:" + msg.div + ":cancel"
		});

		bus.listen("ui-confirm-dialog:" + msg.div + ":cancel", function() {
			bus.send("ui-hide", msg.div);
		});

		bus.listen("ui-confirm-dialog:" + msg.div + ":ok", function() {
			bus.send("ui-hide", msg.div);
		});
	});
});
