define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var choice;

  describe("choice-field", function() {
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "choice-field" ], function(module) {
        choice = module;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates div on create", function() {
      choice({
        id : "mychoice",
        parent : parentId
      });

      var container = $("#" + parentId).children();
      expect(container.length).toBe(1);
      expect(container.children("#mychoice").length).toBe(1);
    });

    it("creates label on create", function() {
      var text = "Choice: ";
      choice({
        id : "mychoice",
        parent : parentId,
        label : text
      });

      var label = $("#" + parentId).find("label");
      expect(label.length).toBe(1);
      expect(label.text()).toEqual(text);
    });

    it("adds values if specified on create", function() {
      var combo = choice({
        id : "mychoice",
        parent : parentId,
        values : [ "One", "Two", "Three" ]
      });

      expect(combo.length).toBe(1);
      expect(combo.children().length).toBe(3);
    });

    it("fills message on -field-value-fill", function() {
      choice({
        id : "mychoice",
        parent : parentId,
        values : [ "One", "Two", "Three" ]
      });

      var message = {};
      bus.send("mychoice-field-value-fill", message);
      expect(message["mychoice"]).toEqual("One");
    });

    it("sets values on set-values", function() {
      var combo = choice({
        id : "mychoice",
        parent : parentId,
        values : [ "One", "Two", "Three" ]
      });

      bus.send("ui-choice-field:mychoice:set-values", [ [ "1", "2" ] ]);

      expect(combo.children("option:eq(0)").text()).toBe("1");
      expect(combo.children("option:eq(1)").text()).toBe("2");
    });
  });
});