define([ "geoladris-tests" ], function(tests) {
	describe("ui-dialog", function() {
		var bus;
		var injector;
		var module;
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-dialog" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates div on ui-dialog:create", function() {
			module({
				id : "mydialog",
				parent : parentId
			});

			var container = $("#" + parentId).children();
			expect(container.length).toBe(1);
			expect(container.children("#mydialog").length).toBe(1);
		});

		it("does not create the same dialog twice", function() {
			for (var i = 0; i < 10; i++) {
				module({
					id : "mydialog",
					parent : parentId
				});
			}

			var container = $("#" + parentId).children();
			expect(container.length).toBe(1);
			expect(container.children("#mydialog").length).toBe(1);
		});

		it("hides the dialog on init if !visible specified", function() {
			module({
				id : "mydialog",
				parent : parentId
			});
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
		});

		it("shows the dialog on init if visible specified", function() {
			module({
				id : "mydialog",
				parent : parentId,
				visible : true
			});
			expect(bus.send).toHaveBeenCalledWith("ui-show", "mydialog");
		});

		it("adds a shade behind the dialog if modal", function() {
			module({
				id : "mydialog",
				parent : parentId,
				modal : true
			});

			var container = $("#" + parentId).children();
			expect(container).not.toEqual($("#" + parentId).find("#mydialog"));
			expect(container.hasClass("dialog-modal")).toBe(true);
		});

		it("adds a title if specified", function() {
			var text = "Dialog Title";
			module({
				id : "mydialog",
				parent : parentId,
				title : text
			});

			var title = $("#mydialog").children(".dialog-title");
			expect(title.length).toBe(1);
			expect(title.text()).toBe(text);
		});

		it("adds a close button if specified", function() {
			module({
				id : "mydialog",
				parent : parentId,
				closeButton : true
			});

			var close = $("#mydialog").children(".dialog-close");
			expect(close.length).toBe(1);
		});

		it("hides the dialog on close button clicked", function() {
			module({
				id : "mydialog",
				parent : parentId,
				closeButton : true
			});

			var close = $("#mydialog").children(".dialog-close");
			close.trigger("click");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
		});

		it("hides the shade when dialog is hidden if modal", function() {
			module({
				id : "mydialog",
				parent : parentId,
				modal : true,
				visible : true
			});

			expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
			bus.send("ui-hide", "mydialog");
			expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
		});
		it("shows the shade when dialog is shown if modal", function() {
			module({
				id : "mydialog",
				parent : parentId,
				modal : true,
				visible : false
			});

			expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
			bus.send("ui-show", "mydialog");
			expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
		});

		it("toggles the shade when dialog is toggled if modal", function() {
			module({
				id : "mydialog",
				parent : parentId,
				modal : true,
				visible : true
			});

			expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
			bus.send("ui-toggle", "mydialog");
			expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
		});

		it("shows the latest dialog on top of the others when ui-show", function() {
			module({
				id : "mydialog",
				parent : parentId,
				visible : false
			});
			module({
				id : "mydialog2",
				parent : parentId,
				visible : false
			});

			var container1 = $("#mydialog").parent();
			var container2 = $("#mydialog2").parent();

			// Mock CSS rules
			var cssRules = {
				"position" : "absolute",
				"z-index" : 2000,
				"display" : "none"
			};
			container1.css(cssRules);
			container2.css(cssRules);

			bus.send("ui-show", "mydialog");
			expect(container1.css("z-index")).toBe("2000");
			expect(container2.css("z-index")).toBe("2000");
			bus.send("ui-show", "mydialog2");
			expect(container1.css("z-index")).toBe("2000");
			expect(container2.css("z-index")).toBe("2001");
			bus.send("ui-toggle", "mydialog2");
			bus.send("ui-toggle", "mydialog2");
			expect(container2.css("z-index")).toBe("2002");
		});
	});
});
