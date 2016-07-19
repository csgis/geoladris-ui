describe("ui-choice-field", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-choice-field", [ $, _bus, commons ]);
	});

	it("creates div on ui-choice-field:create", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#mychoice").length).toBe(1);
	});

	it("adds label if specified on create", function() {
		var text = "Choice: ";
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			label : text
		});

		var label = $("#mychoice").find("label");
		expect(label.length).toBe(1);
		expect(label.text()).toEqual(text);
	});

	it("adds values if specified on create", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		var combo = $("#mychoice").find("select");
		expect(combo.length).toBe(1);
		expect(combo.children().length).toBe(3);
	});

	it("fills message on -field-value-fill", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		var message = {};
		_bus.send("mychoice-field-value-fill", message);
		expect(message["mychoice"]).toEqual("One");
	});

	it("adds value on add-value", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		_bus.send("ui-choice-field:mychoice:add-value", "Four");

		var combo = $("#mychoice").find("select");
		expect(combo.length).toBe(1);
		expect(combo.children().length).toBe(4);
	});

	it("sets values on set-values", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		_bus.send("ui-choice-field:mychoice:set-values", [ [ "1", "2" ] ]);

		var combo = $("#mychoice").find("select");
		expect(combo.length).toBe(1);
		expect(combo.children("option:eq(0)").text()).toBe("1");
		expect(combo.children("option:eq(1)").text()).toBe("2");
	});

	it("sends value-changed", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		_bus.send("ui-choice-field:mychoice:add-value", "Four");

		$("#mychoice").find("select").val("Two").change();
		expect(_bus.send).toHaveBeenCalledWith("ui-choice-field:mychoice:value-changed", "Two");
	});

	it("changes option on set-value", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		var select = $("#mychoice").find("select");
		expect(select.val()).toBe("One");
		_bus.send("ui-choice-field:mychoice:set-value", "Two");
		expect(select.val()).toBe("Two");
	});
	
	it("sets option if sent null on set-value", function() {
		_bus.send("ui-choice-field:create", {
			div : "mychoice",
			parentDiv : parentId,
			values : [ "One", "Two", "Three" ]
		});

		var select = $("#mychoice").find("select");
		_bus.send("ui-choice-field:mychoice:set-value", "Two");
		expect(select.val()).toBe("Two");
		_bus.send("ui-choice-field:mychoice:set-value", null);
		expect(select.val()).toBe("One");
	});
});