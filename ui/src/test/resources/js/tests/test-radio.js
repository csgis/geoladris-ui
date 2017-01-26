define([ "geoladris-tests" ], function(tests) {
	describe("radio", function() {
		var bus;
		var injector;
		var module;
		var parentId = "parent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-radio" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates a radio button", function() {
			var input = module({
				id : "myitem",
				text : "Item 1",
				parent : parentId
			});

			expect(input.length).toBe(1);
			expect(input.attr("type")).toEqual("radio");
			expect(input.attr("name")).toEqual(parentId);
			expect(input.attr("id")).toEqual("myitem");

			var container = $("#" + parentId).children(".ui-radio-container");
			expect(container.children(".ui-radio-input").length).toBe(1);
			expect(container.children(".ui-radio-text").length).toBe(1);
		});

		it("clicks input on text clicked", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});

			var clicked;
			input.click(function() {
				clicked = true;
			});

			var text = $("#" + parentId).find(".ui-radio-text");
			text.click();
			expect(clicked).toBe(true);
		});
	});
});