define([ "geoladris-tests" ], function(tests) {
  describe("radio", function() {
    var bus;
    var injector;
    var module;
    var commons;
    var parentId = "parent";

    beforeEach(function(done) {
      var initialization = tests.init();
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "commons", "radio" ], function(c, m) {
        commons = c;
        spyOn(commons, "linkDisplay").and.callThrough();

        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates a radio button", function() {
      var input = module({
        id : "myitem",
        text : "Item 1",
        parent : parentId
      });

      expect(input).not.toBe(null);
      expect(input.type).toEqual("radio");
      expect(input.name).toEqual(parentId);
      expect(input.id).toEqual("myitem");

      var container = document.getElementById(parentId).getElementsByClassName("ui-input-container")[0];
      expect(container.querySelectorAll(".ui-radio").length).toBe(1);
      expect(container.querySelectorAll(".ui-label").length).toBe(1);
    });

    it("clicks input on text clicked", function() {
      var input = module({
        id : "myitem",
        parent : parentId,
        text : "Item 1"
      });

      var clicked;
      input.addEventListener("click", function() {
        clicked = true;
      });

      var text = document.getElementById(parentId).querySelector(".ui-label");
      text.click();
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
