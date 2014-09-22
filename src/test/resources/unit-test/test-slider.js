describe("ui-slider", function() {
	beforeEach(function() {
		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-slider", [ $, _bus ]);
	});

	it("calls ui-choice-field on create", function() {
		var msg = {
			div : "myslider",
			parent : "parent"
		};
		_bus.send("ui-slider:create", msg);
		expect(_bus.send).toHaveBeenCalledWith("ui-choice-field:create", msg);
	});

	it("calls ui-choice-field on add-item", function() {
		var msg = {
			div : "mychoice",
			value : "Four"
		};
		_bus.send("ui-slider:add-value", msg);
		expect(_bus.send).toHaveBeenCalledWith("ui-choice-field:add-value", msg);
	});
});