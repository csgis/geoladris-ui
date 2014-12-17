describe("ui-sliding-div", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-sliding-div", [ $, _bus ]);
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
});