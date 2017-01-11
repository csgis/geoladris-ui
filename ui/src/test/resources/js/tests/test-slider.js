define([ "geoladris-tests" ], function(tests) {
	describe("ui-slider", function() {
		var bus;
		var injector;
		var module;
		var choice;

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;

			choice = jasmine.createSpy();
			injector.mock("ui-choice-field", choice);
			injector.require([ "ui-slider" ], function(m) {
				module = m;
				done();
			});
		});

		it("calls ui-choice-field on create", function() {
			var msg = {
				id : "myslider",
				parent : "parent"
			};
			module(msg);
			expect(choice).toHaveBeenCalledWith(msg);
		});

		it("calls ui-choice-field on add-item", function() {
			var msg = {
				id : "myslider",
				parent : "parent"
			};
			module(msg);

			bus.send("ui-slider:myslider:add-value", "Four");
			expect(bus.send).toHaveBeenCalledWith("ui-choice-field:myslider:add-value", "Four");
		});
	});
});