define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;

	describe("ui-dialog", function() {
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-dialog" ], function() {
				done();
			});
			tests.replaceParent(parentId);
		});

		it("creates div on ui-dialog:create", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId
			});

			var container = $("#" + parentId).children();
			expect(container.length).toBe(1);
			expect(container.children("#mydialog").length).toBe(1);
		});

		it("does not create the same dialog twice", function() {
			for (var i = 0; i < 10; i++) {
				bus.send("ui-dialog:create", {
					div : "mydialog",
					parentDiv : parentId
				});
			}

			var container = $("#" + parentId).children();
			expect(container.length).toBe(1);
			expect(container.children("#mydialog").length).toBe(1);
		});

		it("hides the dialog on init if !visible specified", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId
			});
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
		});

		it("shows the dialog on init if visible specified", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				visible : true
			});
			expect(bus.send).toHaveBeenCalledWith("ui-show", "mydialog");
		});

		it("adds a shade behind the dialog if modal", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				modal : true
			});

			var container = $("#" + parentId).children();
			expect(container).not.toEqual($("#" + parentId).find("#mydialog"));
			expect(container.hasClass("dialog-modal")).toBe(true);
		});

		it("adds a title if specified", function() {
			var text = "Dialog Title";
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				title : text
			});

			var title = $("#mydialog").children(".dialog-title");
			expect(title.length).toBe(1);
			expect(title.text()).toBe(text);
		});

		it("adds a close button if specified", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				closeButton : true
			});

			var close = $("#mydialog").children(".dialog-close");
			expect(close.length).toBe(1);
		});

		it("hides the dialog on close button clicked", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				closeButton : true
			});

			var close = $("#mydialog").children(".dialog-close");
			close.trigger("click");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
		});

		it("hides the shade when dialog is hidden if modal", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				modal : true,
				visible : true
			});

			expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
			bus.send("ui-hide", "mydialog");
			expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
		});
		it("shows the shade when dialog is shown if modal", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				modal : true,
				visible : false
			});

			expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
			bus.send("ui-show", "mydialog");
			expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
		});

		it("toggles the shade when dialog is toggled if modal", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				modal : true,
				visible : true
			});

			expect($("#" + parentId).children(".dialog-modal").css("display")).not.toBe("none");
			bus.send("ui-toggle", "mydialog");
			expect($("#" + parentId).children(".dialog-modal").css("display")).toBe("none");
		});

		it("shows the latest dialog on top of the others when ui-show", function() {
			bus.send("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				visible : false
			});
			bus.send("ui-dialog:create", {
				div : "mydialog2",
				parentDiv : parentId,
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

		it("creates a modal dialog ui-confirm-dialog:create", function() {
			var messages = {
				question : "??",
				ok : "Yes",
				cancel : "No"
			};
			bus.send("ui-confirm-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				css : "mydialog-class",
				modal : false,
				messages : messages
			});

			var container = $("#" + parentId).children();
			expect(container.length).toBe(1);
			var dialog = container.children("#mydialog");
			expect(dialog.length).toBe(1);

			expect(bus.send).toHaveBeenCalledWith("ui-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				modal : true,
				css : "mydialog-class ui-confirm-dialog",
				messages : messages
			});
			expect(bus.send).toHaveBeenCalledWith("ui-html:create", {
				div : "mydialog-message",
				parentDiv : "mydialog",
				css : "ui-confirm-dialog-message",
				html : messages.question
			});
			expect(bus.send).toHaveBeenCalledWith("ui-button:create", {
				div : "mydialog-ok",
				parentDiv : "mydialog-confirm-buttons-container",
				css : "dialog-ok-button ui-confirm-dialog-ok",
				text : messages.ok,
				sendEventName : "ui-confirm-dialog:mydialog:ok"
			});
			expect(bus.send).toHaveBeenCalledWith("ui-button:create", {
				div : "mydialog-cancel",
				parentDiv : "mydialog-confirm-buttons-container",
				css : "dialog-ok-button ui-confirm-dialog-cancel",
				text : messages.cancel,
				sendEventName : "ui-confirm-dialog:mydialog:cancel"
			});
		});

		it("does not add an html with the question if not provided", function() {
			bus.send("ui-confirm-dialog:create", {
				div : "mydialog",
				parentDiv : parentId,
				css : "mydialog-class",
				modal : false,
				messages : {
					ok : "Yes",
					cancel : "No"
				}
			});

			expect(bus.send).not.toHaveBeenCalledWith("ui-html:create");
		});

		it("hides the confirm dialog on ok", function() {
			bus.send("ui-confirm-dialog:create", {
				div : "mydialog",
				parentDiv : parentId
			});
			var container = $("#" + parentId).children();
			var dialog = container.children("#mydialog");
			bus.send("ui-confirm-dialog:mydialog:ok");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
		});

		it("hides the confirm dialog on cancel", function() {
			bus.send("ui-confirm-dialog:create", {
				div : "mydialog",
				parentDiv : parentId
			});

			var container = $("#" + parentId).children();
			var dialog = container.children("#mydialog");
			bus.send("ui-confirm-dialog:mydialog:cancel");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "mydialog");
		});
	});
});
