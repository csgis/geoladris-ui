define(["geoladris-tests"], function(tests) {
	describe("slider", function() {
		var bus;
		var injector;
		var module;
		var slider;
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init({}, {
				"nouislider": "../node_modules/nouislider/distribute/nouislider.min",
			});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require(["commons", "slider"], function(c, m) {
				commons = c;
				spyOn(commons, "linkDisplay").and.callThrough();

				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates div on create", function() {
			module({
				id: "myslider",
				parent: parentId,
				label: "Slider: "
			});

			var parent = document.getElementById(parentId);
			expect(parent.children.length).toBe(1);
			var container = parent.children[0];
			expect(container.children.length).toBe(2);
			var label = container.querySelectorAll("label");
			expect(label.length).toBe(1);
			expect(label[0].textContent).toBe("Slider: ");
			var slider = document.getElementById("myslider")
			expect(slider).not.toBe(null);
			expect(slider.parentNode).toBe(container);
		});

		it("hides label if no text on create", function() {
			module({
				id: "myslider",
				parent: parentId
			});

			var label = document.getElementById(parentId).querySelectorAll("label");
			expect(label.length).toBe(1);
			expect(label[0].style.display).toEqual("none");
		});

		it("adds values if specified on create", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 4, 5]
			});

			expect(slider.noUiSlider.options.range).toEqual({
				"min": 1,
				"75%": 4,
				"max": 5
			});
		});

		it("fills message on -field-value-fill", function() {
			module({
				id: "myslider",
				parent: parentId,
				values: [1, 4, 5]
			});

			var message = {};
			bus.send("myslider-field-value-fill", message);
			expect(message["myslider"]).toEqual(1);
		});

		it("sets values on set-values", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 4, 5]
			});

			bus.send("ui-slider:myslider:set-values", [
				[1, 2]
			]);
			expect(slider.noUiSlider.options.range).toEqual({
				"min": 1,
				"max": 2
			});
		});

		it("sets value on set-value", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 2, 5]
			});

			expect(parseInt(slider.noUiSlider.get())).toBe(1);
			bus.send("ui-slider:myslider:set-value", 2);
			expect(parseInt(slider.noUiSlider.get())).toBe(2);
		});

		it("sets value on creation if specified", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 2, 5],
				value: 2
			});

			expect(parseInt(slider.noUiSlider.get())).toBe(2);
		});

		it("uses snap if specified", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 2, 5],
				snap: true
			});

			expect(slider.noUiSlider.options.snap).toBe(true);
		});

		it("does not use snap by default", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 2, 5]
			});

			expect(slider.noUiSlider.options.snap).toBe(undefined);
		});

		it("links container visibility", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [1, 2, 5]
			});

			expect(commons.linkDisplay).toHaveBeenCalled();
			var args = commons.linkDisplay.calls.mostRecent().args;
			expect(args[0].id).toBe(slider.id);
			expect(args[1].id).toBe(slider.id + "-container");
		});

		it("supports date values", function(done) {
			var date1 = new Date("2017-01-25T00:00:00Z");
			var date2 = new Date("2017-03-02T00:00:00Z");
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [date1, date2],
				value: date1
			});

			slider.addEventListener("slide", function(e) {
				expect(e.detail.value).toEqual(date2);
				done();
			});

			slider.noUiSlider.__moveHandles(true, 100, [0]);
		});

		it("supports custom pips", function() {
			var slider = module({
				id: "myslider",
				parent: parentId,
				values: [0, 1, 2],
				value: 0,
				pips: function(value) {
					return "Value is: " + value;
				}
			});

			var e = slider.querySelector('.noUi-value.noUi-value-horizontal.noUi-value-large');
			expect(e.innerHTML).toBe("Value is: 0");
		});
	});
});
