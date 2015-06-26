describe("ui-search", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-search", [ $, _bus, commons ]);

		_bus.listen("ui-dialog:create", function(e, msg) {
			var div = $("<div/>").attr("id", msg.div);
			$("#" + parentId).append(div);
		});
	});

	it("adds a div with an input ui-search-box:create", function() {
		_bus.send("ui-search-box:create", {
			div : "mysearchbox",
			parentDiv : parentId
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#mysearchbox").length).toBe(1);
		expect($("#mysearchbox").children("input").length).toBe(1);
	});

	it("sets placeholder if specified on create box", function() {
		var placeholder = "Search...";
		_bus.send("ui-search-box:create", {
			div : "mysearchbox",
			parentDiv : parentId,
			placeholder : placeholder
		});

		var input = $("#mysearchbox").children("input");
		expect(input.attr("placeholder")).toBe(placeholder);
	});

	it("adds icon if specified on create box", function() {
		var placeholder = "Search...";
		_bus.send("ui-search-box:create", {
			div : "mysearchbox",
			parentDiv : parentId,
			icon : true
		});

		var icon = $("#mysearchbox").children("div.ui-search-icon");
		expect(icon.length).toBe(1);
	});

	it("creates a dialog on ui-search-results:create", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
			title : "Results"
		});

		expect(_bus.send).toHaveBeenCalledWith("ui-dialog:create", jasmine.objectContaining({
			div : "mysearchresults",
			parentDiv : parentId,
			title : "Results",
			closeButton : true,
		}));
	});

	it("empties list on ui-search-results:clear", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
		});

		var list = $("#mysearchresults-list");
		list.append("<li>A</li>");
		list.append("<li>B</li>");
		list.append("<li>C</li>");

		expect($("#mysearchresults-list").children().length).toBe(3);
		_bus.send("ui-search-results:mysearchresults:clear");
		expect($("#mysearchresults-list").children().length).toBe(0);
	});

	it("adds item on ui-search-results:add", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
		});

		_bus.send("ui-search-results:mysearchresults:add", "Result 1");

		var element = $("#mysearchresults-list").find("li");
		expect(element.length).toBe(1);
		expect(element.text()).toEqual("Result 1");
	});

	it("sends event on return key pressed on box", function() {
		_bus.send("ui-search-box:create", {
			div : "mysearchbox",
			parentDiv : parentId
		});

		var input = $("#mysearchbox").children("input");
		var value = "search string";
		input.val(value);

		var e = jQuery.Event("keypress");
		e.which = 13;
		input.trigger(e);

		expect(_bus.send).toHaveBeenCalledWith("ui-search-box:mysearchbox:search", value);
	});
	it("sends event on icon clicked", function() {
		_bus.send("ui-search-box:create", {
			div : "mysearchbox",
			parentDiv : parentId,
			icon : true
		});

		var icon = $("#mysearchbox").children("div.ui-search-icon");
		var input = $("#mysearchbox").children("input");
		var value = "search string";
		input.val(value);

		icon.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith("ui-search-box:mysearchbox:search", value);
	});

	it("sends event on list item clicked", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId
		});
		_bus.send("ui-search-results:mysearchresults:add", "Result 1");

		var element = $("#mysearchresults-list").find("li");
		element.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith("ui-search-results:mysearchresults:selected", "Result 1");
	});
});