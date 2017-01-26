define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;
  var autocomplete;

  describe("autocomplete", function() {
    var parentId = "myparent";
    var id = "myautocomplete";

    beforeEach(function(done) {
      tests.replaceParent(parentId);
      var initialization = tests.init("ui", {}, {
        "typeahead" : "../jslib/typeahead/0.10.2/typeahead.jquery.min"
      });
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "autocomplete" ], function(module) {
        autocomplete = module;
        done();
      });
    });

    function initAutocomplete() {
      autocomplete({
        id : id,
        parent : parentId
      });
      var parent = $("#" + parentId);
      return $(parent.children()[0]);
    }

    it("appends div to parent", function() {
      autocomplete({
        id : "myautocomplete",
        parent : parentId
      });

      var parent = $("#" + parentId);
      expect(parent.children().length).toBe(1);
      expect(parent.children("#myautocomplete").length).toBe(1);
      var div = $(parent.children()[0]);
      expect(div.attr("class")).toBe("autocomplete");
    });

    it("appends input and icon to autocomplete div", function() {
      var div = initAutocomplete();
      var input = div.find("input");
      var icon = div.children("div");

      // 3: input + icon + label
      expect(div.children().length).toBe(3);
      expect(input.attr("class")).toMatch("autocomplete-input");
      expect(input.attr("class")).toMatch("typeahead");
      expect(icon.attr("class")).toMatch("autocomplete-icon");
    });

    it("sets input type text", function() {
      var div = initAutocomplete();
      expect(div.find("input").attr("type")).toEqual("text");
    });

    it("sets placeholder if specified", function() {
      var placeholder = "Search...";
      autocomplete({
        id : "myautocomplete",
        parent : parentId,
        placeholder : placeholder
      });

      var parent = $("#" + parentId);
      var div = $(parent.children()[0]);
      expect(div.find("input.tt-input").attr("placeholder")).toEqual(placeholder);
    });

    it("sends event on icon click", function() {
      var div = initAutocomplete();
      var icon = div.children("div");
      icon.trigger("click");

      var event = "ui-autocomplete:" + id + ":selected";
      expect(bus.send).toHaveBeenCalledWith(event, jasmine.any(String));
    });

    it("sends event on enter", function() {
      var div = initAutocomplete();
      var input = div.find("input");

      var e = $.Event("keypress");
      e.which = 13;
      input.trigger(e);

      var event = "ui-autocomplete:" + id + ":selected";
      expect(bus.send).toHaveBeenCalledWith(event, jasmine.any(String));
    });

    it("fills message on -field-value-fill", function() {
      var div = initAutocomplete();
      var message = {};
      bus.send(id + "-field-value-fill", message);
      expect(message[id]).toEqual("");
    });

    it("changes the label text on set-label", function() {
      var div = initAutocomplete();
      var label = div.find("label");
      expect(label.text()).toBe("");
      bus.send("ui-autocomplete:" + id + ":set-label", "Field: ");
      expect(label.text()).toBe("Field: ");
    });
  });
});