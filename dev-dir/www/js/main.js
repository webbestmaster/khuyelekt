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
			win.document.querySelector('select'),
			{
				events: {
					'selector here': 'function here',
					'selector to close': 'spec word to close - SelectFree.prototype.KEYS:CLOSE_FUNCTION'
				},
				template: function elementTemplate(select) {

					if (select.value === '1') {
						return '<div>1</div>';
					}

					var ee = Math.random();

					return '<span>444444</span> asdasdasdsfsaf <span>55555</span><div>333</div><h1>ww</h1><span>' + ee  + '</span>';

				}
			},
			function listTemplate(select) {

			},
			{

			}
		);

	}, false);

}(window));
