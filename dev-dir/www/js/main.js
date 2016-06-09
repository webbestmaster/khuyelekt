/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */


	win.addEventListener('load', function () {

		FastClick.attach(document.body);

/*
		var node = win.document.querySelector('.me');
		console.log(new NodeParser(node));
		console.log(NodeParser.prototype.parseNode(node));
		console.log(NodeParser(node));
*/

		var selectFree = new SelectFree(
			$('select'),
			{
				events: {
					'span click': function (e) {
						console.log('from user\'s event');
						console.log(e.currentTarget, this);
					},
					'click': SelectFree.prototype.onClickElement
				},
				template: function elementTemplate($select) {

					return '<div>' + $select.val() + '</div>';

				}
			},
			{
				events: {
					'span click': function () {
						console.log('click on list');
					},
					'div click': SelectFree.prototype.close,
					'.option click': SelectFree.prototype.selectAndClose
				},
				template: function listTemplate($select) {

					if ($select.value === '1') {
						return '<div>1</div>';
					}

					var ee = Math.random();

					// WARNING data-value - this value will be use as major value

					return '<h1><div>close</div><div data-value="3" class="option">option 3</div><div data-value="0" class="option">option 0</div>  <span>assa</span>pizdatyi list</h1><span>' + ee + '</span>';

				}

			}
		);

		selectFree.bind(selectFree.KEYS.STATES.OPEN, function () {
			console.log(selectFree.KEYS.STATES.OPEN);
		});

		selectFree.bind(selectFree.KEYS.STATES.CLOSE, function () {
			console.log(selectFree.KEYS.STATES.CLOSE);
		});

		selectFree.bind(selectFree.KEYS.EVENTS.SELECT, function () {
			console.log(selectFree.KEYS.EVENTS.SELECT);
		});

		selectFree.bind(selectFree.KEYS.EVENTS.CHANGE, function () {
			console.log(selectFree.KEYS.EVENTS.CHANGE);
		});

	}, false);

}(window));
