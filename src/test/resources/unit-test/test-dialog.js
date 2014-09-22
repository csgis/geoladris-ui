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

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#mydialog").length).toBe(1);
	});

	it("does not create the same dialog twice", function() {
		for (var i = 0; i < 10; i++) {
			_bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId
			});
		}

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#mydialog").length).toBe(1);
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

		var child = $($("#" + parentId).children()[0]);
		expect($("#" + parentId).children().length).toBe(1);
		expect(child).not.toEqual($("#" + parentId).children("#mydialog"));
		expect(child.hasClass("dialog-shade")).toBe(true);
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

		expect($("#" + parentId).children(".dialog-shade").css("display")).not.toBe("none");
		_bus.send("ui-hide", "mydialog");
		expect($("#" + parentId).children(".dialog-shade").css("display")).toBe("none");
	});
	it("shows the shade when dialog is shown if modal", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			modal : true,
			visible : false
		});

		expect($("#" + parentId).children(".dialog-shade").css("display")).toBe("none");
		_bus.send("ui-show", "mydialog");
		expect($("#" + parentId).children(".dialog-shade").css("display")).not.toBe("none");
	});

	it("toggles the shade when dialog is toggled if modal", function() {
		_bus.send("ui-dialog:create", {
			div : "mydialog",
			parentDiv : parentId,
			modal : true,
			visible : true
		});

		expect($("#" + parentId).children(".dialog-shade").css("display")).not.toBe("none");
		_bus.send("ui-toggle", "mydialog");
		expect($("#" + parentId).children(".dialog-shade").css("display")).toBe("none");
	});
});