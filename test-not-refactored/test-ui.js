define([ 'jquery', 'geoladris-tests' ], function($, tests) {
	var bus;
	var injector;

	describe('ui', function() {
		var parentId = 'myparent';
		var div = 'mydiv';
		var ui;

		beforeEach(function(done) {
			tests.replaceParent(parentId);
			var e = document.createElement('div');
			e.id = div;
			document.getElementById(parentId).appendChild(e);
			var initialization = tests.init({}, {
				'nouislider': '../node_modules/nouislider/distribute/nouislider.min',
				'sortable': '../node_modules/sortablejs/Sortable.min',
				'datatables.net': '../jslib/datatables.net',
				'datatables.net-buttons': '../jslib/datatables.net-buttons',
				'datatables.net-colVis': '../jslib/datatables.net-colVis'
			});
			bus = initialization.bus;
			injector = initialization.injector;
			injector.mock('tooltip.js', {});
			injector.require([ 'ui' ], function(m) {
				ui = m;
				done();
			});
		});

		it('changes element display on ui-show', function() {
			document.getElementById(div).style.display = 'none';
			bus.send('ui-show', 'mydiv');
			expect(document.getElementById(div).style.display).toBe('');
		});

		it('changes element display on ui-hide', function() {
			var e = document.getElementById(div);
			bus.send('ui-show', 'mydiv');
			expect(e.style.display).toBe('');
			bus.send('ui-hide', 'mydiv');
			expect(e.style.display).toBe('none');
		});

		it('changes element display on ui-toggle', function() {
			var e = document.getElementById(div);
			expect(e.style.display).not.toBe('none');
			bus.send('ui-toggle', 'mydiv');
			expect(e.style.display).toBe('none');
		});

		it('creates Sortable on sortable', function() {
      // It doesn't change anything in the DOM. We just ensure that
      // the function is available
			ui.sortable(parentId);
		});
	});
});
