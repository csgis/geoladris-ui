describe("ui-exclusive-list", function() {
	beforeEach(function() {
		_bus.unbind();
		commons = _initModule("ui-commons", [ $ ]);
		_initModule("ui-exclusive-list", [ $, _bus, commons ]);
	});

	it("set-item", function() {
		var id = "osm";
		var div = $("<input id='" + id + "' type='radio'\>");
		$("body").append(div);

		expect($("#" + id).get(0).checked).toBe(false);
		_bus.send("ui-exclusive-list:set-item", id);
		expect($("#" + id).get(0).checked).toBe(true);

		div.remove();
	});
});