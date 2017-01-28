define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var textArea;

  describe("text-area-field", function() {
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "text-area-field" ], function(module) {
        textArea = module;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates a textarea with a label on create", function() {
      textArea({
        id : "myarea",
        parent : parentId,
        label : "Text: "
      });

      var container = $("#" + parentId).children();
      expect(container.length).toBe(1);
      expect(container.length).toBe(1);
      expect(container.children().length).toBe(2);
      expect(container.children("textarea").length).toBe(1);
      expect(container.children("label").length).toBe(1);
      expect(container.children("label").text()).toBe("Text: ");
    });

    it("sets rows and cols if specified on create", function() {
      var area = textArea({
        id : "myarea",
        parent : parentId,
        label : "Text: ",
        rows : 4,
        cols : 20
      });

      expect(area.attr("rows")).toEqual("4");
      expect(area.attr("cols")).toEqual("20");
    });

    it("fills message on -field-value-fill", function() {
      var area = textArea({
        id : "myarea",
        parent : parentId,
        label : "Text: "
      });

      var content = "This is the textarea content";
      area.val(content);

      var message = {};
      bus.send("myarea-field-value-fill", message);
      expect(message["myarea"]).toEqual(content);
    });
  });
});