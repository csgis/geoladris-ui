define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;
	var module;

	describe("ui-accordion", function() {
		var parentId = "myparent";
		var groupId = "mygroup";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-accordion" ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		function initGroup(visible) {
			module({
				id : groupId,
				parent : parentId,
				title : "Accordion Group 1",
				visible : visible
			});
		}

		function header() {
			return $("#" + parentId).children("#" + groupId + "-header");
		}

		function content() {
			return $("#" + parentId).children("#" + groupId);
		}

		it("adds header on create", function() {
			var title = "Accordion Group 1";
			module({
				id : "mygroup",
				parent : parentId,
				title : title
			});

			var parent = $($("#" + parentId).children()[0]);
			var header = parent.children("#mygroup-header");
			expect(parent.children().length).toBe(2);
			expect(header.length).toBe(1);
			expect(header.hasClass("accordion-header")).toBe(true);
			expect(header.children("p").hasClass("accordion-header-text")).toBe(true);
			expect(header.text()).toBe(title);
		});

		it("adds container on create", function() {
			initGroup();

			var parent = $($("#" + parentId).children()[0]);
			expect(parent.children().length).toBe(2);
			expect(parent.children("#mygroup").length).toBe(1);
		});

		it("shows content if visible property on add-group", function() {
			initGroup();
			expect(content().css("visibility")).not.toBe("hidden");
		});

		it("ignores undefined properties on visibility", function() {
			initGroup(true);

			bus.send("ui-accordion:" + groupId + ":visibility", {});

			expect(header().css("visibility")).not.toBe("hidden");
			expect(content().css("visibility")).not.toBe("hidden");
		});

		it("updates header and content if specified on visibility", function() {
			initGroup();

			bus.send("ui-accordion-group:" + groupId + ":visibility", {
				header : false,
				content : false
			});

			expect(bus.send).toHaveBeenCalledWith("ui-hide", groupId);
			expect(bus.send).toHaveBeenCalledWith("ui-hide", groupId + "-header");
		});
	});
});