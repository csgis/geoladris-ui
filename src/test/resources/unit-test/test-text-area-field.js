describe("ui-text-area-field", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-text-area-field", [ $, _bus ]);
	});

	it("creates a textarea with a label on create", function() {
		_bus.send("ui-text-area-field:create", {
			div : "myarea",
			parentDiv : parentId,
			label : "Text: "
		});

		expect($("#" + parentId).children().length).toBe(1);

		var area = $("#" + parentId).children("#myarea");
		expect(area.length).toBe(1);
		expect(area.children().length).toBe(2);
		expect(area.children("textarea").length).toBe(1);
		expect(area.children("label").length).toBe(1);
		expect(area.children("label").text()).toBe("Text: ");
	});

	it("sets rows and cols if specified on create", function() {
		_bus.send("ui-text-area-field:create", {
			div : "myarea",
			parentDiv : parentId,
			label : "Text: ",
			rows : 4,
			cols : 20
		});

		var area = $("#" + parentId).children("#myarea");
		expect(area.children("textarea").attr("rows")).toEqual("4");
		expect(area.children("textarea").attr("cols")).toEqual("20");
	});

	it("sets value to the textarea on set-value", function() {
		_bus.send("ui-text-area-field:create", {
			div : "myarea",
			parentDiv : parentId,
			label : "Text: ",
			rows : 4,
			cols : 20
		});

		_bus.send("ui-text-area-field:myarea:set-value", "mytext");
		var area = $("#" + parentId).children("#myarea");
		expect(area.children("textarea").val()).toEqual("mytext");
	});

	it("fills message on -field-value-fill", function() {
		_bus.send("ui-text-area-field:create", {
			div : "myarea",
			parentDiv : parentId,
			label : "Text: "
		});
		
		var content = "This is the textarea content";
		var area = $("#" + parentId).children("#myarea");
		area.children("textarea").val(content);
		
		var message = {};
		_bus.send("myarea-field-value-fill", message);
		expect(message["myarea"]).toEqual(content);
	});
});