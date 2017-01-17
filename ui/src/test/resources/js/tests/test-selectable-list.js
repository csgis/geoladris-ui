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

		it("adds a div on create", function() {
			module({
				id : "mylist",
				parent : parentId
			});

			expect($("#" + parentId).children().length).toBe(1);
			expect($("#" + parentId).children("#mylist").length).toBe(1);
		});

		it("adds a checkbox on add-item", function() {
			module({
				id : "mylist",
				parent : parentId
			});
			bus.send("ui-selectable-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("input");
			expect(input.length).toBe(1);
			expect(input.attr("type")).toBe("checkbox");
		});

		it("sets the checkbox state on set-item", function() {
			module({
				id : "mylist",
				parent : parentId
			});
			bus.send("ui-selectable-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});
			bus.send("ui-selectable-list:mylist:set-item", {
				id : "myitem",
				selected : true
			});

			var input = $("#mylist").find("input");
			expect(input.length).toBe(1);
			expect(input[0].checked).toBe(true);
		});

		it("sends event on checkbox checked", function() {
			module({
				id : "mylist",
				parent : parentId
			});
			bus.send("ui-selectable-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("input");
			input[0].checked = true;
			input.trigger("change");
			expect(bus.send).toHaveBeenCalledWith("ui-selectable-list:mylist:item-selected", "myitem");
		});

		it("sends event on checkbox unchecked", function() {
			module({
				id : "mylist",
				parent : parentId
			});
			bus.send("ui-selectable-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("input");
			input[0].checked = false;
			input.trigger("change");
			expect(bus.send).toHaveBeenCalledWith("ui-selectable-list:mylist:item-unselected", "myitem");
		});

		it("sends event on checkbox text clicked", function() {
			module({
				id : "mylist",
				parent : parentId
			});
			bus.send("ui-selectable-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("div.selectable-list-text");
			input.trigger("click");
			expect(bus.send).toHaveBeenCalledWith("ui-selectable-list:mylist:item-selected", "myitem");
		});
	});
});