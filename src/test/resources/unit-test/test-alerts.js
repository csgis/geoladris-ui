describe("ui-alerts", function() {
	var layout = {
		center : "layout-center"
	};

	// This comes from ui-alerts.js
	var containerId = "ui-alerts-container";

	beforeEach(function() {
		replaceParent(layout.center);

		_bus.stopListenAll();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);

		var module = jasmine.createSpyObj("config", [ "config" ]);
		module.config.and.returnValue({});
		_initModule("ui-alerts", [ $, _bus, commons, layout, module ]);
	});

	it("creates a container on init", function() {
		expect($("#" + containerId).length).toBe(1);
		expect($("#" + containerId).children().length).toBe(0);
	});

	it("adds a div to the container on ui-alert", function() {
		_bus.send("ui-alert", {
			message : "Message",
			severity : "danger"
		});
		expect($("#" + containerId).children().length).toBe(1);
	});

	it("adds a close button to the alert div on ui-alert", function() {
		_bus.send("ui-alert", {
			message : "Message",
			severity : "danger"
		});

		var container = $("#" + containerId);
		var alertDiv = $(container.children()[0]);
		expect(alertDiv.children().length).toBe(1);
		expect($(alertDiv.children()[0]).attr("class")).toBe("ui-alerts-close");
	});

	it("set the specified message on ui-alert", function() {
		_bus.send("ui-alert", {
			message : "Message",
			severity : "danger"
		});

		var container = $("#" + containerId);
		var alertDiv = $(container.children()[0]);
		expect(alertDiv.text()).toBe("Message");
	});

	it("set css class on the alert div depending on the severity", function() {
		_bus.send("ui-alert", {
			message : "Message",
			severity : "danger"
		});

		var container = $("#" + containerId);
		var alertDiv = $(container.children()[0]);
		expect(alertDiv.attr("class")).toMatch("ui-alert-danger");
	});
});