define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;

	describe("ui-html", function() {
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-html" ], function() {
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates a div with the specified html", function() {
			var content = "<p>This is <b>my</b> HTML content</p>";
			bus.send("ui-html:create", {
				div : "myhtml",
				parentDiv : parentId,
				html : content
			});

			expect($("#" + parentId).children().length).toBe(1);
			expect($("#" + parentId).children("#myhtml").length).toBe(1);
			expect($("#myhtml").html()).toBe(content);
		});
	});
});