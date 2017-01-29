define([ "geoladris-tests" ], function(tests) {
  describe("dialog", function() {
    var bus;
    var injector;
    var module;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {});
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "dialog" ], function(m) {
        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates div on create", function() {
      module({
        id : "mydialog",
        parent : parentId
      });

      var parent = document.getElementById(parentId);
      expect(parent.children.length).toBe(1);
      var container = parent.children[0];
      var dialog = document.getElementById("mydialog");
      expect(dialog).not.toBe(undefined);
      expect(dialog.parentNode).toBe(container);
    });

    it("does not create the same dialog twice", function() {
      for (var i = 0; i < 10; i++) {
        module({
          id : "mydialog",
          parent : parentId
        });
      }

      var parent = document.getElementById(parentId);
      expect(parent.children.length).toBe(1);
    });

    it("hides the dialog on init if !visible specified", function() {
      module({
        id : "mydialog",
        parent : parentId
      });
      expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
    });

    it("shows the dialog on init if visible specified", function() {
      module({
        id : "mydialog",
        parent : parentId,
        visible : true
      });
      expect(bus.send).toHaveBeenCalledWith("ui-show", "mydialog");
    });

    it("adds a shade behind the dialog if modal", function() {
      module({
        id : "mydialog",
        parent : parentId,
        modal : true
      });

      var parent = document.getElementById(parentId);
      var container = parent.children[0];
      expect(container).not.toEqual(document.getElementById("mydialog"));
      expect(container.className).toMatch("dialog-modal");
    });

    it("adds a title if specified", function() {
      var text = "Dialog Title";
      module({
        id : "mydialog",
        parent : parentId,
        title : text
      });

      var title = document.getElementById("mydialog").querySelectorAll(".dialog-title");
      expect(title.length).toBe(1);
      expect(title[0].textContent).toBe(text);
    });

    it("adds a close button if specified", function() {
      module({
        id : "mydialog",
        parent : parentId,
        closeButton : true
      });

      var close = document.getElementById("mydialog").querySelectorAll(".dialog-close");
      expect(close.length).toBe(1);
    });

    it("hides the dialog on close button clicked", function() {
      module({
        id : "mydialog",
        parent : parentId,
        closeButton : true
      });

      var close = document.getElementById("mydialog").querySelector(".dialog-close");
      close.click();
      expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
    });

    it("hides the shade when dialog is hidden if modal", function() {
      module({
        id : "mydialog",
        parent : parentId,
        modal : true,
        visible : true
      });

      var modal = document.getElementById(parentId).querySelector(".dialog-modal");
      expect(modal.style["display"]).not.toBe("none");
      bus.send("ui-hide", "mydialog");
      expect(modal.style["display"]).toBe("none");
    });

    it("shows the shade when dialog is shown if modal", function() {
      module({
        id : "mydialog",
        parent : parentId,
        modal : true,
        visible : false
      });

      var modal = document.getElementById(parentId).querySelector(".dialog-modal");
      expect(modal.style["display"]).toBe("none");
      bus.send("ui-show", "mydialog");
      expect(modal.style["display"]).not.toBe("none");
    });

    it("toggles the shade when dialog is toggled if modal", function() {
      module({
        id : "mydialog",
        parent : parentId,
        modal : true,
        visible : true
      });

      var modal = document.getElementById(parentId).querySelector(".dialog-modal");
      expect(modal.style["display"]).not.toBe("none");
      bus.send("ui-toggle", "mydialog");
      expect(modal.style["display"]).toBe("none");
    });

    it("shows the latest dialog on top of the others when ui-show", function() {
      module({
        id : "mydialog",
        parent : parentId,
        visible : false
      });
      module({
        id : "mydialog2",
        parent : parentId,
        visible : false
      });

      var container1 = document.getElementById("mydialog").parentNode;
      var container2 = document.getElementById("mydialog2").parentNode;

      // Mock CSS rules
      var cssRules = {
        "position" : "absolute",
        "z-index" : 2000,
        "display" : "none"
      };
      container1.style["position"] = "absolute";
      container2.style["position"] = "absolute";
      container1.style["z-index"] = 2000;
      container2.style["z-index"] = 2000;
      container1.style["display"] = "none";
      container2.style["display"] = "none";

      bus.send("ui-show", "mydialog");
      expect(container1.style["z-index"]).toBe("2000");
      expect(container2.style["z-index"]).toBe("2000");
      bus.send("ui-show", "mydialog2");
      expect(container1.style["z-index"]).toBe("2000");
      expect(container2.style["z-index"]).toBe("2001");
      bus.send("ui-toggle", "mydialog2");
      bus.send("ui-toggle", "mydialog2");
      expect(container2.style["z-index"]).toBe("2002");
    });
  });
});
