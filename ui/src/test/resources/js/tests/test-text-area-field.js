define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;
	var textArea;

	describe("ui-text-area-field", function() {
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-text-area-field" ], function(module) {
				textArea = module;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates a textarea with a label on create", function() {
			textArea({
				id : "myarea",
				parent : parentId,
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
			textArea({
				id : "myarea",
				parent : parentId,
				label : "Text: ",
				rows : 4,
				cols : 20
			});

			var area = $("#" + parentId).children("#myarea");
			expect(area.children("textarea").attr("rows")).toEqual("4");
			expect(area.children("textarea").attr("cols")).toEqual("20");
		});

		it("sets value to the textarea on set-value", function() {
			textArea({
				id : "myarea",
				parent : parentId,
				label : "Text: ",
				rows : 4,
				cols : 20
			});

			bus.send("ui-text-area-field:myarea:set-value", "mytext");
			var area = $("#" + parentId).children("#myarea");
			expect(area.children("textarea").val()).toEqual("mytext");
		});

		it("fills message on -field-value-fill", function() {
			textArea({
				id : "myarea",
				parent : parentId,
				label : "Text: "
			});

			var content = "This is the textarea content";
			var area = $("#" + parentId).children("#myarea");
			area.children("textarea").val(content);

			var message = {};
			bus.send("myarea-field-value-fill", message);
			expect(message["myarea"]).toEqual(content);
		});

		it("sets input value on set-value", function() {
			var inputText = "Input text";
			var anotherText = "Another text";

			textArea({
				id : "myinput",
				parent : parentId
			});
			$("#myinput").find("textarea").val(inputText);

			bus.send("ui-text-area-field:myinput:set-value", anotherText);
			expect($("#myinput").find("textarea").val()).toEqual(anotherText);
		});

		it("appends text on append", function() {
			var inputText = "Input text";
			var anotherText = "Another text";

			textArea({
				id : "myinput",
				parent : parentId
			});
			$("#myinput").find("textarea").val(inputText);

			bus.send("ui-text-area-field:myinput:append", anotherText);
			expect($("#myinput").find("textarea").val()).toEqual(inputText + anotherText);
		});

		it("sends ui-text-area-field:<id>:value-changed", function() {
			textArea({
				id : "myinput",
				parent : parentId
			});

			var area = $("#myinput").find("textarea");
			area.val("foo");
			area.change();
			expect(bus.send).toHaveBeenCalledWith("ui-text-area-field:myinput:value-changed", "foo");
		});
	});
});