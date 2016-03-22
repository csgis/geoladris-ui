describe("ui-dialog", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-dialog", [ $, _bus, commons ]);
	});

	it("creates div on ui-dialog:create", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId
		});

		var container = $("#" + parentId).children();
		expect(container.length).toBe(1);
		expect(container.children("#mydialog").length).toBe(1);
	});

	it("does not create the same dialog twice", function() {
		for (var i = 0; i < 10; i++) {
			_bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId
			});
		}

		var container = $("#" + parentId).children();
		expect(container.length).toBe(1);
		expect(container.children("#mydialog").length).toBe(1);
	});

	it("hides the dialog on init if !visible specified", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId
		});
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
	});

	it("shows the dialog on init if visible specified", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			visible : true
		});
		expect(_bus.send).toHaveBeenCalledWith("ui-show", "mydialog");
	});

	it("adds a shade behind the dialog if modal", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			modal : true
		});

		var container = $("#" + parentId).children();
		expect(container).not.toEqual($("#" + parentId).find("#mydialog"));
		expect(container.hasClass("dialog-modal")).toBe(true);
	});

	it("adds a title if specified", function() {
		var text = "Dialog Title";
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			title : text
		});

		var title = $("#mydialog").children(".dialog-title");
		expect(title.length).toBe(1);
		expect(title.text()).toBe(text);
	});

	it("adds a close button if specified", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			closeButton : true
		});

		var close = $("#mydialog").children(".dialog-close");
		expect(close.length).toBe(1);
	});

	it("hides the dialog on close button clicked", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			closeButton : true
		});

		var close = $("#mydialog").children(".dialog-close");
		close.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
	});

	it("hides the shade when dialog is hidden if modal", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			modal : true,
			visible : true
		});

		expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
		_bus.send("ui-hide", "mydialog");
		expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
	});
	it("shows the shade when dialog is shown if modal", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			modal : true,
			visible : false
		});

		expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
		_bus.send("ui-show", "mydialog");
		expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
	});

	it("toggles the shade when dialog is toggled if modal", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			modal : true,
			visible : true
		});

		expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
		_bus.send("ui-toggle", "mydialog");
		expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
	});

	it("shows the latest dialog on top of the others when ui-show", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			visible : false
		});
		_bus.send("ui-dialog:create", {
			div : "mydialog2",
			parentDiv : parentId,
			visible : false
		});

		var container1 = $("#mydialog").parent();
		var container2 = $("#mydialog2").parent();

		// Mock CSS rules
		var cssRules = {
			"position" : "absolute",
			"z-index" : 2000,
			"display" : "none"
		};
		container1.css(cssRules);
		container2.css(cssRules);

		_bus.send("ui-show", "mydialog");
		expect(container1.css("z-index")).toBe("2000");
		expect(container2.css("z-index")).toBe("2000");
		_bus.send("ui-show", "mydialog2");
		expect(container1.css("z-index")).toBe("2000");
		expect(container2.css("z-index")).toBe("2001");
		_bus.send("ui-toggle", "mydialog2");
		_bus.send("ui-toggle", "mydialog2");
		expect(container2.css("z-index")).toBe("2002");
	});

	it("creates a modal dialog ui-confirm-dialog:create", function() {
		var messages = {
			question : "??",
			ok : "Yes",
			cancel : "No"
		};
		_bus.send("ui-confirm-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			css : "mydialog-class",
			modal : false,
			messages : messages
		});

		var container = $("#" + parentId).children();
		expect(container.length).toBe(1);
		var dialog = container.children("#mydialog");
		expect(dialog.length).toBe(1);

		expect(_bus.send).toHaveBeenCalledWith("ui-dialog:create", jasmine.objectContaining({
			div : "mydialog",
			parentDiv : parentId,
			modal : true,
			css : "mydialog-class ui-confirm-dialog"
		}));
		expect(_bus.send).toHaveBeenCalledWith("ui-button:create", jasmine.objectContaining({
			div : "mydialog-ok",
			css : "dialog-ok-button ui-confirm-dialog-ok",
			text : messages.ok,
			sendEventName : "ui-confirm-dialog:mydialog:ok"
		}));
		expect(_bus.send).toHaveBeenCalledWith("ui-button:create", jasmine.objectContaining({
			div : "mydialog-cancel",
			css : "dialog-ok-button ui-confirm-dialog-cancel",
			text : messages.cancel,
			sendEventName : "ui-confirm-dialog:mydialog:cancel"
		}));
	});

	it("hides the confirm dialog on ok", function() {
		_bus.send("ui-confirm-dialog:create", {
			div : "mydialog",
			parentDiv : parentId
		});
		var container = $("#" + parentId).children();
		var dialog = container.children("#mydialog");
		_bus.send("ui-confirm-dialog:mydialog:ok");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
	});

	it("hides the confirm dialog on cancel", function() {
		_bus.send("ui-confirm-dialog:create", {
			div : "mydialog",
			parentDiv : parentId
		});

		var container = $("#" + parentId).children();
		var dialog = container.children("#mydialog");
		_bus.send("ui-confirm-dialog:mydialog:cancel");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
	});
});