describe("ui-autocomplete", function() {
	var parentId = "myparent";
	var id = "myautocomplete";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.stopListenAll();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-autocomplete", [ $, _bus, commons ]);
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

		var e = $.Event("keypress");
		e.which = 13;
		input.trigger(e);

		var event = "ui-autocomplete:" + id + ":selected";
		expect(_bus.send).toHaveBeenCalledWith(event, jasmine.any(String));
	});

	it("fills message on -field-value-fill", function() {
		var div = initAutocomplete();
		var message = {};
		_bus.send(id + "-field-value-fill", message);
		expect(message[id]).toEqual("");
	});

	it("sets input value on set-value", function() {
		var div = initAutocomplete();

		var text = "text";
		var anotherText = "another text";
		var message = {};

		expect(div.find("input").val()).toEqual("");

		_bus.send("ui-autocomplete:" + id + ":set-value", text);
		_bus.send(id + "-field-value-fill", message);
		expect(message[id]).toEqual(text);

		_bus.send("ui-autocomplete:" + id + ":set-value", anotherText);
		_bus.send(id + "-field-value-fill", message);
		expect(message[id]).toEqual(anotherText);
	});
});