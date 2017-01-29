define([ "jquery", "geoladris-tests" ], function($, tests) {
  var bus;
  var injector;

  describe("ui", function() {
    var parentId = "myparent";
    var div = "mydiv";

    beforeEach(function() {
      tests.replaceParent(parentId);
      var e = document.createElement("div");
      e.id = div;
      document.getElementById(parentId).appendChild(e);
      var initialization = tests.init("ui", {}, {
        "tipsy" : "../jslib/tipsy/1.0.0a/jquery.tipsy",
        "nouislider" : "../jslib/nouislider/9.2.0/nouislider.min",
        "sortable" : "../jslib/sortable/1.4.2/Sortable.min",
        "datatables.net" : "../jslib/datatables/1.10.11/jquery.dataTables.min",
        "datatables.net-buttons" : "../jslib/datatables/1.10.11/dataTables.buttons.min",
        "datatables.net-colVis" : "../jslib/datatables/1.10.11/buttons.colVis.min"
      });
      bus = initialization.bus;
      injector = initialization.injector;
    });

    it("changes element display on ui-show", function(done) {
      injector.require([ "ui" ], function() {
        document.getElementById(div).style["display"] = "none";
        bus.send("ui-show", "mydiv");
        expect(document.getElementById(div).style["display"]).toBe("");
        done();
      });
    });

    it("changes element display on ui-hide", function(done) {
      injector.require([ "ui" ], function() {
        var e = document.getElementById(div);
        bus.send("ui-show", "mydiv");
        expect(e.style["display"]).toBe("");
        bus.send("ui-hide", "mydiv");
        expect(e.style["display"]).toBe("none");
        done();
      });
    });

    it("changes element display on ui-toggle", function(done) {
      injector.require([ "ui" ], function() {
        var e = document.getElementById(div);
        expect(e.style["display"]).not.toBe("none");
        bus.send("ui-toggle", "mydiv");
        expect(e.style["display"]).toBe("none");
        done();
      });
    });

    it("adds a tooltip", function(done) {
      injector.require([ "ui" ], function(ui) {
        var tooltip = ui.tooltip(parentId, {
          text : "My tooltip"
        });
        expect(tooltip.parent).not.toBe(null);
        expect(tooltip.innerHTML.indexOf("My tooltip")).toBeGreaterThan(-1);
        done();
      });
    });

    it("creates Sortable on sortable", function(done) {
      injector.require([ "ui" ], function(ui) {
        // It doesn't change anything in the DOM. We just ensure that
        // the function is available
        ui.sortable(parentId);
        done();
      });
    });
  });
});
