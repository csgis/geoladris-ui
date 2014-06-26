define([ "jquery", "message-bus", "ui-commons" ], function($, bus, commons) {
	bus.listen("ui-text-area", function(e, msg) {
		var id = msg["div"];
		var div = commons.getOrCreateDiv(id, msg["parentDiv"], function() {
			return $("<textarea id=''/>").attr("id", id + "_textarea");
		});

		var dataGetter = msg["data-getter"];
		if (dataGetter) {
			dataGetter(function(text) {
				div.find("textarea").val(text);
			});
		}
	});
});