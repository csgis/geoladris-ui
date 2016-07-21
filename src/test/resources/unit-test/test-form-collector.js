describe("ui-form-collector", function() {
	var parentId = "myparent";
	var buttonId = "mybutton";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-choice-field", [ $, _bus, commons ]);
		_initModule("ui-input-field", [ $, _bus, commons ]);
		_initModule("ui-form-collector", [ $, _bus ]);

		_bus.send("ui-choice-field:create", {
			div : "letters",
			parentDiv : parentId,
			values : [ "A", "B", "C" ]
		});
		_bus.send("ui-choice-field:create", {
			div : "numbers",
			parentDiv : parentId,
			values : [ "1", "2", "3" ]
		});
		_bus.send("ui-input-field:create", {
			div : "freetext",
			parentDiv : parentId
		});

		var button = document.createElement("div");
		button.setAttribute("id", buttonId);
		document.getElementById(parentId).appendChild(button);
	});

	it("sends event on button click", function() {
		_bus.send("ui-form-collector:extend", {
			button : buttonId,
			divs : [ "letters", "numbers" ],
			sendEventName : "myevent"
		});
		$("#" + buttonId).trigger("click");

		expect(_bus.send).toHaveBeenCalledWith("myevent", {
			letters : "A",
			numbers : "1"
		});
	});

	it("translates event message if names specified", function() {
		_bus.send("ui-form-collector:extend", {
			button : buttonId,
			divs : [ "letters", "numbers" ],
			names : [ "l", "n" ],
			sendEventName : "myevent"
		});
		$("#" + buttonId).trigger("click");

		expect(_bus.send).toHaveBeenCalledWith("myevent", {
			l : "A",
			n : "1"
		});
	});

	it("disables button if any of the requiredDivs have no value", function() {
		_bus.send("ui-form-collector:extend", {
			button : buttonId,
			divs : [ "letters", "numbers", "freetext" ],
			requiredDivs : [ "freetext" ],
			names : [ "l", "n", "f" ],
			sendEventName : "myevent"
		});

		var input = $("#freetext input");
		input.val("");
		input.change();
		expect(_bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", false);
	});

	it("enables button if all the requiredDivs have a not empty value", function() {
		_bus.send("ui-form-collector:extend", {
			button : buttonId,
			divs : [ "letters", "numbers", "freetext" ],
			requiredDivs : [ "freetext" ],
			names : [ "l", "n", "f" ],
			sendEventName : "myevent"
		});

		expect(_bus.send).not.toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
		var input = $("#freetext input");
		input.val("not empty");
		input.change();
		expect(_bus.send).toHaveBeenCalledWith("ui-button:" + buttonId + ":enable", true);
	});
});