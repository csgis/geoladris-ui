define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;
	var parentId = "center";

	describe("ui-alerts", function() {
		// This comes from ui-alerts.js
		var containerId = "ui-alerts-container";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-alerts" ], function() {
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates a container on init", function() {
			expect($("#" + containerId).length).toBe(1);
			expect($("#" + containerId).children().length).toBe(0);
		});

		it("adds a div to the container on ui-alert", function() {
			bus.send("ui-alert", {
				message : "Message",
				severity : "danger"
			});
			expect($("#" + containerId).children().length).toBe(1);
		});

		it("adds a close button to the alert div on ui-alert", function() {
			bus.send("ui-alert", {
				message : "Message",
				severity : "danger"
			});

			var container = $("#" + containerId);
			var alertDiv = $(container.children()[0]);
			expect(alertDiv.children().length).toBe(1);
			expect($(alertDiv.children()[0]).attr("class")).toBe("ui-alerts-close");
		});

		it("set the specified message on ui-alert", function() {
			bus.send("ui-alert", {
				message : "Message",
				severity : "danger"
			});

			var container = $("#" + containerId);
			var alertDiv = $(container.children()[0]);
			expect(alertDiv.text()).toBe("Message");
		});

		it("set css class on the alert div depending on the severity", function() {
			bus.send("ui-alert", {
				message : "Message",
				severity : "danger"
			});

			var container = $("#" + containerId);
			var alertDiv = $(container.children()[0]);
			expect(alertDiv.attr("class")).toMatch("ui-alert-danger");
		});
	});
});