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

		it("creates a table on ui-exclusive-list:create", function() {
			module({
				id : "mylist",
				parent : parentId
			});

			var children = $("#" + parentId).children();
			expect(children.length).toBe(1);
			expect($(children[0]).children("table").length).toBe(1);
		});

		it("adds radio button to table on add-item", function() {
			module({
				id : "mylist",
				parent : parentId
			});

			bus.send("ui-exclusive-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("input");
			expect(input.length).toBe(1);
			expect(input.attr("type")).toEqual("radio");
			expect(input.attr("name")).toEqual("mylist");
			expect(input.attr("id")).toEqual("myitem");
		});

		it("sends item-selected on radio button selected", function() {
			module({
				id : "mylist",
				parent : parentId
			});

			bus.send("ui-exclusive-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("input");
			input[0].checked = true;
			input.trigger("change");

			expect(bus.send).toHaveBeenCalledWith("ui-exclusive-list:mylist:item-selected", "myitem");
		});

		it("sends item-selected on text clicked", function() {
			module({
				id : "mylist",
				parent : parentId
			});

			bus.send("ui-exclusive-list:mylist:add-item", {
				id : "myitem",
				text : "Item 1"
			});

			var input = $("#mylist").find("input");
			input[0].checked = true;
			input.trigger("change");

			var text = $("#mylist").find("td.exclusive-list-text");
			text.trigger("click");

			expect(bus.send).toHaveBeenCalledWith("ui-exclusive-list:mylist:item-selected", "myitem");
		});

		it("sets the right item on set-item", function() {
			var list = "myexclusivelist";
			module({
				id : list,
				parent : parentId
			});

			bus.send("ui-exclusive-list:" + list + ":add-item", {
				id : "myitem1",
				text : "Item 1"
			});
			bus.send("ui-exclusive-list:" + list + ":add-item", {
				id : "myitem2",
				text : "Item 2"
			});

			expect($("#myitem2").get(0).checked).toBe(false);
			bus.send("ui-exclusive-list:" + list + ":set-item", "myitem2");
			expect($("#myitem2").get(0).checked).toBe(true);
		});
	});
});