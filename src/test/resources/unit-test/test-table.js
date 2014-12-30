describe("ui-table", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-table", [ $, _bus ]);
	});

	it("creates <table> on create", function() {
		var msg = {
			div : "mytable",
			parentDiv : parentId
		};

		_bus.send("ui-table:create", msg);
		expect($("#mytable").length).toBe(1);
		expect($("#mytable").children("table").length).toBe(1);
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
});