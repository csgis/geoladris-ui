describe("ui-form-collector", function() {
	var parentId = "myparent";
	var buttonId = "mybutton";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-choice-field", [ $, _bus ]);
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
});