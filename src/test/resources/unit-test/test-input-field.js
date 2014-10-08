describe("ui-input-field", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-input-field", [ $, _bus ]);
	});

	it("creates div on ui-input-field:create", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#myinput").length).toBe(1);
	});

	it("adds label if specified on create", function() {
		var text = "Input: ";
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId,
			label : text
		});

		var label = $("#myinput").find("label");
		expect(label.length).toBe(1);
		expect(label.text()).toEqual(text);
	});

	it("sets input type if specified on create", function() {
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId,
			type : "password"
		});

		var input = $("#myinput").find("input");
		expect(input.length).toBe(1);
		expect(input.attr("type")).toBe("password");
	});

	it("fills message on -field-value-fill", function() {
		var inputText = "Input Text";
		_bus.send("ui-input-field:create", {
			div : "myinput",
			parentDiv : parentId
		});
		$("#myinput").find("input").val(inputText);

		var message = {};
		_bus.send("myinput-field-value-fill", message);
		expect(message["myinput"]).toEqual(inputText);
	});
});