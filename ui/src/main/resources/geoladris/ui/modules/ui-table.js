define([ "jquery", "message-bus", "./ui-commons", "datatables.net", "datatables.net-buttons", "datatables.net-colVis" ], function($, bus, commons) {
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

	return function(msg) {
		var table;
		var headers;
		var fields;

		var id = msg.id;
		var css = msg.css;
		var hasColumnSelection = msg.hasColumnSelection;
		var idColumn;

		var translations = msg.messages || {};
		var div = commons.getOrCreateElem("div", msg);

		bus.listen("ui-table:" + id + ":clear", function() {
			div.empty();
			table = null;
		});

		bus.listen("ui-table:" + id + ":set-data", function(e, msg) {
			div.empty();
			fields = msg.fields;
			headers = Object.keys(msg.fields);
			idColumn = msg.idColumn;

			table = $("<table/>").appendTo(div);
			table.addClass(css);
			var head = $("<thead/>").appendTo(table);

			var tr = $("<tr/>").appendTo(head);
			var i;
			for (i = 0; i < headers.length; i++) {
				$("<th/>").html(headers[i]).appendTo(tr);
			}
			// Add empty header column to be used for custom ordering
			$("<th/>").appendTo(tr);

			for (i = 0; i < msg.data.length; i++) {
				tr = $("<tr/>").appendTo(table);
				for (var j = 0; j < headers.length; j++) {
					var fieldName = msg.fields[headers[j]];
					$("<td/>").html(msg.data[i][fieldName]).appendTo(tr);
				}
				// Add hidden column with empty values to be used for custom
				// ordering
				$("<td/>").appendTo(tr);
			}

			var options = {
				"pageLength" : 12,
				"scrollX" : true,
				"scrollY" : "40vh",
				"lengthChange" : false,
				"columnDefs" : [ {
					"orderDataType" : ORDER_COLUMN_TYPE,
					"targets" : [ headers.length ],
					"visible" : false
				}, {
					"targets" : [ idColumn ],
					"visible" : false
				} ],
				"language" : translations
			};

			if (hasColumnSelection) {
				options.dom = 'Bfrtip';
				options.buttons = [ {
					"extend" : "colvis",
					"columns" : function(idx, data, node) {
						return idx != idColumn && idx != headers.length;
					},
					"text" : translations["columnVisibility"]
				} ];
			}

			table = table.DataTable(options);
			table.on("click", "tr", function() {
				$(this).toggleClass("selected");
				bus.send("ui-table:" + id + ":row-selection-changed", {
					id : table.row(this).data()[idColumn],
					selected : $(this).hasClass("selected")
				});
			});

			table.on("column-visibility.dt", function() {
				var columns = [];
				table.columns().every(function(i) {
					if (table.column(i).visible()) {
						columns.push(i);
					}
				});
				bus.send("ui-table:" + id + ":column-visibility-changed", [ columns ]);
			});

		});

		bus.listen("ui-table:" + id + ":adjust", function() {
			table.columns.adjust();
		});

		bus.listen("ui-table:" + id + ":select-data", function(e, ids) {
			if (!table) {
				return;
			}

			table.rows(function(index, row, node) {
				for (var i = 0; i < ids.length; i++) {
					if (row[idColumn] == ids[i]) {
						$(node).addClass("selected");
						return;
					}
				}

				$(node).removeClass("selected");
			});

			bus.send("ui-table:" + id + ":data-selected", [ ids ]);
		});

		bus.listen("ui-table:" + id + ":invert-selection", function() {
			var selection = [];
			table.rows(function(index, row, node) {
				var jqueryNode = $(node);
				if (jqueryNode.hasClass("selected")) {
					jqueryNode.removeClass("selected");
				} else {
					jqueryNode.addClass("selected");
					selection.push(row[idColumn]);
				}
			});

			bus.send("ui-table:" + id + ":data-selected", [ selection ]);
		});

		bus.listen("ui-table:" + id + ":sort-selected-first", function() {
			$.fn.dataTable.ext.order[ORDER_COLUMN_TYPE] = sortSelectedFirst;
			table.order([ headers.length, "asc" ]).draw();
		});

		bus.listen("ui-table:" + id + ":filter", function(e, text) {
			table.search(text).draw();
		});

		return table;
	}
});
