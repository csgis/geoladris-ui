define([ "jquery", "message-bus", "datatables" ], function($, bus) {
	bus.listen("ui-table:create", function(e, msg) {
		var table;
		var headers;

		var id = msg.div;

		var div = $("<div/>").attr("id", id);
		div.addClass(msg.css);

		$("#" + msg.parentDiv).append(div);

		bus.listen("ui-table:" + id + ":clear", function() {
			div.empty();
			table = null;
		});

		bus.listen("ui-table:" + id + ":set-data", function(e, data) {
			div.empty();
			headers = [];

			table = $("<table/>").appendTo(div);
			var head = $("<thead/>").appendTo(table);

			if (data.length > 0) {
				var tr = $("<tr/>").appendTo(head);
				for (attribute in data[0]) {
					headers.push(attribute);
					$("<th/>").html(attribute).appendTo(tr);
				}
			}

			for (var i = 0; i < data.length; i++) {
				var tr = $("<tr/>").appendTo(table);
				for (attribute in data[i]) {
					$("<td/>").html(data[i][attribute]).appendTo(tr);
				}
			}

			table = table.DataTable();

			table.on("click", "tr", function() {
				$(this).toggleClass("selected");

				var rows = table.rows(".selected").data().toArray();
				var selection = [];
				for (var i = 0; i < rows.length; i++) {
					var obj = {};
					for (var j = 0; j < headers.length; j++) {
						obj[headers[j]] = rows[i][j];
					}
					selection.push(obj);
				}

				bus.send("ui-table:" + id + ":data-selected", [ selection ]);
			});
		});

		bus.listen("ui-table:" + id + ":select-data", function(e, data) {
			if (!table) {
				return;
			}

			table.rows(function(index, row, node) {
				var equals;
				for (var i = 0; i < data.length && !equals; i++) {
					equals = true;
					for (var j = 0; j < headers.length; j++) {
						if (data[i][headers[j]] != row[j]) {
							equals = false;
							break;
						}
					}
				}

				if (equals) {
					$(node).addClass("selected");
				} else {
					$(node).removeClass("selected");
				}
			});
		});
	});
});
