describe("ui-buttons", function() {
	var parentId = "myparent";
	var accordionId = "myaccordion";
	var groupId = "mygroup";

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

		_initModule("ui-buttons", [ $, _bus ]);
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
			img : "url_to_image"
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

	it("enables button on event if enableEventName specified on create", function() {
		var enableEvent = "enable-button";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			enableEventName : enableEvent
		});

		var button = $("#mybutton");
		button.attr("class", "button-disabled");

		_bus.send(enableEvent);
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
	});

	it("disables button on event if disableEventName specified on create", function() {
		var disableEvent = "disable-button";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId,
			disableEventName : disableEvent
		});

		_bus.send(disableEvent);
		expect($("#mybutton").hasClass("button-disabled")).toBe(true);
	});
	
	it("changes css on deactivate/activate events", function() {
		var disableEvent = "disable-button";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});
		
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
		_bus.send("ui-button:deactivate", "mybutton");
		expect($("#mybutton").hasClass("button-disabled")).toBe(true);
		_bus.send("ui-button:activate", "mybutton");
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
	});
	
	it("changes css on toggle events", function() {
		var disableEvent = "disable-button";
		_bus.send("ui-button:create", {
			div : "mybutton",
			parentDiv : parentId
		});
		
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
		_bus.send("ui-button:toggle", "mybutton");
		expect($("#mybutton").hasClass("button-disabled")).toBe(true);
		_bus.send("ui-button:toggle", "mybutton");
		expect($("#mybutton").hasClass("button-disabled")).toBe(false);
	});
});