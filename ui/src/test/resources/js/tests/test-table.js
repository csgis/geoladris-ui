define([ "geoladris-tests" ], function(tests) {
  describe("table", function() {
    var bus;
    var injector;
    var module;
    var parentId = "myparent";

    beforeEach(function(done) {
      var initialization = tests.init("ui", {}, {
        "datatables.net" : "../jslib/datatables/1.10.11/jquery.dataTables.min",
        "datatables.net-buttons" : "../jslib/datatables/1.10.11/dataTables.buttons.min",
        "datatables.net-colVis" : "../jslib/datatables/1.10.11/buttons.colVis.min"
      });
      bus = initialization.bus;
      injector = initialization.injector;
      injector.require([ "table" ], function(m) {
        module = m;
        done();
      });
      tests.replaceParent(parentId);
    });

    it("creates an empty container on create", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      expect($("#mytable").length).toBe(1);
      expect($("#mytable").children().length).toBe(0);
    });

    it("sets data on set-data", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      // There are two tables: header + data. We get the second table
      expect($("#mytable").find("table").length).toBe(0);
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "a",
          number : 1
        }, {
          letter : "b",
          number : 2
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });

      // 2 data rows + 1 header
      var table = $("#mytable").find("table:eq(1)");
      expect(table.find("tr").length).toBe(3);
    });

    it("replaces previous data on set-data", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      expect($("#mytable").find("table").length).toBe(0);
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "a",
          number : 1
        }, {
          letter : "b",
          number : 2
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "c",
          number : 3
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });
      // 1 data row + 1 header
      var table = $("#mytable").find("table:eq(1)");
      expect(table.find("tr").length).toBe(2);
    });

    it("clears table on clear", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "c",
          number : 3
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });
      // 1 data row + 1 header
      var table = $("#mytable").find("table:eq(1)");
      expect(table.find("tr").length).toBe(2);
      bus.send("ui-table:mytable:clear");
      expect($("#mytable").find("table").length).toBe(0);
    });

    it("selects and sends row-selection-changed on row click", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "a",
          number : "1"
        }, {
          letter : "b",
          number : "2"
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        },
        idColumn : 0
      });

      // index is 2 because row 0 is the header
      var row = $("#mytable").find("table:eq(1)").find("tr:eq(2)");
      row.click();
      expect(row.hasClass("selected")).toBe(true);
      expect(bus.send).toHaveBeenCalledWith("ui-table:mytable:row-selection-changed", {
        id : "b",
        selected : true
      });

      row.click();
      expect(row.hasClass("selected")).toBe(false);
      expect(bus.send).toHaveBeenCalledWith("ui-table:mytable:row-selection-changed", {
        id : "b",
        selected : false
      });
    });

    it("selects rows on select-data", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "a",
          number : "1"
        }, {
          letter : "b",
          number : "2"
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        },
        idColumn : 0
      });

      // indexes are 1 and 2 because row 0 is the header
      var table = $("#mytable").find("table:eq(1)");
      var row1 = table.find("tr:eq(1)");
      var row2 = table.find("tr:eq(2)");
      expect(row1.hasClass("selected")).toBe(false);
      expect(row2.hasClass("selected")).toBe(false);

      bus.send("ui-table:mytable:select-data", [ [ "b" ] ]);

      row1 = table.find("tr:eq(1)");
      row2 = table.find("tr:eq(2)");
      expect(row1.hasClass("selected")).toBe(false);
      expect(row2.hasClass("selected")).toBe(true);
    });

    it("adds/removes selected class from rows on invert-selection", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      module(msg);
      bus.send("ui-table:mytable:set-data", {
        data : [ {
          letter : "a",
          number : "1"
        }, {
          letter : "b",
          number : "2"
        } ],
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });

      // There are two tables: header + data. We get the second table
      var table = $("#mytable").find("table:eq(1)");
      // indexes are 1 and 2 because row 0 is the header
      var row1 = table.find("tr:eq(1)");
      var row2 = table.find("tr:eq(2)");
      row1.addClass("selected");

      expect(row1.hasClass("selected")).toBe(true);
      expect(row2.hasClass("selected")).toBe(false);
      bus.send("ui-table:mytable:invert-selection");
      expect(row1.hasClass("selected")).toBe(false);
      expect(row2.hasClass("selected")).toBe(true);
    });

    it("sends data-selected on invert-selection", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      var data = [ {
        letter : "a",
        number : "1"
      }, {
        letter : "b",
        number : "2"
      } ];
      module(msg);
      bus.send("ui-table:mytable:set-data", {
        data : data,
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        },
        idColumn : 0
      });

      bus.send("ui-table:mytable:invert-selection");
      expect(bus.send).toHaveBeenCalledWith("ui-table:mytable:data-selected", [ [ "a", "b" ] ]);
    });

    it("moves selected rows to top on sort-selected-first", function() {
      var msg = {
        id : "mytable",
        parent : parentId
      };

      var data = [ {
        letter : "a",
        number : "1"
      }, {
        letter : "b",
        number : "2"
      }, {
        letter : "c",
        number : "3"
      } ];
      module(msg);
      bus.send("ui-table:mytable:set-data", {
        data : data,
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        },
        idColumn : 1
      });
      bus.send("ui-table:mytable:select-data", [ [ "2" ] ]);
      bus.send("ui-table:mytable:sort-selected-first");

      // There are two tables: header + data. We get the second table
      var table = $("#mytable").find("table:eq(1)");
      var row1 = table.find("tr:eq(1)");
      var row2 = table.find("tr:eq(2)");
      var row3 = table.find("tr:eq(3)");
      expect(row1.find("td:eq(0)").text()).toBe("b");
      expect(row2.find("td:eq(0)").text()).toBe("a");
      expect(row3.find("td:eq(0)").text()).toBe("c");
    });

    it("applies CSS classes to <div> container and <table>", function() {
      var css = "my-table-class";

      module({
        id : "mytable",
        parent : parentId,
        css : css
      });

      bus.send("ui-table:mytable:set-data", {
        data : [],
        fields : {}
      });

      var table = $("#mytable").find("table");
      table.each(function() {
        expect($(this).hasClass(css)).toBe(true);
      });
    });

    it("sends 'data-selected' after selecting data with 'select-data'", function() {
      var data = [ {
        letter : "a",
        number : "1"
      }, {
        letter : "b",
        number : "2"
      }, {
        letter : "c",
        number : "3"
      } ];
      module({
        id : "mytable",
        parent : parentId
      });
      bus.send("ui-table:mytable:set-data", {
        data : data,
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });
      bus.send("ui-table:mytable:select-data", [ data ]);
      expect(bus.send).toHaveBeenCalledWith("ui-table:mytable:data-selected", [ data ]);
    });

    it("filters data on 'filter'", function() {
      var data = [ {
        letter : "a",
        number : "1"
      }, {
        letter : "b",
        number : "2"
      }, {
        letter : "c",
        number : "3"
      } ];
      module({
        id : "mytable",
        parent : parentId
      });
      bus.send("ui-table:mytable:set-data", {
        data : data,
        fields : {
          "Letter" : "letter",
          "Nr." : "number"
        }
      });
      bus.send("ui-table:mytable:filter", "3");
      var rows = $("#mytable").find("table:eq(1)").find("tr");
      // Header + single row = 2
      expect(rows.length).toBe(2);
    });
  });
});