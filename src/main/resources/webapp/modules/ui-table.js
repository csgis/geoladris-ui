define([ "jquery", "message-bus" ], function($, bus) {
	bus.listen("ui-table:create", function(e, msg) {
		var id = msg.div;

		var div = $("<div/>").attr("id", id);
		div.addClass(msg.css);

		var table = $("<table/>");
		div.append(table);
		$("#" + msg.parentDiv).append(div);

		bus.listen("ui-table:" + id + ":clear", function() {
			table.empty();
		});

		bus.listen("ui-table:" + id + ":set-data", function(e, data) {
			table.empty();
			if (data.length > 0) {
				var tr = $("<tr/>").appendTo(table);
				for (attribute in data[0]) {
					$("<th/>").html(attribute).appendTo(tr);
				}
			}

			for (var i = 0; i < data.length; i++) {
				var tr = $("<tr/>").appendTo(table);
				for (attribute in data[i]) {
					$("<td/>").html(data[i][attribute]).appendTo(tr);
				}
			}
		});
	});
});
