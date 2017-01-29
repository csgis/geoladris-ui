define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var module;

  describe("accordion-group", function() {
    var parentId = "myparent";
    var groupId = "mygroup";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "accordion-group" ], function(m) {
        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    function initGroup(visible) {
      module({
        id : groupId,
        parent : parentId,
        title : "Accordion Group 1",
        visible : visible
      });
    }

    function header() {
      return document.getElementById(groupId + "-header");
    }

    function content() {
      return document.getElementById(groupId);
    }

    it("adds header on create", function() {
      var title = "Accordion Group 1";
      module({
        id : "mygroup",
        parent : parentId,
        title : title
      });

      var container = document.getElementById(parentId).children[0];
      var header = document.getElementById("mygroup-header");
      expect(container.children.length).toBe(2);
      expect(header.parentNode).toBe(container);
      expect(header).not.toBe(undefined);
      expect(header.className.indexOf("accordion-header")).toBeGreaterThan(-1);
      expect(header.querySelector("p").className.indexOf("accordion-header-text")).toBeGreaterThan(-1);
      expect(header.textContent).toBe(title);
    });

    it("adds container on create", function() {
      initGroup();

      var container = document.getElementById(parentId).children[0];
      expect(container.children.length).toBe(2);
      var content = document.getElementById("mygroup"); 
      expect(content).not.toBe(undefined);
      expect(content.parentNode).toBe(container);
    });

    it("shows content if visible property on add-group", function() {
      initGroup();
      expect(content().style["visibility"]).not.toBe("hidden");
    });

    it("ignores undefined properties on visibility", function() {
      initGroup(true);

      bus.send("ui-accordion:" + groupId + ":visibility", {});

      expect(header().style["visibility"]).not.toBe("hidden");
      expect(content().style["visibility"]).not.toBe("hidden");
    });

    it("updates header and content if specified on visibility", function() {
      initGroup();

      bus.send("ui-accordion-group:" + groupId + ":visibility", {
        header : false,
        content : false
      });

      expect(bus.send).toHaveBeenCalledWith("ui-hide", groupId);
      expect(bus.send).toHaveBeenCalledWith("ui-hide", groupId + "-header");
    });
  });
});