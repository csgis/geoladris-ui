define([ 'geoladris-tests' ], function(tests) {
	describe('divstack', function() {
		var bus;
		var injector;
		var module;
		var parentId = 'myparent';

		beforeEach(function(done) {
			var initialization = tests.init();
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ 'divstack' ], function(m) {
				module = m;
				done();
			});
			tests.replaceParent(parentId);
		});

		it('hides other divs of stack on create', function() {
			var ids = [ 'id1', 'id2', 'id3' ];
			for (var i = 0; i < ids.length; i++) {
				var div = document.createElement('div');
				div.setAttribute('id', parentId);
				document.getElementById(parentId).appendChild(div);
			}

			module({
				divs: ids
			});

			expect(bus.send).toHaveBeenCalledWith('ui-hide', 'id2');
			expect(bus.send).toHaveBeenCalledWith('ui-hide', 'id3');
		});

		it('hides other divs of stack on ui-show', function() {
			var ids = [ 'id1', 'id2', 'id3' ];
			for (var i = 0; i < ids.length; i++) {
				var div = document.createElement('div');
				div.setAttribute('id', parentId);
				document.getElementById(parentId).appendChild(div);
			}

			module({
				divs: ids
			});
			bus.send('ui-show', 'id3');
			expect(bus.send).toHaveBeenCalledWith('ui-hide', 'id1');
			expect(bus.send).toHaveBeenCalledWith('ui-hide', 'id2');
		});
	});
});
