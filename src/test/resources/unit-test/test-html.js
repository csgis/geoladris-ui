describe("ui-html", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.unbind();
		spyOn(_bus, "send").and.callThrough();

		var commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-html", [ $, _bus, commons ]);
	});

	it("creates a div with the specified html", function() {
		var content = "<p>This is <b>my</b> HTML content</p>";
		_bus.send("ui-html:create", {
			div : "myhtml",
			parentDiv : parentId,
			html : content
		});

		expect($("#" + parentId).children().length).toBe(1);
		expect($("#" + parentId).children("#myhtml").length).toBe(1);
		expect($("#myhtml").html()).toBe(content);
	});
});