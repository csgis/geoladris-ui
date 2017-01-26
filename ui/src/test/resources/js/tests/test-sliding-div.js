define([ "geoladris-tests" ], function(tests) {

  describe("sliding-div", function() {
    var bus;
    var injector;
    var module;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "sliding-div" ], function(m) {
        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates a handle and a content div within a container on create", function() {
      module({
        id : "mysliding",
        parent : parentId
      });

      var container = $("#" + parentId).children(".ui-sliding-div-container");
      expect(container.length).toBe(1);
      var handle = container.children(".ui-sliding-div-handle");
      expect(handle.length).toBe(1);
      var content = container.children(".ui-sliding-div-content");
      expect(content.length).toBe(1);
    });

    it("hides/shows the content when the handle is clicked", function() {
      module({
        id : "mysliding",
        parent : parentId
      });

      var container = $("#" + parentId).children(".ui-sliding-div-container");
      var handle = container.children(".ui-sliding-div-handle");
      var content = container.children("#mysliding");
      expect(content.css("display")).toBe("none");
      handle.click();
      expect(content.css("display")).toBe("block");
    });

    it("shows on expand event", function() {
      module({
        id : "mysliding",
        parent : parentId,
      });

      var div = $("#mysliding");

      expect(div.css("display")).toBe("none");
      bus.send("ui-sliding-div:expand", "mysliding");
      expect(div.css("display")).toBe("block");
    });

    it("hides on collapse event", function() {
      module({
        id : "mysliding",
        parent : parentId
      });

      var div = $("#mysliding");
      var handle = div.siblings(".ui-sliding-div-handle");

      handle.click();

      expect(div.css("display")).toBe("block");
      bus.send("ui-sliding-div:collapse", "mysliding");
      expect(div.css("display")).toBe("none");
    });

    it("toggles on toggle event", function() {
      module({
        id : "mysliding",
        parent : parentId
      });

      var div = $("#mysliding");

      expect(div.css("display")).toBe("none");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(div.css("display")).toBe("block");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(div.css("display")).toBe("none");
    });

    it("changes handle text when shown/hidden", function() {
      module({
        id : "mysliding",
        parent : parentId
      });

      var handle = $("#mysliding").siblings(".ui-sliding-div-handle");

      expect(handle.text()).toBe("+");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(handle.text()).toBe("-");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(handle.text()).toBe("+");
    });

    it("adds the handlePosition property as CSS class", function() {
      module({
        id : "mysliding",
        parent : parentId,
        handlePosition : "bottom-left"
      });

      var handle = $("#mysliding").siblings(".ui-sliding-div-handle");
      expect(handle.hasClass("bottom-left")).toBe(true);
    });

    it("shows expanded if visible is specified", function() {
      module({
        id : "mysliding",
        parent : parentId,
        handlePosition : "bottom-left",
        visible : true
      });

      var div = $("#mysliding");
      expect(div.css("display")).toBe("block");
    });
  });
});