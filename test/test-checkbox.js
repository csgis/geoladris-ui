define([ "geoladris-tests" ], function(tests) {
  describe("checkbox", function() {
    var bus;
    var injector;
    var commons;
    var module;
    var parentId = "parent";

    beforeEach(function(done) {
      var initialization = tests.init();
      bus = initialization.bus;

      injector = initialization.injector;
      injector.require([ "commons", "checkbox" ], function(c, m) {
        commons = c;
        spyOn(commons, "linkDisplay").and.callThrough();

        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("adds a checkbox", function() {
      var input = module({
        id : "myitem",
        parent : parentId,
        text : "Item 1"
      });

      expect(input).not.toBe(null);
      expect(input.type).toBe("checkbox");

      var container = document.getElementById(parentId).querySelector(".ui-input-container");
      expect(container.getElementsByClassName("ui-checkbox").length).toBe(1);
      expect(container.getElementsByClassName("ui-label").length).toBe(1);
    });

    it("triggers input click on checkbox text clicked", function() {
      var input = module({
        id : "myitem",
        parent : parentId,
        text : "Item 1"
      });

      var clicked;
      input.addEventListener("click", function() {
        clicked = true;
      });

      document.getElementById(parentId).querySelector(".ui-label").click();
      expect(clicked).toBe(true);
    });

    it("links container visibility", function() {
      var input = module({
        id : "myitem",
        parent : parentId,
        text : "Item 1"
      });

      expect(commons.linkDisplay).toHaveBeenCalled();
      var args = commons.linkDisplay.calls.mostRecent().args;
      expect(args[0].id).toBe(input.id);
      expect(args[1].id).toBe(input.id + "-container");
    });
  });
});
