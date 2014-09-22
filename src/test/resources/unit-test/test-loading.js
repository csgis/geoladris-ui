describe("ui-loading", function() {
	beforeEach(function() {
		var div = document.getElementById("loading-shade");
		if (div) {
			document.body.removeChild(div);
		}
		
		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var module = jasmine.createSpyObj("config", [ "config" ]);
		module.config.and.returnValue({});

		_initModule("ui-loading", [ $, _bus, module ]);
	});

	it("adds a hidden loading div on init", function() {
		// This comes from the ui-loading.js code
		var div = $("#loading-shade");
		expect(div.length).toBe(1);
		expect(div.css("display")).toEqual("none");
	});

	it("shows the loading div on start", function() {
		_bus.send("ui-loading:start", "Message");
		expect($("#loading-shade").css("display")).not.toEqual("none");
		expect($("#loading-msg").text()).toMatch("Message");
		
		// Free timers
		_bus.send("ui-loading:end", "Message");
	});

	it("hides the loading div on end", function() {
		_bus.send("ui-loading:start", "Message");
		_bus.send("ui-loading:end", "Message");
		expect($("#loading-shade").css("display")).toEqual("none");
	});

	it("handles multiple starts/ends with the same message", function() {
		_bus.send("ui-loading:start", "Message");
		_bus.send("ui-loading:start", "Message");
		expect($("#loading-shade").css("display")).not.toEqual("none");
		_bus.send("ui-loading:end", "Message");
		expect($("#loading-shade").css("display")).not.toEqual("none");
		_bus.send("ui-loading:end", "Message");
		expect($("#loading-shade").css("display")).toEqual("none");
	});
});