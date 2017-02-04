define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var choice;

  describe("choice", function() {
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "choice" ], function(module) {
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

      var parent = document.getElementById(parentId);
      expect(parent.children.length).toBe(1);
      expect(parent.querySelectorAll("#mychoice").length).toBe(1);
    });

    it("creates label on create", function() {
      var text = "Choice: ";
      choice({
        id : "mychoice",
        parent : parentId,
        label : text
      });

      var parent = document.getElementById(parentId);
      var label = parent.querySelectorAll("label");
      expect(label.length).toBe(1);
      expect(label[0].innerHTML).toEqual(text);
    });

    it("adds values if specified on create", function() {
      var c = choice({
        id : "mychoice",
        parent : parentId,
        values : [ "One", "Two", "Three" ]
      });

      expect(c).not.toBe(null);
      expect(c.children.length).toBe(3);
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
      var c = choice({
        id : "mychoice",
        parent : parentId,
        values : [ "One", "Two", "Three" ]
      });

      bus.send("ui-choice-field:mychoice:set-values", [ [ {
        value : "1",
        text : " One "
      }, {
        value : "2",
        text : " Two "
      } ] ]);

      expect(c.options[0].value).toBe("1");
      expect(c.options[0].innerHTML).toBe(" One ");
      expect(c.options[1].value).toBe("2");
      expect(c.options[1].innerHTML).toBe(" Two ");
    });
  });
});