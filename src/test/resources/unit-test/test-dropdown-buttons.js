describe("ui-dropdown-buttons", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		// Mock the button and sliding div events
		_bus.listen("ui-sliding-div:create", function(e, msg) {
			$("#" + parentId).append($("<div/>").attr("id", msg.div));
		});
		_bus.listen("ui-button:create", function(e, msg) {
			$("#" + parentId).append($("<div/>").attr("id", msg.div));
		});

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-dropdown-buttons", [ $, _bus, commons ]);
	});

	it("calls ui-button:create on create", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			text : "text"
		});
		expect(_bus.send).toHaveBeenCalledWith("ui-button:create", jasmine.objectContaining({
			div : "mybutton",
			parentDiv : "mybutton-container",
			css : "ui-dropdown-button-button",
			text : "text"
		}));
	});

	it("calls ui-sliding-div:create on create", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			text : "text"
		});
		expect(_bus.send).toHaveBeenCalledWith("ui-sliding-div:create", jasmine.objectContaining({
			div : "mybutton-sliding",
			parentDiv : "mybutton-container"
		}));
	});

	it("adds a div on add-item", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});

		expect($("#mybutton-sliding").children().length).toBe(0);
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem",
			image : "images/image.svg"
		});
		expect($("#mybutton-sliding").children().length).toBe(1);
		var bg = $("#mybutton-sliding").children().css("background-image");
		expect(bg.indexOf("images/image.svg")).not.toBe(-1);
	});

	it("toggles the sliding on click if dropdownOnClick", function() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			dropdownOnClick : true
		});

		expect(_bus.send).not.toHaveBeenCalledWith("ui-sliding-div:toggle", "mybutton-sliding");
		$("#mybutton").click();
		expect(_bus.send).toHaveBeenCalledWith("ui-sliding-div:toggle", "mybutton-sliding");
	});

	it("sends item-selected on item click", function() {
		mockWithItem();
		$("#mybutton-sliding").children().click();
		expect(_bus.send).toHaveBeenCalledWith("ui-dropdown-button:mybutton:item-selected", "myitem");
	});

	it("collapses sliding div on item click", function() {
		mockWithItem();
		$("#mybutton-sliding").children().click();
		expect(_bus.send).toHaveBeenCalledWith("ui-sliding-div:collapse", "mybutton-sliding");
	});

	it("changes the button background on item click", function() {
		mockWithItem();
		$("#mybutton-sliding").children().click();
		expect(_bus.send).toHaveBeenCalledWith("ui-button:set-image", {
			id : "mybutton",
			image : "images/img.svg"
		});
	});

	it("changes the button background on set-item", function() {
		mockWithItem();
		_bus.send("ui-dropdown-button:mybutton:set-item", "myitem");
		expect(_bus.send).toHaveBeenCalledWith("ui-button:set-image", {
			id : "mybutton",
			image : "images/img.svg"
		});
	});

	it("sets title attribute if tooltip provided on add-item", function() {
		var tooltip = "My item tooltip";
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			dropdownOnClick : true
		});
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem",
			image : "images/icon.png",
			tooltip : tooltip
		});

		var item = $("#mybutton-sliding").children();
		expect(item.attr("title")).toBe(tooltip);
	});

	function mockWithItem() {
		_bus.send("ui-dropdown-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			dropdownOnClick : true
		});
		_bus.send("ui-dropdown-button:mybutton:add-item", {
			id : "myitem",
			image : "images/img.svg"
		});
	}
});