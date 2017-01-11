define([ "geoladris-tests" ], function(tests) {
	describe("ui-dropdown-buttons", function() {
		var bus;
		var injector;
		var module;
		var parentId = "myparent";

		var deps;

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;

			// Mock the button and sliding div events
			deps = {
				buttons : function(msg) {
					$("#" + parentId).append($("<div/>").attr("id", msg.id));
				},
				sliding : function(msg) {
					$("#" + parentId).append($("<div/>").attr("id", msg.id));
				}
			};
			spyOn(deps, "buttons").and.callThrough();
			spyOn(deps, "sliding").and.callThrough();

			injector.mock("ui-buttons", deps.buttons);
			injector.mock("ui-sliding-div", deps.sliding);
			injector.require([ "ui-dropdown-buttons" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("calls ui-button:create on create", function() {
			module({
				id : "mybutton",
				parent : parentId,
				text : "text"
			});
			expect(deps.buttons).toHaveBeenCalledWith(jasmine.objectContaining({
				id : "mybutton",
				parent : "mybutton-container",
				css : "ui-dropdown-button-button",
				text : "text"
			}));
		});

		it("calls ui-sliding-div:create on create", function() {
			module({
				id : "mybutton",
				parent : parentId,
				text : "text"
			});
			expect(deps.sliding).toHaveBeenCalledWith(jasmine.objectContaining({
				id : "mybutton-sliding",
				parent : "mybutton-container"
			}));
		});

		it("adds a div on add-item", function() {
			module({
				id : "mybutton",
				parent : parentId
			});

			expect($("#mybutton-sliding").children().length).toBe(0);
			bus.send("ui-dropdown-button:mybutton:add-item", {
				id : "myitem",
				image : "theme/images/image.svg"
			});
			expect($("#mybutton-sliding").children().length).toBe(1);
			var bg = $("#mybutton-sliding").children().css("background-image");
			expect(bg.indexOf("theme/images/image.svg")).not.toBe(-1);
		});

		it("toggles the sliding on click if dropdownOnClick", function() {
			module({
				id : "mybutton",
				parent : parentId,
				dropdownOnClick : true
			});

			expect(bus.send).not.toHaveBeenCalledWith("ui-sliding-div:toggle", "mybutton-sliding");
			$("#mybutton").click();
			expect(bus.send).toHaveBeenCalledWith("ui-sliding-div:toggle", "mybutton-sliding");
		});

		it("sends item-selected on item click", function() {
			mockWithItem();
			$("#mybutton-sliding").children().click();
			expect(bus.send).toHaveBeenCalledWith("ui-dropdown-button:mybutton:item-selected", "myitem");
		});

		it("collapses sliding div on item click", function() {
			mockWithItem();
			$("#mybutton-sliding").children().click();
			expect(bus.send).toHaveBeenCalledWith("ui-sliding-div:collapse", "mybutton-sliding");
		});

		it("changes the button background on item click", function() {
			mockWithItem();
			$("#mybutton-sliding").children(":eq(1)").click();
			expect(bus.send).toHaveBeenCalledWith("ui-button:mybutton:set-image", "theme/images/icon2.png");
		});

		it("changes the button background on set-item", function() {
			mockWithItem();
			bus.send("ui-dropdown-button:mybutton:set-item", "myitem2");
			expect(bus.send).toHaveBeenCalledWith("ui-button:mybutton:set-image", "theme/images/icon2.png");
		});

		it("sets title attribute if tooltip provided on add-item", function() {
			var tooltip = "My item tooltip";
			module({
				id : "mybutton",
				parent : parentId,
				dropdownOnClick : true
			});
			bus.send("ui-dropdown-button:mybutton:add-item", {
				id : "myitem",
				image : "theme/images/icon.png",
				tooltip : tooltip
			});

			var item = $("#mybutton-sliding").children();
			expect(item.attr("title")).toBe(tooltip);
		});

		it("does not change the button background on item click if already selected", function() {
			mockWithItem();
			bus.send("ui-dropdown-button:mybutton:set-item", "myitem");

			$("#mybutton-sliding").children(":eq(0)").click();
			expect(getNumEventCalls(bus.send, "ui-button:mybutton:set-image")).toBe(1);
		});

		it("does not change the button background on set-item if already selected", function() {
			mockWithItem();
			bus.send("ui-dropdown-button:mybutton:set-item", "myitem");
			expect(getNumEventCalls(bus.send, "ui-button:mybutton:set-image")).toBe(1);
		});

		function mockWithItem() {
			module({
				id : "mybutton",
				parent : parentId,
				dropdownOnClick : true
			});
			bus.send("ui-dropdown-button:mybutton:add-item", {
				id : "myitem",
				image : "theme/images/img.svg"
			});
			bus.send("ui-dropdown-button:mybutton:add-item", {
				id : "myitem2",
				image : "theme/images/icon2.png"
			});
		}

		function getNumEventCalls(mock, eventName) {
			var calls = mock.calls.all();
			var n = 0;
			for (var i = 0; i < calls.length; i++) {
				if (calls[i].args[0] == eventName) {
					n++;
				}
			}
			return n;
		}
	});
});