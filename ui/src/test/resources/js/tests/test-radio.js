define([ "geoladris-tests" ], function(tests) {
  describe("radio", function() {
    var bus;
    var injector;
    var module;
    var parentId = "parent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "radio" ], function(m) {
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

      expect(input).not.toBe(undefined);
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
  });
});