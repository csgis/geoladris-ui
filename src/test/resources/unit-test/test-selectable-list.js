describe("ui-selectable-list", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);

		_initModule("ui-selectable-list", [ $, _bus, commons ]);
	});

	it("adds a div on create", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#mylist").length).toBe(1);
	});

	it("adds a checkbox on add-item", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});
		_bus.send("ui-selectable-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("input");
		expect(input.length).toBe(1);
		expect(input.attr("type")).toBe("checkbox");
	});

	it("removes the checkbox on remove-item", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});
		_bus.send("ui-selectable-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});
		_bus.send("ui-selectable-list:mylist:remove-item", "myitem");

		var input = $("#mylist").find("input");
		expect(input.length).toBe(0);
	});

	it("sets the checkbox state on set-item", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});
		_bus.send("ui-selectable-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});
		_bus.send("ui-selectable-list:mylist:set-item", {
			id : "myitem",
			selected : true
		});

		var input = $("#mylist").find("input");
		expect(input.length).toBe(1);
		expect(input[0].checked).toBe(true);
	});

	it("sends event on checkbox checked", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});
		_bus.send("ui-selectable-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("input");
		input[0].checked = true;
		input.trigger("change");
		expect(_bus.send).toHaveBeenCalledWith("ui-selectable-list:mylist:item-selected", "myitem");
	});

	it("sends event on checkbox unchecked", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});
		_bus.send("ui-selectable-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("input");
		input[0].checked = false;
		input.trigger("change");
		expect(_bus.send).toHaveBeenCalledWith("ui-selectable-list:mylist:item-unselected", "myitem");
	});

	it("sends event on checkbox text clicked", function() {
		_bus.send("ui-selectable-list:create", {
			div : "mylist",
			parentDiv : parentId
		});
		_bus.send("ui-selectable-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("div.selectable-list-text");
		input.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith("ui-selectable-list:mylist:item-selected", "myitem");
	});
});