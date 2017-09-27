define([ 'geoladris-tests' ], function(tests) {
	var bus;
	var injector;

	describe('loading', function() {
		beforeEach(function(done) {
			var initialization = tests.init();
			bus = initialization.bus;
			injector = initialization.injector;
			var div = document.getElementById('wait-mask');
			if (div) {
				document.body.removeChild(div);
			}
			injector.require([ 'loading' ], function() {
				done();
			});
		});

		it('adds a hidden loading div on init', function() {
      // This comes from the ui-loading.js code
			var div = document.getElementById('wait-mask');
			expect(div).not.toBe(null);
			expect(div.style.display).toEqual('none');
		});

		it('shows the loading div on start', function() {
			bus.send('ui-loading:start', 'Message');
			var shade = document.getElementById('wait-mask');
			expect(shade.style.display).not.toEqual('none');
			var msg = document.getElementById('loading-msg');
			expect(msg.textContent).toMatch('Message');

      // Free timers
			bus.send('ui-loading:end', 'Message');
		});

		it('hides the loading div on end', function() {
			bus.send('ui-loading:start', 'Message');
			bus.send('ui-loading:end', 'Message');
			expect(document.getElementById('wait-mask').style.display).toEqual('none');
		});

		it('handles multiple starts/ends with the same message', function() {
			bus.send('ui-loading:start', 'Message');
			bus.send('ui-loading:start', 'Message');
			var shade = document.getElementById('wait-mask');
			expect(shade.style.display).not.toEqual('none');
			bus.send('ui-loading:end', 'Message');
			expect(shade.style.display).not.toEqual('none');
			bus.send('ui-loading:end', 'Message');
			expect(shade.style.display).toEqual('none');
		});
	});
});
