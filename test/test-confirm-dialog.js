define([ "geoladris-tests" ], function(tests) {
  describe("confirm-dialog", function() {
    var bus;
    var injector;
    var module;
    var buttons;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init();
      bus = initialization.bus;
      injector = initialization.injector;
      buttons = jasmine.createSpy();
      injector.mock("buttons", buttons);
      injector.require([ "confirm-dialog" ], function(m) {
        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates a modal dialog", function() {
      var messages = {
        question : "??",
        ok : "Yes",
        cancel : "No"
      };
      module({
        id : "mydialog",
        parent : parentId,
        css : "mydialog-class",
        modal : false,
        messages : messages
      });

      var container = $("#" + parentId).children();
      expect(container.length).toBe(1);
      var dialog = container.children("#mydialog");
      expect(dialog.length).toBe(1);

      expect(buttons).toHaveBeenCalledWith({
        id : "mydialog-ok",
        parent : "mydialog-confirm-buttons-container",
        css : "dialog-ok-button ui-confirm-dialog-ok",
        text : messages.ok,
        clickEventName : "ui-confirm-dialog:mydialog:ok"
      });
      expect(buttons).toHaveBeenCalledWith({
        id : "mydialog-cancel",
        parent : "mydialog-confirm-buttons-container",
        css : "dialog-ok-button ui-confirm-dialog-cancel",
        text : messages.cancel,
        clickEventName : "ui-confirm-dialog:mydialog:cancel"
      });
    });

    it("does not add an html with the question if not provided", function() {
      module({
        id : "mydialog",
        parent : parentId,
        css : "mydialog-class",
        modal : false,
        messages : {
          ok : "Yes",
          cancel : "No"
        }
      });

      expect($("#mydialog-message").html()).toBe(undefined);
    });

    it("hides the confirm dialog on ok", function() {
      module({
        id : "mydialog",
        parent : parentId
      });
      var container = $("#" + parentId).children();
      var dialog = container.children("#mydialog");
      bus.send("ui-confirm-dialog:mydialog:ok");
      expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
    });

    it("hides the confirm dialog on cancel", function() {
      module({
        id : "mydialog",
        parent : parentId
      });

      var container = $("#" + parentId).children();
      var dialog = container.children("#mydialog");
      bus.send("ui-confirm-dialog:mydialog:cancel");
      expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
    });
  });
});
