define([ "jquery", "geoladris-tests" ], function($, tests) {
	var bus;
	var injector;

	describe("ui", function() {
		var parentId = "myparent";
		var div = "mydiv";

		beforeEach(function() {
			tests.replaceParent(parentId);
			$("<div/>").attr("id", div).appendTo($("#" + parentId));
		});

		it("changes element display on ui-show", function(done) {
			var initialization = tests.init("ui");
			bus = initialization.bus;
			injector = initialization.injector;
			injector.mock("layout/layout", {});

			injector.require([ "ui" ], function() {
				$("#" + div).css("display", "none");

				expect($("#" + div).css("display")).toBe("none");
				bus.send("ui-show", "mydiv");
				expect($("#" + div).css("display")).not.toBe("none");
				done();
			});
		});

		it("changes element display on ui-hide", function(done) {
			var initialization = tests.init("ui");
			bus = initialization.bus;
			injector = initialization.injector;
			injector.mock("layout/layout", {});

			injector.require([ "ui" ], function() {
				expect($("#" + div).css("display")).not.toBe("none");
				bus.send("ui-hide", "mydiv");
				expect($("#" + div).css("display")).toBe("none");
				done();
			});
		});

		it("changes element display on ui-toggle", function(done) {
			var initialization = tests.init("ui");
			bus = initialization.bus;
			injector = initialization.injector;
			injector.mock("layout/layout", {});

			injector.require([ "ui" ], function() {
				expect($("#" + div).css("display")).not.toBe("none");
				bus.send("ui-toggle", "mydiv");
				expect($("#" + div).css("display")).toBe("none");
				done();
			});
		});
	});
});