define([ "jquery", "geoladris-tests" ], function($, tests) {
	var bus;
	var injector;

	describe("ui", function() {
		var parentId = "myparent";
		var div = "mydiv";

		beforeEach(function() {
			tests.replaceParent(parentId);
			$("<div/>").attr("id", div).appendTo($("#" + parentId));

			var initialization = tests.init("ui", {}, {
				"tipsy" : "../jslib/tipsy/1.0.0a/jquery.tipsy"
			});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.mock("layout/layout", {});
		});

		it("changes element display on ui-show", function(done) {
			injector.require([ "ui" ], function() {
				$("#" + div).css("display", "none");
				expect($("#" + div).css("display")).toBe("none");
				bus.send("ui-show", "mydiv");
				expect($("#" + div).css("display")).not.toBe("none");
				done();
			});
		});

		it("changes element display on ui-hide", function(done) {
			injector.require([ "ui" ], function() {
				expect($("#" + div).css("display")).not.toBe("none");
				bus.send("ui-hide", "mydiv");
				expect($("#" + div).css("display")).toBe("none");
				done();
			});
		});

		it("changes element display on ui-toggle", function(done) {
			injector.require([ "ui" ], function() {
				expect($("#" + div).css("display")).not.toBe("none");
				bus.send("ui-toggle", "mydiv");
				expect($("#" + div).css("display")).toBe("none");
				done();
			});
		});

		it("adds a tooltip", function(done) {
			injector.require([ "ui" ], function(ui) {
				var tooltip = ui.tooltip(parentId, {
					text : "My tooltip"
				});
				expect(tooltip.parent).not.toBe(null);
				expect(tooltip.innerHTML.indexOf("My tooltip")).toBeGreaterThan(-1);
				done();
			});
		});
	});
});