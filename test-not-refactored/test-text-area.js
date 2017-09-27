define([ 'geoladris-tests' ], function(tests) {
	var bus;
	var injector;
	var textArea;
	var commons;

	describe('text-area', function() {
		var parentId = 'myparent';

		beforeEach(function(done) {
			var initialization = tests.init();
			bus = initialization.bus;
			injector = initialization.injector;
			injector.require([ 'commons', 'text-area' ], function(c, module) {
				commons = c;
				spyOn(commons, 'linkDisplay').and.callThrough();

				textArea = module;
				done();
			});
			tests.replaceParent(parentId);
		});

		it('creates a textarea with a label on create', function() {
			textArea({
				id: 'myarea',
				parent: parentId,
				label: 'Text: '
			});

			var parent = document.getElementById(parentId);
			expect(parent.children.length).toBe(1);
			var container = parent.children[0];
			expect(container.children.length).toBe(2);
			expect(container.getElementsByTagName('textarea').length).toBe(1);
			expect(container.getElementsByTagName('label').length).toBe(1);
			expect(container.getElementsByTagName('label')[0].textContent).toBe('Text: ');
		});

		it('sets rows and cols if specified on create', function() {
			var area = textArea({
				id: 'myarea',
				parent: parentId,
				label: 'Text: ',
				rows: 4,
				cols: 20
			});

			expect(area.rows).toEqual(4);
			expect(area.cols).toEqual(20);
		});

		it('fills message on -field-value-fill', function() {
			var area = textArea({
				id: 'myarea',
				parent: parentId,
				label: 'Text: '
			});

			var content = 'This is the textarea content';
			area.value = content;

			var message = {};
			bus.send('myarea-field-value-fill', message);
			expect(message.myarea).toEqual(content);
		});

		it('links container visibility', function() {
			var area = textArea({
				id: 'myarea',
				parent: parentId,
				label: 'Text: '
			});

			expect(commons.linkDisplay).toHaveBeenCalled();
			var args = commons.linkDisplay.calls.mostRecent().args;
			expect(args[0].id).toBe(area.id);
			expect(args[1].id).toBe(area.id + '-container');
		});
	});
});
