/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */

	win.addEventListener('load', function () {

		var node = win.document.querySelector('.me');

		console.log(new NodeParser(node));
		console.log(NodeParser.prototype.parseNode(node));
		console.log(NodeParser(node));

		var selectFree = new SelectFree(
			$('select'),
			{
				events: {
					'click': function () {
						console.log(333, this);
					}
					// 'selector to close': 'spec word to close - SelectFree.prototype.KEYS:CLOSE_FUNCTION'
				},
				template: function elementTemplate($select) {

					if ($select.val() === '1') {
						return '<div>1</div>';
					}

					var ee = Math.random();

					return '<span>444444</span> asdasdasdsfsaf <span>55555</span><div>333</div><h1>ww</h1><span>' + ee + '</span>';

				}
			},
			{
				events: {
					'selector here': 'function here',
					'selector to close': 'spec word to close - SelectFree.prototype.KEYS:CLOSE_FUNCTION'
				},
				template: function listTemplate($select) {

					if ($select.value === '1') {
						return '<div>1</div>';
					}

					var ee = Math.random();

					return '<span>444444</span> asdasdasdsfsaf <span>55555</span><div>333</div><h1>ww</h1><span>' + ee + '</span>';

				}

			},


			{}
		);

	}, false);

}(window));
