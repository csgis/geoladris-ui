define([ "geoladris-tests" ], function(tests) {
  describe("input", function() {
    var bus;
    var injector;
    var module;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {}, {
        "pikaday" : "../jslib/pikaday/1.5.1/pikaday",
        "pikaday.jquery" : "../jslib/pikaday/1.5.1/pikaday.jquery",
        "typeahead" : "../jslib/typeahead/0.10.2/typeahead.jquery.min"
      });
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "input" ], function(m) {
        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates container with elements", function() {
      module({
        id : "myinput",
        parent : parentId
      });

      var container = $("#" + parentId).children();
      expect(container.length).toBe(1);
      expect(container.children("#myinput").length).toBe(1);
      expect(container.children("label").length).toBe(1);
    });

    it("adds label if specified on create", function() {
      var text = "Input: ";
      var input = module({
        id : "myinput",
        parent : parentId,
        label : text
      });

      var label = input.parent().find("label");
      expect(label.length).toBe(1);
      expect(label.text()).toEqual(text);
    });

    it("sets input type if specified on create", function() {
      var input = module({
        id : "myinput",
        parent : parentId,
        type : "password"
      });
      expect(input.attr("type")).toBe("password");
    });

    it("fills message on -field-value-fill", function() {
      var inputText = "Input Text";
      var input = module({
        id : "myinput",
        parent : parentId
      });
      input.val(inputText);

      var message = {};
      bus.send("myinput-field-value-fill", message);
      expect(message["myinput"]).toEqual(inputText);
    });

    it("adds step=any for number fields", function() {
      var input = module({
        id : "myinput",
        type : "number",
        parent : parentId
      });
      expect(input.attr("step")).toBe("any");
    });

    it("fills values with actual types (number, date,...) instead of strings", function() {
      var number = module({
        id : "mynumber",
        type : "number",
        parent : parentId
      });
      var date = module({
        id : "mydate",
        type : "date",
        parent : parentId
      });

      number.val(57.6);
      date.val("2016-06-10");

      var message = {};
      bus.send("mynumber-field-value-fill", message);
      expect(message["mynumber"]).toEqual(57.6);
      expect(typeof message["mynumber"]).toBe("number");

      message = {};
      bus.send("mydate-field-value-fill", message);
      expect(message["mydate"]).toEqual("2016-06-10T00:00:00.000Z");
      expect(typeof message["mydate"]).toBe("string");
    });

    it("sets placeholder if specified", function() {
      var placeholder = "Search...";
      var input = module({
        id : "myinput",
        parent : parentId,
        placeholder : placeholder
      });

      expect(input.attr("placeholder")).toEqual(placeholder);
    });

    it("sends event on enter for autocomplete", function() {
      var input = module({
        id : "myinput",
        parent : parentId,
        options : [ "a", "b", "c" ]
      });

      var changed;
      input[0].addEventListener("change", function() {
        changed = true;
      });
      var e = $.Event("keypress");
      e.which = 13;
      input.trigger(e);

      expect(changed).toBe(true);
    });
  });
});