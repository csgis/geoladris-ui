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
      })[0];
      expect(div.parentNode).toBe(null);
    });

    it("creates elements specifying DOM element as parent", function() {
      var parent = document.getElementById(parentId);
      var div = commons.getOrCreateElem("div", {
        id : "mybutton",
        parent : parent
      })[0];
      expect(parent.children.length).toBe(1);
      expect(parent.children[0]).toBe(div);
      expect(div.parentNode).toBe(parent);
    });
  });
});
