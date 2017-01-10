define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;

	describe("ui-slider", function() {
		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-slider" ], function() {
				done();
			});
		});

		it("calls ui-choice-field on create", function() {
			var msg = {
				div : "myslider",
				parent : "parent"
			};
			bus.send("ui-slider:create", msg);
			expect(bus.send).toHaveBeenCalledWith("ui-choice-field:create", msg);
		});

		it("calls ui-choice-field on add-item", function() {
			var msg = {
				div : "myslider",
				parent : "parent"
			};
			bus.send("ui-slider:create", msg);

			bus.send("ui-slider:myslider:add-value", "Four");
			expect(bus.send).toHaveBeenCalledWith("ui-choice-field:myslider:add-value", "Four");
		});
	});
});