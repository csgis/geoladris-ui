define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var buttons;

  describe("buttons", function() {
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "buttons" ], function(module) {
        buttons = module;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates a <div> if text specified", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        text : "Click!"
      });
      expect(button.tagName).toBe("DIV");
      expect(button.querySelector("div").innerHTML).toBe("Click!");
    });

    it("creates a <div> if image specified", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        image : "url_to_image"
      });
      expect(button.tagName).toBe("DIV");
      var content = button.querySelector("div");
      expect(content.style["background-image"].indexOf("url_to_image")).not.toBe(-1);
    });

    it("creates a <div> with text and image if both specified", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        image : "url_to_image",
        text : "Click!"
      });

      var iconDiv = button.children[0];
      expect(iconDiv.innerHTML).toBe("Click!");
      expect(iconDiv.style["background-image"].indexOf("url_to_image")).not.toBe(-1);
    });

    it("adds a tooltip if specified on create", function() {
      var tooltip = "Click me";
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
        tooltip : tooltip
      });
      expect(button.title).toBe(tooltip);
    });

    it("creates the button with the default css classes", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
      });

      expect(button.className).toMatch("button-enabled");
      expect(button.className).not.toMatch("button-disabled");
      expect(button.className).not.toMatch("button-active");
    });

    it("sets button to correct position if priority specified on create", function() {
      var button1 = buttons({
        id : "mybutton1",
        parent : parentId,
        priority : 2
      });
      var button2 = buttons({
        id : "mybutton2",
        parent : parentId,
        priority : 1
      });

      var parent = document.getElementById(parentId);
      expect(parent.children[0]).toBe(button2);
      expect(parent.children[1]).toBe(button1);
    });

    it("sends event on click if clickEventName specified on create", function() {
      var event = "event-name";
      var eventMessage = {
        data : "This is the message"
      };
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
        clickEventName : event,
        clickEventMessage : eventMessage
      });

      button.click();
      expect(bus.send).toHaveBeenCalledWith(event, eventMessage);
    });

    it("calls callback on click if clickEventCallback specified on create", function() {
      var clicked;
      var button = buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
        clickEventCallback : function() {
          clicked = true;
        }
      });

      button.click();
      expect(clicked).toBe(true);
    });

    it("enables button on ui-button:enable", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId
      });

      button.className = "button-disabled";

      bus.send("ui-button:mybutton:enable", true);
      expect(button.className).not.toMatch("button-disabled");
      expect(button.className).toMatch("button-enabled");
    });

    it("disables button on ui-button:disable", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId
      });

      bus.send("ui-button:mybutton:enable", false);
      expect(button.className).toMatch("button-disabled");
      expect(button.className).not.toMatch("button-enabled");
    });

    it("changes css on deactivate/activate events", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId
      });

      expect(button.className).not.toMatch("button-active");
      bus.send("ui-button:mybutton:activate", true);
      expect(button.className).toMatch("button-active");
      bus.send("ui-button:mybutton:activate", false);
      expect(button.className).not.toMatch("button-active");
    });

    it("changes css on toggle events", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId
      });

      expect(button.className).not.toMatch("button-active");
      bus.send("ui-button:mybutton:toggle");
      expect(button.className).toMatch("button-active");
      bus.send("ui-button:mybutton:toggle");
      expect(button.className).not.toMatch("button-active");
    });

    it("does not add css classes more than once", function() {
      var button = buttons({
        id : "mybutton",
        parent : parentId
      });

      expect(button.className).toBe("button-enabled");
      bus.send("ui-button:mybutton:activate");
      bus.send("ui-button:mybutton:activate");
      expect(button.className).toBe("button-enabled button-active");
      bus.send("ui-button:mybutton:enable");
      bus.send("ui-button:mybutton:enable");
      expect(button.className).toBe("button-enabled button-active");
    });
  });
});
