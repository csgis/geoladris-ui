describe("ui-buttons", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-buttons", [ $, _bus, commons ]);
	});

	it("creates a <button> if text specified", function() {
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			text : "Click!"
		});
		expect($("#mybutton").prop("tagName")).toBe("BUTTON");
	});
	it("creates a <div> if image specified", function() {
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			image : "url_to_image"
		});
		expect($("#mybutton").prop("tagName")).toBe("DIV");
	});

	it("adds a tooltip if specified on create", function() {
		var tooltip = "Click me";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			img : "url_to_image",
			tooltip : tooltip
		});
		expect($("#mybutton").attr("title")).toBe(tooltip);
	});

	it("creates the button with the default css classes", function() {
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			img : "url_to_image",
		});

		expect($("#mybutton").hasClass("button-enabled")).toBe(true);
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
		expect($("#mybutton").hasClass("button-active")).toBe(false);
	});

	it("sets button to correct position if priority specified on create", function() {
		_bus.send("ui-button:create", {
			div : "mybutton1",
			parentDiv : parentId,
			priority : 2
		});
		_bus.send("ui-button:create", {
			div : "mybutton2",
			parentDiv : parentId,
			priority : 1
		});

		expect($("#mybutton2").index()).toBe(0);
		expect($("#mybutton1").index()).toBe(1);
	});

	it("sends event on click if sendEventName specified on create", function() {
		var event = "event-name";
		var eventMessage = {
			data : "This is the message"
		}
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			img : "url_to_image",
			sendEventName : event,
			sendEventMessage : eventMessage
		});

		var button = $("#mybutton");
		button.trigger("click");
		expect(_bus.send).toHaveBeenCalledWith(event, eventMessage);
	});

	it("enables button on ui-button:enable", function() {
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});

		var button = $("#mybutton");
		button.attr("class", "button-disabled");

		_bus.send("ui-button:enable", "mybutton");
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
		expect($("#mybutton").hasClass("button-enabled")).toBe(true);
	});

	it("disables button on ui-button:disable", function() {
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});

		_bus.send("ui-button:disable", "mybutton");
		expect($("#mybutton").hasClass("button-disabled")).toBe(true);
		expect($("#mybutton").hasClass("button-enabled")).toBe(false);
	});

	it("changes css on deactivate/activate events", function() {
		var disableEvent = "disable-button";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});

		expect($("#mybutton").hasClass("button-active")).toBe(false);
		_bus.send("ui-button:activate", "mybutton");
		expect($("#mybutton").hasClass("button-active")).toBe(true);
		_bus.send("ui-button:deactivate", "mybutton");
		expect($("#mybutton").hasClass("button-active")).toBe(false);
	});

	it("changes css on toggle events", function() {
		var disableEvent = "disable-button";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});

		expect($("#mybutton").hasClass("button-active")).toBe(false);
		_bus.send("ui-button:toggle", "mybutton");
		expect($("#mybutton").hasClass("button-active")).toBe(true);
		_bus.send("ui-button:toggle", "mybutton");
		expect($("#mybutton").hasClass("button-active")).toBe(false);
	});

	it("changes background image on set-image", function() {
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			image : "images/one.png"
		});

		var imageDiv = $("#mybutton").children(".button-image");

		expect(imageDiv.css("background-image").indexOf("images/one.png")).not.toBe(-1);
		_bus.send("ui-button:set-image", {
			id : "mybutton",
			image : "images/two.png"
		});
		expect(imageDiv.css("background-image").indexOf("images/two.png")).not.toBe(-1);
	});
});