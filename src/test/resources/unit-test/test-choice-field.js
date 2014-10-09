describe("ui-choice-field", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-choice-field", [ $, _bus ]);
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
});