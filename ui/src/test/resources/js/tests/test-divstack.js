define([ "geoladris-tests" ], function(tests) {
	var bus;
	var injector;

	describe("ui-divstack", function() {
		var parentId = "myparent";

		beforeEach(function(done) {
			var initialization = tests.init("ui", {});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ "ui-divstack" ], function() {
				done();
			});
			tests.replaceParent(parentId);
		});

		it("hides other divs of stack on create", function() {
			var ids = [ "id1", "id2", "id3" ];
			for (var i = 0; i < ids.length; i++) {
				var div = document.createElement('div');
				div.setAttribute("id", parentId);
				document.getElementById(parentId).appendChild(div);
			}

			bus.send("ui-divstack:create", {
				divs : ids
			});

			expect(bus.send).toHaveBeenCalledWith("ui-hide", "id2");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "id3");

		});

		it("hides other divs of stack on ui-show", function() {
			var ids = [ "id1", "id2", "id3" ];
			for (var i = 0; i < ids.length; i++) {
				var div = document.createElement('div');
				div.setAttribute("id", parentId);
				document.getElementById(parentId).appendChild(div);
			}

			bus.send("ui-divstack:create", {
				divs : ids
			});
			bus.send("ui-show", "id3");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "id1");
			expect(bus.send).toHaveBeenCalledWith("ui-hide", "id2");
		});
	});
});