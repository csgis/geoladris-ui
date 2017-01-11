define([ "jquery", "message-bus", "./ui-commons", "./ui-buttons" ], function($, bus, commons, buttons) {
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

		var div = $("<div/>").attr("id", msg.id);
		div.addClass(msg.css);
		div.addClass("dialog");

		container.append(div);
		$("#" + msg.parent).append(container);

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

	bus.listen("ui-confirm-dialog:create", function(e, msg) {
		msg.modal = true;
		msg.css = (msg.css || "") + " ui-confirm-dialog";
		if (!msg.messages) {
			msg.messages = {};
		}

		create(msg);

		if (msg.messages.question) {
			commons.getOrCreateElem("div", {
				id : msg.id + "-message",
				parent : msg.id,
				css : "ui-confirm-dialog-message"
			});
			$("#" + msg.id + "-message").html(msg.messages["question"]);
		}

		var buttonsContainer = msg.id + "-confirm-buttons-container";
		commons.getOrCreateElem("div", {
			id : buttonsContainer,
			parent : msg.id,
			css : "ui-confirm-dialog-buttons-container"
		});
		buttons({
			id : msg.id + "-ok",
			parent : buttonsContainer,
			css : "dialog-ok-button ui-confirm-dialog-ok",
			text : msg.messages.ok,
			sendEventName : "ui-confirm-dialog:" + msg.id + ":ok"
		});
		buttons({
			id : msg.id + "-cancel",
			parent : buttonsContainer,
			css : "dialog-ok-button ui-confirm-dialog-cancel",
			text : msg.messages.cancel,
			sendEventName : "ui-confirm-dialog:" + msg.id + ":cancel"
		});

		bus.listen("ui-confirm-dialog:" + msg.id + ":cancel", function() {
			bus.send("ui-hide", msg.id);
		});

		bus.listen("ui-confirm-dialog:" + msg.id + ":ok", function() {
			bus.send("ui-hide", msg.id);
		});
	});

	function create(msg) {
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
	}

	return create;
});
