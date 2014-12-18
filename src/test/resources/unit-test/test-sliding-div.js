describe("ui-sliding-div", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var module = jasmine.createSpyObj("config", [ "config" ]);
		module.config.and.returnValue({});

		_initModule("ui-sliding-div", [ $, _bus, module ]);
	});

	it("creates a handle and a content div within a container on create", function() {
		_bus.send("ui-sliding-div:create", {
			div : "mysliding",
			parentDiv : parentId
		});

		var container = $("#" + parentId).children(".ui-sliding-div-container");
		expect(container.length).toBe(1);
		var handle = container.children(".ui-sliding-div-handle");
		expect(handle.length).toBe(1);
		var content = container.children("#mysliding");
		expect(content.length).toBe(1);
	});

	it("hides/shows the content when the handle is clicked", function() {
		_bus.send("ui-sliding-div:create", {
			div : "mysliding",
			parentDiv : parentId
		});

		var container = $("#" + parentId).children(".ui-sliding-div-container");
		var handle = container.children(".ui-sliding-div-handle");
		var content = container.children("#mysliding");

		expect(content.is(':visible')).toBe(false);
		handle.click();
		expect(content.is(':visible')).toBe(true);
	});

	it("shows on expand event", function() {
		_bus.send("ui-sliding-div:create", {
			div : "mysliding",
			parentDiv : parentId
		});

		var div = $("#mysliding");

		expect(div.is(':visible')).toBe(false);
		_bus.send("ui-sliding-div:expand", "mysliding");
		expect(div.is(':visible')).toBe(true);
	});

	it("hides on collapse event", function() {
		_bus.send("ui-sliding-div:create", {
			div : "mysliding",
			parentDiv : parentId
		});

		var div = $("#mysliding");
		var handle = div.siblings(".ui-sliding-div-handle");

		handle.click();

		expect(div.is(':visible')).toBe(true);
		_bus.send("ui-sliding-div:collapse", "mysliding");
		expect(div.is(':visible')).toBe(false);
	});

	it("toggles on toggle event", function() {
		_bus.send("ui-sliding-div:create", {
			div : "mysliding",
			parentDiv : parentId
		});

		var div = $("#mysliding");

		expect(div.is(':visible')).toBe(false);
		_bus.send("ui-sliding-div:toggle", "mysliding");
		expect(div.is(':visible')).toBe(true);
		_bus.send("ui-sliding-div:toggle", "mysliding");
		expect(div.is(':visible')).toBe(false);
	});
});