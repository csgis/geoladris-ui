describe("ui-exclusive-list", function() {
	var parentId = "parent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.stopListenAll();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-exclusive-list", [ $, _bus, commons ]);
	});

	it("creates a table on ui-exclusive-list:create", function() {
		_bus.send("ui-exclusive-list:create", {
			div : "mylist",
			parentDiv : parentId
		});

		var children = $("#" + parentId).children();
		expect(children.length).toBe(1);
		expect($(children[0]).children("table").length).toBe(1);
	});

	it("adds radio button to table on add-item", function() {
		_bus.send("ui-exclusive-list:create", {
			div : "mylist",
			parentDiv : parentId
		});

		_bus.send("ui-exclusive-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("input");
		expect(input.length).toBe(1);
		expect(input.attr("type")).toEqual("radio");
		expect(input.attr("name")).toEqual("mylist");
		expect(input.attr("id")).toEqual("myitem");
	});

	it("removes the radio button from table on add-item", function() {
		_bus.send("ui-exclusive-list:create", {
			div : "mylist",
			parentDiv : parentId
		});

		var n = 5;
		for (var i = 0; i < n; i++) {
			_bus.send("ui-exclusive-list:mylist:add-item", {
				id : "myitem" + i,
				text : "Item " + i
			});
		}

		expect($("#mylist").find("input").length).toBe(5);
		_bus.send("ui-exclusive-list:mylist:remove-item", "myitem0");
		expect($("#mylist").find("input").length).toBe(4);
	});

	it("sends item-selected on radio button selected", function() {
		_bus.send("ui-exclusive-list:create", {
			div : "mylist",
			parentDiv : parentId
		});

		_bus.send("ui-exclusive-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("input");
		input[0].checked = true;
		input.trigger("change");

		expect(_bus.send).toHaveBeenCalledWith("ui-exclusive-list:mylist:item-selected", "myitem");
	});

	it("sends item-selected on text clicked", function() {
		_bus.send("ui-exclusive-list:create", {
			div : "mylist",
			parentDiv : parentId
		});

		_bus.send("ui-exclusive-list:mylist:add-item", {
			id : "myitem",
			text : "Item 1"
		});

		var input = $("#mylist").find("input");
		input[0].checked = true;
		input.trigger("change");

		var text = $("#mylist").find("td.exclusive-list-text");
		text.trigger("click");

		expect(_bus.send).toHaveBeenCalledWith("ui-exclusive-list:mylist:item-selected", "myitem");
	});

	it("sets the right item on set-item", function() {
		var list = "myexclusivelist";
		_bus.send("ui-exclusive-list:create", {
			div : list,
			parentDiv : parentId
		});

		_bus.send("ui-exclusive-list:" + list + ":add-item", {
			id : "myitem1",
			text : "Item 1"
		});
		_bus.send("ui-exclusive-list:" + list + ":add-item", {
			id : "myitem2",
			text : "Item 2"
		});

		expect($("#myitem2").get(0).checked).toBe(false);
		_bus.send("ui-exclusive-list:" + list + ":set-item", "myitem2");
		expect($("#myitem2").get(0).checked).toBe(true);
	});
});