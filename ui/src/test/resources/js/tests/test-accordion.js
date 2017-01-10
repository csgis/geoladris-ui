define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;

	describe("ui-accordion", function() {
		var parentId = "myparent";
		var accordionId = "myaccordion";
		var groupId = "mygroup";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-accordion" ], function() {
				done();
			});
			tests.replaceParent(parentId);
		});

		function initAccordion() {
			bus.send("ui-accordion:create", {
				div : accordionId,
				parentDiv : "myparent"
			});
		}

		function initGroup(visible) {
			bus.send("ui-accordion:add-group", {
				accordion : accordionId,
				id : groupId,
				title : "Accordion Group 1",
				visible : visible
			});
		}

		function header() {
			return $("#" + accordionId).children("#" + groupId + "-header");
		}

		function content() {
			return $("#" + accordionId).children("#" + groupId);
		}

		it("creates div on ui-accordion:create", function() {
			var id = "myaccordion";
			var css = "myaccordion-class";
			bus.send("ui-accordion:create", {
				div : id,
				parentDiv : "myparent",
				css : css
			});

			var accordion = $("#" + id);
			expect(accordion.length).toBe(1);
			expect(accordion.attr("class")).toBe(css);
		});

		it("adds header to accordion on add-group", function() {
			var title = "Accordion Group 1";
			initAccordion();
			bus.send("ui-accordion:add-group", {
				accordion : accordionId,
				id : "mygroup",
				title : title
			});

			var accordion = $("#" + accordionId);
			var header = accordion.children("#mygroup-header");
			expect(accordion.children().length).toBe(2);
			expect(header.length).toBe(1);
			expect(header.text()).toBe(title);
		});

		it("adds container to accordion on add-group", function() {
			initAccordion();
			initGroup();

			var accordion = $("#" + accordionId);
			expect(accordion.children().length).toBe(2);
			expect(accordion.children("#mygroup").length).toBe(1);
		});

		it("shows content if visible property on add-group", function() {
			initAccordion();
			initGroup();
			expect(content().css("visibility")).not.toBe("hidden");
		});

		it("ignores undefined properties on visibility", function() {
			initAccordion();
			initGroup(true);

			bus.send("ui-accordion:" + groupId + ":visibility", {});

			expect(header().css("visibility")).not.toBe("hidden");
			expect(content().css("visibility")).not.toBe("hidden");
		});

		it("updates header and content if specified on visibility", function() {
			initAccordion();
			initGroup();

			bus.send("ui-accordion:" + groupId + ":visibility", {
				header : false,
				content : false
			});

			expect(bus.send).toHaveBeenCalledWith("ui-hide", groupId);
			expect(bus.send).toHaveBeenCalledWith("ui-hide", groupId + "-header");
		});
	});
});