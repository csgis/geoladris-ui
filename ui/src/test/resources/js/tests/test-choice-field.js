define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;
	var choice;

	describe("ui-choice-field", function() {
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-choice-field" ], function(module) {
				choice = module;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates div on ui-choice-field:create", function() {
			choice({
				id : "mychoice",
				parent :parentId
			});

			expect($("#" + parentId).children().length).toBe(1);
			expect($("#" + parentId).children("#mychoice").length).toBe(1);
		});

		it("adds label if specified on create", function() {
			var text = "Choice: ";
			choice({
				id : "mychoice",
				parent :parentId,
				label : text
			});

			var label = $("#mychoice").find("label");
			expect(label.length).toBe(1);
			expect(label.text()).toEqual(text);
		});

		it("adds values if specified on create", function() {
			choice({
				id : "mychoice",
				parent :parentId,
				values : [ "One", "Two", "Three" ]
			});

			var combo = $("#mychoice").find("select");
			expect(combo.length).toBe(1);
			expect(combo.children().length).toBe(3);
		});

		it("fills message on -field-value-fill", function() {
			choice({
				id : "mychoice",
				parent :parentId,
				values : [ "One", "Two", "Three" ]
			});

			var message = {};
			bus.send("mychoice-field-value-fill", message);
			expect(message["mychoice"]).toEqual("One");
		});

		it("sets values on set-values", function() {
			choice({
				id : "mychoice",
				parent :parentId,
				values : [ "One", "Two", "Three" ]
			});

			bus.send("ui-choice-field:mychoice:set-values", [ [ "1", "2" ] ]);

			var combo = $("#mychoice").find("select");
			expect(combo.length).toBe(1);
			expect(combo.children("option:eq(0)").text()).toBe("1");
			expect(combo.children("option:eq(1)").text()).toBe("2");
		});
	});
});