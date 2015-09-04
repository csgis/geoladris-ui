describe("ui-table", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-table", [ $, _bus, commons ]);
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
		// There are two tables: header + data. We get the second table
		expect($("#mytable").find("table").length).toBe(0);
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "a",
				number : 1
			}, {
				letter : "b",
				number : 2
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			}
		});

		// 2 data rows + 1 header
		var table = $("#mytable").find("table:eq(1)");
		expect(table.find("tr").length).toBe(3);
	});

	it("replaces previous data on set-data", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		expect($("#mytable").find("table").length).toBe(0);
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "a",
				number : 1
			}, {
				letter : "b",
				number : 2
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			}
		});
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "c",
				number : 3
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			}
		});
		// 1 data row + 1 header
		var table = $("#mytable").find("table:eq(1)");
		expect(table.find("tr").length).toBe(2);
	});

	it("clears table on clear", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "c",
				number : 3
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			}
		});
		// 1 data row + 1 header
		var table = $("#mytable").find("table:eq(1)");
		expect(table.find("tr").length).toBe(2);
		_bus.send("ui-table:mytable:clear");
		expect($("#mytable").find("table").length).toBe(0);
	});

	it("selects and sends row-selection-changed on row click", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "a",
				number : "1"
			}, {
				letter : "b",
				number : "2"
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			},
			idColumn : 0
		});

		// index is 2 because row 0 is the header
		var row = $("#mytable").find("table:eq(1)").find("tr:eq(2)");
		row.click();
		expect(row.hasClass("selected")).toBe(true);
		expect(_bus.send).toHaveBeenCalledWith("ui-table:mytable:row-selection-changed", {
			id : "b",
			selected : true
		});

		row.click();
		expect(row.hasClass("selected")).toBe(false);
		expect(_bus.send).toHaveBeenCalledWith("ui-table:mytable:row-selection-changed", {
			id : "b",
			selected : false
		});
	});

	it("selects rows on select-data", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "a",
				number : "1"
			}, {
				letter : "b",
				number : "2"
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			},
			idColumn : 0
		});

		// indexes are 1 and 2 because row 0 is the header
		var table = $("#mytable").find("table:eq(1)");
		var row1 = table.find("tr:eq(1)");
		var row2 = table.find("tr:eq(2)");
		expect(row1.hasClass("selected")).toBe(false);
		expect(row2.hasClass("selected")).toBe(false);

		_bus.send("ui-table:mytable:select-data", [ [ "b" ] ]);

		row1 = table.find("tr:eq(1)");
		row2 = table.find("tr:eq(2)");
		expect(row1.hasClass("selected")).toBe(false);
		expect(row2.hasClass("selected")).toBe(true);
	});

	it("adds/removes selected class from rows on invert-selection", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", {
			data : [ {
				letter : "a",
				number : "1"
			}, {
				letter : "b",
				number : "2"
			} ],
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			}
		});

		// There are two tables: header + data. We get the second table
		var table = $("#mytable").find("table:eq(1)");
		// indexes are 1 and 2 because row 0 is the header
		var row1 = table.find("tr:eq(1)");
		var row2 = table.find("tr:eq(2)");
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
		_bus.send("ui-table:mytable:set-data", {
			data : data,
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			},
			idColumn : 0
		});

		_bus.send("ui-table:mytable:invert-selection");
		expect(_bus.send).toHaveBeenCalledWith("ui-table:mytable:data-selected", [ [ "a", "b" ] ]);
	});

	it("moves selected rows to top on sort-selected-first", function() {
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
		}, {
			letter : "c",
			number : "3"
		} ];
		_bus.send("ui-table:create", msg);
		_bus.send("ui-table:mytable:set-data", {
			data : data,
			fields : {
				"Letter" : "letter",
				"Nr." : "number"
			},
			idColumn : 1
		});
		_bus.send("ui-table:mytable:select-data", [ [ "2" ] ]);
		_bus.send("ui-table:mytable:sort-selected-first");

		// There are two tables: header + data. We get the second table
		var table = $("#mytable").find("table:eq(1)");
		var row1 = table.find("tr:eq(1)");
		var row2 = table.find("tr:eq(2)");
		var row3 = table.find("tr:eq(3)");
		expect(row1.find("td:eq(0)").text()).toBe("b");
		expect(row2.find("td:eq(0)").text()).toBe("a");
		expect(row3.find("td:eq(0)").text()).toBe("c");
	});

	it("applies CSS classes to <div> container and <table>", function() {
		var css = "my-table-class";

		_bus.send("ui-table:create", {
			div : "mytable",
			parentDiv : parentId,
			css : css
		});

		_bus.send("ui-table:mytable:set-data", {
			data : [],
			fields : {}
		});

		var table = $("#mytable").find("table");
		table.each(function() {
			expect($(this).hasClass(css)).toBe(true);
		});
	});
});