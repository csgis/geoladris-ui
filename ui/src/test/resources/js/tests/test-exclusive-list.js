define([ "geoladris-tests" ], function(tests) {
	describe("ui-exclusive-list", function() {
		var bus;
		var injector;
		var module;
		var parentId = "parent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-exclusive-list" ], function(m) {
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

			input = $(input);
			expect(input.length).toBe(1);
			expect(input.attr("type")).toEqual("radio");
			expect(input.attr("name")).toEqual(parentId);
			expect(input.attr("id")).toEqual("myitem");
		});

		it("sends item-selected on radio button selected", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});

			input.checked = true;
			$(input).trigger("change");

			expect(bus.send).toHaveBeenCalledWith("ui-exclusive-list:" + parentId + ":item-selected", "myitem");
		});

		it("sends item-selected on text clicked", function() {
			var input = module({
				id : "myitem",
				parent : parentId,
				text : "Item 1"
			});

			input.checked = true;
			$(input).trigger("change");

			var text = $("#mylist").find("td.exclusive-list-text");
			text.trigger("click");

			expect(bus.send).toHaveBeenCalledWith("ui-exclusive-list:" + parentId + ":item-selected", "myitem");
		});
	});
});