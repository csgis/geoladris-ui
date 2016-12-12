describe("ui-divstack", function() {
	var parentId = "myparent";

	beforeEach(function() {
		replaceParent(parentId);

		_bus.stopListenAll();
		spyOn(_bus, "send").and.callThrough();

		_initModule("ui-divstack", [ $, _bus ]);
	});

	it("hides other divs of stack on create", function() {
		var ids = [ "id1", "id2", "id3" ];
		for (var i = 0; i < ids.length; i++) {
			var div = document.createElement('div');
			div.setAttribute("id", parentId);
			document.getElementById(parentId).appendChild(div);
		}

		_bus.send("ui-divstack:create", {
			divs : ids
		});

		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "id2");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "id3");

	});

	it("hides other divs of stack on ui-show", function() {
		var ids = [ "id1", "id2", "id3" ];
		for (var i = 0; i < ids.length; i++) {
			var div = document.createElement('div');
			div.setAttribute("id", parentId);
			document.getElementById(parentId).appendChild(div);
		}

		_bus.send("ui-divstack:create", {
			divs : ids
		});
		_bus.send("ui-show", "id3");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "id1");
		expect(_bus.send).toHaveBeenCalledWith("ui-hide", "id2");
	});
});