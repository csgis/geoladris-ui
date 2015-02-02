define([ "jquery", "message-bus", "datatables" ], function($, bus) {
	var ORDER_COLUMN_TYPE = "__gb__sorting__column_type__";

	function sortSelectedFirst(settings, col) {
		// We always get the first column because we won't use data at all
		// for ordering. We just the "selected" class of the <tr> element.
		var column = this.api().column(0, {
			order : "index"
		});
		return column.nodes().map(function(td, i) {
			return $(td).closest("tr").hasClass("selected") ? 0 : 1;
		});
	}

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

		bus.listen("ui-table:" + id + ":set-data", function(e, msg) {
			div.empty();
			headers = msg.fields;

			table = $("<table/>").appendTo(div);
			var head = $("<thead/>").appendTo(table);

			var tr = $("<tr/>").appendTo(head);
			for (var i = 0; i < headers.length; i++) {
				$("<th/>").html(headers[i]).appendTo(tr);
			}
			// Add empty header column to be used for custom ordering
			$("<th/>").appendTo(tr);

			for (var i = 0; i < msg.data.length; i++) {
				var tr = $("<tr/>").appendTo(table);
				for (var j = 0; j < headers.length; j++) {
					$("<td/>").html(msg.data[i][headers[j]]).appendTo(tr);
				}
				// Add hidden column with empty values to be used for custom
				// ordering
				$("<td/>").appendTo(tr);
			}

			table = table.DataTable({
				"columnDefs" : [ {
					"orderDataType" : ORDER_COLUMN_TYPE,
					"targets" : [ headers.length ],
					"visible" : false
				} ]
			});

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
						var value = data[i][headers[j]];
						if (value != row[j] && (value || row[j])) {
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

		bus.listen("ui-table:" + id + ":invert-selection", function() {
			var selection = [];
			table.rows(function(index, row, node) {
				var jqueryNode = $(node);
				if (jqueryNode.hasClass("selected")) {
					jqueryNode.removeClass("selected");
				} else {
					jqueryNode.addClass("selected");
					var obj = {};
					for (var j = 0; j < headers.length; j++) {
						obj[headers[j]] = row[j];
					}
					selection.push(obj);
				}
			});

			bus.send("ui-table:" + id + ":data-selected", [ selection ]);
		});

		bus.listen("ui-table:" + id + ":sort-selected-first", function() {
			$.fn.dataTable.ext.order[ORDER_COLUMN_TYPE] = sortSelectedFirst;
			table.order([ headers.length, "asc" ]).draw();
		});
	});
});
