define([ "geoladris-tests" ], function(tests) {
	describe("ui-selectable-list", function() {
		var bus;
		var injector;
		var module;
		var parentId = "parent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-selectable-list" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("adds a checkbox", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});
			input = $(input);

			expect(input.length).toBe(1);
			expect(input.attr("type")).toBe("checkbox");
		});

		it("triggers input click on checkbox text clicked", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});
			input = $(input);

			var clicked;
			input.click(function() {
				clicked = true;
			})

			$("#" + parentId).find(".selectable-list-text").click();
			expect(clicked).toBe(true);
		});
	});
});