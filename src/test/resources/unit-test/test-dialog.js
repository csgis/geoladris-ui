describe("ui-dialog", function() {
	var parentId = "myparent";

	beforeEach(function() {
		var previous = document.getElementById(parentId);
		if (previous) {
			document.body.removeChild(previous);
		}

		var parent = document.createElement('div');
		parent.setAttribute("id", parentId);
		document.body.appendChild(parent);

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
});