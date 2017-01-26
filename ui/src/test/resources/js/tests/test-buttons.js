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
      buttons({
        id : "mybutton",
        parent : parentId,
        text : "Click!"
      });
      expect($("#mybutton").prop("tagName")).toBe("DIV");
      expect($("#mybutton").children("div").text()).toBe("Click!");
    });

    it("creates a <div> if image specified", function() {
      buttons({
        id : "mybutton",
        parent : parentId,
        image : "url_to_image"
      });
      expect($("#mybutton").prop("tagName")).toBe("DIV");
      var css = $("#mybutton").children("div").css("background-image");
      expect(css.indexOf("url_to_image")).not.toBe(-1);
    });

    it("creates a <div> with text and image if both specified", function() {
      buttons({
        id : "mybutton",
        parent : parentId,
        image : "url_to_image",
        text : "Click!"
      });

      var iconDiv = $("#mybutton").children("div");
      expect(iconDiv.text()).toBe("Click!");
      expect(iconDiv.css("background-image").indexOf("url_to_image")).not.toBe(-1);
    });

    it("adds a tooltip if specified on create", function() {
      var tooltip = "Click me";
      buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
        tooltip : tooltip
      });
      expect($("#mybutton").attr("title")).toBe(tooltip);
    });

    it("creates the button with the default css classes", function() {
      buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
      });

      expect($("#mybutton").hasClass("button-enabled")).toBe(true);
      expect($("#mybutton").hasClass("button-disabled")).toBe(false);
      expect($("#mybutton").hasClass("button-active")).toBe(false);
    });

    it("sets button to correct position if priority specified on create", function() {
      buttons({
        id : "mybutton1",
        parent : parentId,
        priority : 2
      });
      buttons({
        id : "mybutton2",
        parent : parentId,
        priority : 1
      });

      expect($("#mybutton2").index()).toBe(0);
      expect($("#mybutton1").index()).toBe(1);
    });

    it("sends event on click if clickEventName specified on create", function() {
      var event = "event-name";
      var eventMessage = {
        data : "This is the message"
      };
      buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
        clickEventName : event,
        clickEventMessage : eventMessage
      });

      var button = $("#mybutton");
      button.trigger("click");
      expect(bus.send).toHaveBeenCalledWith(event, eventMessage);
    });

    it("calls callback on click if clickEventCallback specified on create", function() {
      var clicked;
      buttons({
        id : "mybutton",
        parent : parentId,
        img : "url_to_image",
        clickEventCallback : function() {
          clicked = true;
        }
      });

      var button = $("#mybutton");
      button.trigger("click");
      expect(clicked).toBe(true);
    });

    it("enables button on ui-button:enable", function() {
      buttons({
        id : "mybutton",
        parent : parentId
      });

      var button = $("#mybutton");
      button.attr("class", "button-disabled");

      bus.send("ui-button:mybutton:enable", true);
      expect($("#mybutton").hasClass("button-disabled")).toBe(false);
      expect($("#mybutton").hasClass("button-enabled")).toBe(true);
    });

    it("disables button on ui-button:disable", function() {
      buttons({
        id : "mybutton",
        parent : parentId
      });

      bus.send("ui-button:mybutton:enable", false);
      expect($("#mybutton").hasClass("button-disabled")).toBe(true);
      expect($("#mybutton").hasClass("button-enabled")).toBe(false);
    });

    it("changes css on deactivate/activate events", function() {
      var disableEvent = "disable-button";
      buttons({
        id : "mybutton",
        parent : parentId
      });

      expect($("#mybutton").hasClass("button-active")).toBe(false);
      bus.send("ui-button:mybutton:activate", true);
      expect($("#mybutton").hasClass("button-active")).toBe(true);
      bus.send("ui-button:mybutton:activate", false);
      expect($("#mybutton").hasClass("button-active")).toBe(false);
    });

    it("changes css on toggle events", function() {
      var disableEvent = "disable-button";
      buttons({
        id : "mybutton",
        parent : parentId
      });

      expect($("#mybutton").hasClass("button-active")).toBe(false);
      bus.send("ui-button:mybutton:toggle");
      expect($("#mybutton").hasClass("button-active")).toBe(true);
      bus.send("ui-button:mybutton:toggle");
      expect($("#mybutton").hasClass("button-active")).toBe(false);
    });
  });
});
