define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var commons;

  describe("commons", function() {
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "commons" ], function(module) {
        commons = module;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates elements with no parent", function() {
      var div = commons.getOrCreateElem("div", {
        id : "mybutton"
      });
      expect(div.parentNode).toBe(null);
    });

    it("creates elements specifying DOM element as parent", function() {
      var parent = document.getElementById(parentId);
      var div = commons.getOrCreateElem("div", {
        id : "mybutton",
        parent : parent
      });
      expect(parent.children.length).toBe(1);
      expect(parent.children[0]).toBe(div);
      expect(div.parentNode).toBe(parent);
    });

    it("creates labels", function() {
      var label = commons.createLabel("mynumber", parentId, "Field: ");

      expect(label.id).toBe("mynumber-label")
      expect(label.classList.contains("ui-label")).toBe(true);
    });

    it("changes the label text on set-label", function() {
      var label = commons.createLabel("mynumber", parentId, "Field: ");
      expect(label.innerHTML).toBe("Field: ");
      bus.send("ui-input:mynumber:set-label", "Field 2: ");
      expect(label.innerHTML).toBe("Field 2: ");
    });

    it("links display of components", function(done) {
      var d1 = commons.getOrCreateElem("div", {
        id : "d1",
        parent : parentId
      });
      var d2 = commons.getOrCreateElem("div", {
        id : "d2",
        parent : parentId
      });

      commons.linkDisplay(d1, d2);

      expect(d1.style.display).toBe("");
      expect(d2.style.display).toBe("");

      d1.style.display = "none";

      // MutationObservers are not called immediately; we wait a bit for it
      setTimeout(function() {
        expect(d2.style.display).toBe("none");
        done();
      }, 1000);
    });
  });
});
