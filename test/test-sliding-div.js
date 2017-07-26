define([ "geoladris-tests" ], function(tests) {

  describe("sliding-div", function() {
    var bus;
    var injector;
    var module;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init();
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

      var parent = document.getElementById(parentId);
      expect(parent.children.length).toBe(1);
      var container = parent.children[0];
      expect(container.getElementsByClassName("ui-sliding-div-handle").length).toBe(1);
      expect(container.getElementsByClassName("ui-sliding-div-content").length).toBe(1);
    });

    it("hides/shows the content when the handle is clicked", function() {
      module({
        id : "mysliding",
        parent : parentId
      });

      var parent = document.getElementById(parentId);
      var container = parent.children[0];
      var handle = container.querySelector(".ui-sliding-div-handle");
      var content = document.getElementById("mysliding");
      expect(content.style["display"]).toBe("none");
      handle.click();
      expect(content.style["display"]).not.toBe("none");
    });

    it("shows on expand event", function() {
      var div = module({
        id : "mysliding",
        parent : parentId,
      });

      expect(div.style["display"]).toBe("none");
      bus.send("ui-sliding-div:expand", "mysliding");
      expect(div.style["display"]).not.toBe("none");
    });

    it("hides on collapse event", function() {
      var div = module({
        id : "mysliding",
        parent : parentId
      });

      var handle = div.parentNode.querySelector(".ui-sliding-div-handle");
      handle.click();

      expect(div.style["display"]).not.toBe("none");
      bus.send("ui-sliding-div:collapse", "mysliding");
      expect(div.style["display"]).toBe("none");
    });

    it("toggles on toggle event", function() {
      var div = module({
        id : "mysliding",
        parent : parentId
      });

      expect(div.style["display"]).toBe("none");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(div.style["display"]).not.toBe("none");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(div.style["display"]).toBe("none");
    });

    it("changes handle text when shown/hidden", function() {
      var div = module({
        id : "mysliding",
        parent : parentId
      });

      var handle = div.parentNode.querySelector(".ui-sliding-div-handle");

      expect(handle.innerHTML).toBe("+");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(handle.innerHTML).toBe("-");
      bus.send("ui-sliding-div:toggle", "mysliding");
      expect(handle.innerHTML).toBe("+");
    });

    it("adds the handlePosition property as CSS class", function() {
      var div = module({
        id : "mysliding",
        parent : parentId,
        handlePosition : "bottom-left"
      });

      var handle = div.parentNode.querySelector(".ui-sliding-div-handle");
      expect(handle.className).toMatch("bottom-left");
    });

    it("shows expanded if visible is specified", function() {
      var div = module({
        id : "mysliding",
        parent : parentId,
        handlePosition : "bottom-left",
        visible : true
      });

      expect(div.style["display"]).not.toBe("none");
    });
  });
});
