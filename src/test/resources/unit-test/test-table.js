describe("ui-table", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-table", [ $, _bus ]);
	});

	it("creates an empty container on create", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		expect($("#mytable").length).toBe(1);
		expect($("#mytable").children().length).toBe(0);
	});

	it("sets data on set-data", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		expect($("#mytable").children("tr").length).toBe(0);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "a",
			number : 1
		}, {
			letter : "b",
			number : 2
		} ] ]);
		// 2 data rows + 1 header
		expect($("#mytable").find("tr").length).toBe(3);
	});

	it("replaces previous data on set-data", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		expect($("#mytable").children("tr").length).toBe(0);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "a",
			number : 1
		}, {
			letter : "b",
			number : 2
		} ] ]);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "c",
			number : 3
		} ] ]);
		// 1 data row + 1 header
		expect($("#mytable").find("tr").length).toBe(2);
	});

	it("clears table on clear", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "c",
			number : 3
		} ] ]);
		// 1 data row + 1 header
		expect($("#mytable").find("tr").length).toBe(2);
		_bus.send("ui-table:mytable:clear");
		expect($("#mytable").find("tr").length).toBe(0);
	});

	it("selects and sends data-selected on row click", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "a",
			number : "1"
		}, {
			letter : "b",
			number : "2"
		} ] ]);

		// index is 2 because row 0 is the header
		var row = $("#mytable").find("tr:eq(2)");
		row.click();
		expect(row.hasClass("selected")).toBe(true);
		expect(_bus.send).toHaveBeenCalledWith("ui-table:mytable:data-selected", [ [ {
			letter : "b",
			number : "2"
		} ] ]);

		row.click();
		expect(row.hasClass("selected")).toBe(false);
		expect(_bus.send).toHaveBeenCalledWith("ui-table:mytable:data-selected", [ [] ]);
	});

	it("selects rows on select-data", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "a",
			number : "1"
		}, {
			letter : "b",
			number : "2"
		} ] ]);

		// indexes are 1 and 2 because row 0 is the header
		var row1 = $("#mytable").find("tr:eq(1)");
		var row2 = $("#mytable").find("tr:eq(2)");
		expect(row1.hasClass("selected")).toBe(false);
		expect(row2.hasClass("selected")).toBe(false);

		_bus.send("ui-table:mytable:select-data", [ [ {
			letter : "b",
			number : "2"
		} ] ]);

		row1 = $("#mytable").find("tr:eq(1)");
		row2 = $("#mytable").find("tr:eq(2)");
		expect(row1.hasClass("selected")).toBe(false);
		expect(row2.hasClass("selected")).toBe(true);
	});

	it("adds/removes selected class from rows on invert-selection", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", [ [ {
			letter : "a",
			number : "1"
		}, {
			letter : "b",
			number : "2"
		} ] ]);

		// indexes are 1 and 2 because row 0 is the header
		var row1 = $("#mytable").find("tr:eq(1)");
		var row2 = $("#mytable").find("tr:eq(2)");
		row1.addClass("selected");

		expect(row1.hasClass("selected")).toBe(true);
		expect(row2.hasClass("selected")).toBe(false);
		_bus.send("ui-table:mytable:invert-selection");
		expect(row1.hasClass("selected")).toBe(false);
		expect(row2.hasClass("selected")).toBe(true);
	});

	it("sends data-selected on invert-selection", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		var data = [ {
			letter : "a",
			number : "1"
		}, {
			letter : "b",
			number : "2"
		} ];
		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", [ data ]);

		_bus.send("ui-table:mytable:invert-selection");
		expect(_bus.send).toHaveBeenCalledWith("ui-table:mytable:data-selected", [ data ]);
	});
});