describe("ui-search", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-search", [ $, _bus ]);
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

	it("creates a div with a list on ui-search-results:create", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
			title : "Results"
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#mysearchresults").length).toBe(1);
		expect($("#mysearchresults").children("ul").length).toBe(1);
	});

	it("shows result list on init if specified on create results", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
			title : "Results",
			visible : true
		});

		expect($("#mysearchresults").css("display").length).not.toEqual("none");
	});

	it("empties list on ui-search-results:clear", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
		});

		var list = $("#mysearchresults").children("ul");
		list.append("<li>A</li>");
		list.append("<li>B</li>");
		list.append("<li>C</li>");

		expect($("#mysearchresults").children("ul").children().length).toBe(3);
		_bus.send("ui-search-results:mysearchresults:clear");
		expect($("#mysearchresults").children("ul").children().length).toBe(0);
	});

	it("adds item on ui-search-results:add", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId,
		});

		_bus.send("ui-search-results:mysearchresults:add", "Result 1");

		var element = $("#mysearchresults").find("li");
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

		var element = $("#mysearchresults").find("li");
		element.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith("ui-search-results:mysearchresults:selected", "Result 1");
	});

	it("sends event close clicked", function() {
		_bus.send("ui-search-results:create", {
			div : "mysearchresults",
			parentDiv : parentId
		});

		var close = $("#mysearchresults").find("div.ui-search-results-close");
		close.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "mysearchresults");
	});
});