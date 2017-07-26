define([ "geoladris-tests" ], function(tests) {
  var bus;
  var injector;

  describe("form-collector", function() {
    var parentId = "myparent";
    var buttonId = "mybutton";

    beforeEach(function(done) {
      var initialization = tests.init({}, {
        "pikaday" : "../node_modules/pikaday/pikaday",
        "pikaday.jquery" : "../node_modules/pikaday/plugins/pikaday.jquery",
        "typeahead" : "../node_modules/typeahead.js/dist/typeahead.jquery.min"
      });
      bus = initialization.bus;
      injector = initialization.injector;
      tests.replaceParent(parentId);
      injector.require([ "choice", "input", "buttons", "form-collector" ], function(choice, input, buttons) {
        choice({
          id : "letters",
          parent : parentId,
          values : [ "A", "B", "C" ]
        });
        choice({
          id : "numbers",
          parent : parentId,
          values : [ "1", "2", "3" ]
        });
        input({
          id : "freetext",
          parent : parentId
        });
        input({
          id : "mydate",
          parent : parentId,
          type : "date"
        });
        buttons({
          id : buttonId,
          parent : parentId
        });
        done();
      });
    });

    it("sends event on button click", function() {
      bus.send("ui-form-collector:extend", {
        button : buttonId,
        divs : [ "letters", "numbers" ],
        clickEventName : "myevent"
      });
      document.getElementById(buttonId).click();

      expect(bus.send).toHaveBeenCalledWith("myevent", {
        letters : "A",
        numbers : "1"
      });
    });

    it("does not send event on button click if button is disabled", function() {
      bus.send("ui-form-collector:extend", {
        button : buttonId,
        divs : [ "letters", "numbers" ],
        clickEventName : "myevent"
      });

      bus.send("ui-button:" + buttonId + ":enable", false);
      document.getElementById(buttonId).click();

      expect(bus.send).not.toHaveBeenCalledWith("myevent", {
        letters : "A",
        numbers : "1"
      });
    });

    it("translates event message if names specified", function() {
      bus.send("ui-form-collector:extend", {
        button : buttonId,
        divs : [ "letters", "numbers" ],
        names : [ "l", "n" ],
        clickEventName : "myevent"
      });
      document.getElementById(buttonId).click();

      expect(bus.send).toHaveBeenCalledWith("myevent", {
        l : "A",
        n : "1"
      });
    });

    it("disables button if any of the requiredDivs have no value", function() {
      bus.send("ui-form-collector:extend", {
        button : buttonId,
        divs : [ "letters", "numbers", "freetext" ],
        requiredDivs : [ "freetext" ],
        names : [ "l", "n", "f" ],
        clickEventName : "myevent"
      });

      var input = document.getElementById("freetext");
      input.value = "";
      input.dispatchEvent(new Event("input"));
      expect(bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", false);
    });

    it("enables button if all the requiredDivs have a not empty value", function() {
      bus.send("ui-form-collector:extend", {
        button : buttonId,
        divs : [ "letters", "numbers", "freetext" ],
        requiredDivs : [ "freetext" ],
        names : [ "l", "n", "f" ],
        clickEventName : "myevent"
      });

      expect(bus.send).not.toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
      var input = document.getElementById("freetext");
      input.value = "not empty";
      input.dispatchEvent(new Event("input"));
      expect(bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
    });

    it("enables button depending on dates being parseable or not", function() {
      bus.send("ui-form-collector:extend", {
        button : buttonId,
        divs : [ "letters", "numbers", "freetext", "mydate" ],
        requiredDivs : [],
        names : [ "l", "n", "f", "d" ],
        clickEventName : "myevent"
      });

      var input = document.getElementById("mydate");
      input.value = "invalid_date";
      input.dispatchEvent(new Event("input"));
      expect(bus.send).not.toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
      input.value = "2015-10-30";
      input.dispatchEvent(new Event("input"));
      expect(bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
    });
  });
});
