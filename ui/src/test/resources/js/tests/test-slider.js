define([ "geoladris-tests" ], function(tests) {
	describe("ui-slider", function() {
		var bus;
		var injector;
		var module;
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {}, {
				"nouislider" : "../jslib/nouislider/9.2.0/nouislider.min"
			});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-slider" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates div on create", function() {
			module({
				id : "myslider",
				parent : parentId,
				label : "Slider: "
			});

			expect($("#" + parentId).children().length).toBe(1);
			var container = $("#" + parentId).children();
			expect(container.children().length).toBe(2);
			var label = container.children("label");
			expect(label.length).toBe(1);
			expect(label.text()).toBe("Slider: ");
			expect(container.children("#myslider").length).toBe(1);
		});

		it("hides label if no text on create", function() {
			module({
				id : "myslider",
				parent : parentId
			});

			var label = $("#" + parentId).find("label");
			expect(label.length).toBe(1);
			expect(label[0].style.display).toEqual("none");
		});

		it("adds values if specified on create", function() {
			var slider = module({
				id : "myslider",
				parent : parentId,
				values : [ 1, 4, 5 ]
			});

			expect(slider[0].noUiSlider.options.range).toEqual({
				"min" : 1,
				"75%" : 4,
				"max" : 5
			});
		});

		it("fills message on -field-value-fill", function() {
			module({
				id : "myslider",
				parent : parentId,
				values : [ 1, 4, 5 ]
			});

			var message = {};
			bus.send("myslider-field-value-fill", message);
			expect(message["myslider"]).toEqual(1);
		});

		it("sets values on set-values", function() {
			var slider = module({
				id : "myslider",
				parent : parentId,
				values : [ 1, 4, 5 ]
			});

			bus.send("ui-slider:myslider:set-values", [ [ 1, 2 ] ]);
			expect(slider[0].noUiSlider.options.range).toEqual({
				"min" : 1,
				"max" : 2
			});
		});

		it("sets value on set-value", function() {
			var slider = module({
				id : "myslider",
				parent : parentId,
				values : [ 1, 2, 5 ]
			});

			expect(parseInt(slider[0].noUiSlider.get())).toBe(1);
			bus.send("ui-slider:myslider:set-value", 2);
			expect(parseInt(slider[0].noUiSlider.get())).toBe(2);
		});
	});
});