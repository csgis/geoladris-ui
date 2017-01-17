define([ "geoladris-tests" ], function(tests) {
	describe("ui-input-field", function() {
		var bus;
		var injector;
		var module;
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {}, {
				"pikaday" : "../jslib/pikaday/1.5.1/pikaday",
				"pikaday.jquery" : "../jslib/pikaday/1.5.1/pikaday.jquery"
			});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-input-field" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates div on ui-input-field:create", function() {
			module({
				id : "myinput",
				parent : parentId
			});

			expect($("#" + parentId).children().length).toBe(1);
			expect($("#" + parentId).children("#myinput").length).toBe(1);
		});

		it("adds label if specified on create", function() {
			var text = "Input: ";
			module({
				id : "myinput",
				parent : parentId,
				label : text
			});

			var label = $("#myinput").find("label");
			expect(label.length).toBe(1);
			expect(label.text()).toEqual(text);
		});

		it("sets input type if specified on create", function() {
			module({
				id : "myinput",
				parent : parentId,
				type : "password"
			});

			var input = $("#myinput").find("input");
			expect(input.length).toBe(1);
			expect(input.attr("type")).toBe("password");
		});

		it("fills message on -field-value-fill", function() {
			var inputText = "Input Text";
			module({
				id : "myinput",
				parent : parentId
			});
			$("#myinput").find("input").val(inputText);

			var message = {};
			bus.send("myinput-field-value-fill", message);
			expect(message["myinput"]).toEqual(inputText);
		});

		it("sets input value and sends value-changed on set-value", function() {
			var inputText = "Input text";
			var anotherText = "Another text";

			module({
				id : "myinput",
				parent : parentId
			});
			$("#myinput").find("input").val(inputText);

			expect(bus.send).not.toHaveBeenCalledWith("ui-input-field:myinput:value-changed", anotherText);
			bus.send("ui-input-field:myinput:set-value", anotherText);
			expect($("#myinput").find("input").val()).toEqual(anotherText);
			expect(bus.send).toHaveBeenCalledWith("ui-input-field:myinput:value-changed", anotherText);
		});

		it("appends text on append", function() {
			var inputText = "Input text";
			var anotherText = "Another text";

			module({
				id : "myinput",
				parent : parentId
			});
			$("#myinput").find("input").val(inputText);

			bus.send("ui-input-field:myinput:append", anotherText);
			expect($("#myinput").find("input").val()).toEqual(inputText + anotherText);
		});

		it("adds placeholder if type is file", function() {
			module({
				id : "myinput",
				parent : parentId,
				type : "file"
			});
			var placeholder = $("#myinput").find(".ui-file-input-placeholder");
			expect(placeholder.length).toBe(1);
		});

		it("sets placeholder text on 'set-value' and 'append' if type is file", function() {
			module({
				id : "myinput",
				parent : parentId,
				type : "file"
			});

			bus.send("ui-input-field:myinput:set-value", "IMG_1047.jpg");

			var placeholder = $("#myinput").find(".ui-file-input-placeholder");
			expect(placeholder.text()).toBe("IMG_1047.jpg");

			bus.send("ui-input-field:myinput:append", "/IMG_1047.jpg");
			expect(placeholder.text()).toBe("IMG_1047.jpg/IMG_1047.jpg");
		});

		it("sends ui-input-field:<id>:value-changed", function() {
			module({
				id : "myinput",
				parent : parentId
			});

			var input = $("#myinput").find("input");
			input.val("foo");
			input.change();
			expect(bus.send).toHaveBeenCalledWith("ui-input-field:myinput:value-changed", "foo");
		});

		it("adds step=any for number fields", function() {
			module({
				id : "myinput",
				type : "number",
				parent : parentId
			});

			var input = $("#myinput").find("input");
			expect(input.attr("step")).toBe("any");
		});

		it("fills values with actual types (number, date,...) instead of strings", function() {
			module({
				id : "mynumber",
				type : "number",
				parent : parentId
			});
			module({
				id : "mydate",
				type : "date",
				parent : parentId
			});

			var number = $("#mynumber").find("input");
			number.val(57.6);
			var date = $("#mydate").find("input");
			date.val("2016-06-10");

			var message = {};
			bus.send("mynumber-field-value-fill", message);
			expect(message["mynumber"]).toEqual(57.6);
			expect(typeof message["mynumber"]).toBe("number");

			message = {};
			bus.send("mydate-field-value-fill", message);
			expect(message["mydate"]).toEqual("2016-06-10T00:00:00.000Z");
			expect(typeof message["mydate"]).toBe("string");
		});
	});
});