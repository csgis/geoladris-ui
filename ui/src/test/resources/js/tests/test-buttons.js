define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;
	describe("ui-buttons", function() {
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-buttons" ], function() {
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates a <div> if text specified", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				text : "Click!"
			});
			expect($("#mybutton").prop("tagName")).toBe("DIV");
			expect($("#mybutton").children("div").text()).toBe("Click!");
		});

		it("creates a <div> if image specified", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				image : "url_to_image"
			});
			expect($("#mybutton").prop("tagName")).toBe("DIV");
			var css = $("#mybutton").children("div").css("background-image");
			expect(css.indexOf("url_to_image")).not.toBe(-1);
		});

		it("creates a <div> with text and image if both specified", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				image : "url_to_image",
				text : "Click!"
			});

			var iconDiv = $("#mybutton").children("div");
			expect(iconDiv.text()).toBe("Click!");
			expect(iconDiv.css("background-image").indexOf("url_to_image")).not.toBe(-1);
		});

		it("adds a tooltip if specified on create", function() {
			var tooltip = "Click me";
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				img : "url_to_image",
				tooltip : tooltip
			});
			expect($("#mybutton").attr("title")).toBe(tooltip);
		});

		it("creates the button with the default css classes", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				img : "url_to_image",
			});

			expect($("#mybutton").hasClass("button-enabled")).toBe(true);
			expect($("#mybutton").hasClass("button-disabled")).toBe(false);
			expect($("#mybutton").hasClass("button-active")).toBe(false);
		});

		it("sets button to correct position if priority specified on create", function() {
			bus.send("ui-button:create", {
				div : "mybutton1",
				parentDiv : parentId,
				priority : 2
			});
			bus.send("ui-button:create", {
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
			};
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				img : "url_to_image",
				sendEventName : event,
				sendEventMessage : eventMessage
			});

			var button = $("#mybutton");
			button.trigger("click");
			expect(bus.send).toHaveBeenCalledWith(event, eventMessage);
		});

		it("enables button on ui-button:enable", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId
			});

			var button = $("#mybutton");
			button.attr("class", "button-disabled");

			bus.send("ui-button:mybutton:enable", true);
			expect($("#mybutton").hasClass("button-disabled")).toBe(false);
			expect($("#mybutton").hasClass("button-enabled")).toBe(true);
		});

		it("disables button on ui-button:disable", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId
			});

			bus.send("ui-button:mybutton:enable", false);
			expect($("#mybutton").hasClass("button-disabled")).toBe(true);
			expect($("#mybutton").hasClass("button-enabled")).toBe(false);
		});

		it("changes css on deactivate/activate events", function() {
			var disableEvent = "disable-button";
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId
			});

			expect($("#mybutton").hasClass("button-active")).toBe(false);
			bus.send("ui-button:mybutton:activate", true);
			expect($("#mybutton").hasClass("button-active")).toBe(true);
			bus.send("ui-button:mybutton:activate", false);
			expect($("#mybutton").hasClass("button-active")).toBe(false);
		});

		it("changes css on toggle events", function() {
			var disableEvent = "disable-button";
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId
			});

			expect($("#mybutton").hasClass("button-active")).toBe(false);
			bus.send("ui-button:mybutton:toggle");
			expect($("#mybutton").hasClass("button-active")).toBe(true);
			bus.send("ui-button:mybutton:toggle");
			expect($("#mybutton").hasClass("button-active")).toBe(false);
		});

		it("changes background image on set-image", function() {
			bus.send("ui-button:create", {
				div : "mybutton",
				parentDiv : parentId,
				image : "theme/images/one.png"
			});

			var imageDiv = $("#mybutton").children(".button-content");

			expect(imageDiv.css("background-image").indexOf("theme/images/one.png")).not.toBe(-1);
			bus.send("ui-button:mybutton:set-image", "theme/images/two.png");
			expect(imageDiv.css("background-image").indexOf("theme/images/two.png")).not.toBe(-1);
		});
	});
});
