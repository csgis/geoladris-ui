describe("ui-autocomplete", function() {
	var parentId = "myparent";
	var id = "myautocomplete";

	beforeEach(function() {
		var previous = document.getElementById(parentId);
		if (previous) {
			document.body.removeChild(previous);
		}

		var parent = document.createElement('div');
		parent.setAttribute("id", parentId);
		document.body.appendChild(parent);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-autocomplete", [ $, _bus ]);
	});

	function initAutocomplete() {
		_bus.send("ui-autocomplete:create", {
			div : id,
			parentDiv : parentId
		});
		var parent = $("#" + parentId);
		return $(parent.children()[0]);
	}

	it("appends div to parent", function() {
		_bus.send("ui-autocomplete:create", {
			div : "myautocomplete",
			parentDiv : parentId
		});

		var parent = $("#" + parentId);
		expect(parent.children().length).toBe(1);
		expect(parent.children("#myautocomplete").length).toBe(1);
		var div = $(parent.children()[0]);
		expect(div.attr("class")).toBe("autocomplete");
	});

	it("appends input and icon to autocomplete div", function() {
		var div = initAutocomplete();
		var input = div.find("input");
		var icon = div.children("div");

		expect(div.children().length).toBe(2);
		expect(input.attr("class")).toMatch("autocomplete-input");
		expect(input.attr("class")).toMatch("typeahead");
		expect(icon.attr("class")).toMatch("autocomplete-icon");
	});

	it("sets input type text", function() {
		var div = initAutocomplete();
		expect(div.find("input").attr("type")).toEqual("text");
	});

	it("sets placeholder if specified", function() {
		var placeholder = "Search...";
		_bus.send("ui-autocomplete:create", {
			div : "myautocomplete",
			parentDiv : parentId,
			placeholder : placeholder
		});

		var parent = $("#" + parentId);
		var div = $(parent.children()[0]);
		expect(div.find("input.tt-input").attr("placeholder")).toEqual(placeholder);
	});

	it("sends event on icon click", function() {
		var div = initAutocomplete();
		var icon = div.children("div");
		icon.trigger("click");

		var event = "ui-autocomplete:" + id + ":selected";
		expect(_bus.send).toHaveBeenCalledWith(event, jasmine.any(String));
	});

	it("sends event on enter", function() {
		var div = initAutocomplete();
		var input = div.find("input");

		var e = jQuery.Event("keypress");
		e.which = 13;
		input.trigger(e);

		var event = "ui-autocomplete:" + id + ":selected";
		expect(_bus.send).toHaveBeenCalledWith(event, jasmine.any(String));
	});
});