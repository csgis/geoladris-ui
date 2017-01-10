define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;

	describe("ui-form-collector", function() {
		var parentId = "myparent";
		var buttonId = "mybutton";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {}, {
				"pikaday" : "../jslib/pikaday/1.5.1/pikaday",
				"pikaday.jquery" : "../jslib/pikaday/1.5.1/pikaday.jquery"
			});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-choice-field", "ui-input-field", "ui-buttons", "ui-form-collector" ], function() {
				bus.send("ui-choice-field:create", {
					div : "letters",
					parentDiv : parentId,
					values : [ "A", "B", "C" ]
				});
				bus.send("ui-choice-field:create", {
					div : "numbers",
					parentDiv : parentId,
					values : [ "1", "2", "3" ]
				});
				bus.send("ui-input-field:create", {
					div : "freetext",
					parentDiv : parentId
				});
				bus.send("ui-input-field:create", {
					div : "mydate",
					type : "date",
					parentDiv : parentId
				});
				bus.send("ui-button:create", {
					div : buttonId,
					parentDiv : parentId
				});
				done();
			});
			tests.replaceParent(parentId);
		});

		it("sends event on button click", function() {
			bus.send("ui-form-collector:extend", {
				button : buttonId,
				divs : [ "letters", "numbers" ],
				sendEventName : "myevent"
			});
			$("#" + buttonId).trigger("click");

			expect(bus.send).toHaveBeenCalledWith("myevent", {
				letters : "A",
				numbers : "1"
			});
		});

		it("does not send event on button click if button is disabled", function() {
			bus.send("ui-form-collector:extend", {
				button : buttonId,
				divs : [ "letters", "numbers" ],
				sendEventName : "myevent"
			});

			bus.send("ui-button:" + buttonId + ":enable", false);
			$("#" + buttonId).trigger("click");

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
				sendEventName : "myevent"
			});
			$("#" + buttonId).trigger("click");

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
				sendEventName : "myevent"
			});

			var input = $("#freetext input");
			input.val("");
			input.change();
			expect(bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", false);
		});

		it("enables button if all the requiredDivs have a not empty value", function() {
			bus.send("ui-form-collector:extend", {
				button : buttonId,
				divs : [ "letters", "numbers", "freetext" ],
				requiredDivs : [ "freetext" ],
				names : [ "l", "n", "f" ],
				sendEventName : "myevent"
			});

			expect(bus.send).not.toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
			var input = $("#freetext input");
			input.val("not empty");
			input.change();
			expect(bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
		});

		it("enables button depending on dates being parseable or not", function() {
			bus.send("ui-form-collector:extend", {
				button : buttonId,
				divs : [ "letters", "numbers", "freetext", "mydate" ],
				requiredDivs : [],
				names : [ "l", "n", "f", "d" ],
				sendEventName : "myevent"
			});

			var input = $("#mydate input");
			input.val("invalid_date");
			input.change();
			expect(bus.send).not.toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
			input.val("2015-10-30");
			input.change();
			expect(bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
		});
	});
});