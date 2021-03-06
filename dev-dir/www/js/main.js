/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */

	function init() {

		if (typeof TWEEN !== undefined) {
			(function animate(time) {
				requestAnimationFrame(animate);
				TWEEN.update(time);
			}());
		}

		FastClick.attach(document.body);

		/*
		 var node = win.document.querySelector('.me');
		 console.log(new NodeParser(node));
		 console.log(NodeParser.prototype.parseNode(node));
		 console.log(NodeParser(node));
		 */

		$('select').on('change', function () {
			console.log('native select was changed');
		});

		var selectFree = new win.SelectFree(
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

					return '<div>' + $select.val() + '<div>mememme</div></div>';

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

				},
				animations: {

					opening: {
						':scope': {

							from: { bgOpacity: 0 },

							to: { bgOpacity: 0.5 },

							time: 500,

							onUpdate: function (data) {
								// this.style.width = data.width + 'px';
								this.style.backgroundColor = 'rgba(255, 255, 255, ' + data.bgOpacity + ')';
							},
							onComplete: function (data, to) {
								this.style.backgroundColor = 'rgba(255, 255, 255, ' + to.bgOpacity + ')';
							}
							// delay: 100,
							// easing: TWEEN.Easing.Elastic.Out

						},
						'.option': {

							onStart: function (data) {
								this.style.backgroundColor = '#c00';
								this.style.opacity = data.opacity;
							},

							from: { opacity: 0, width: 50 },

							to: { opacity: 1, width: 500 },

							time: 1000,

							onUpdate: function (data) {
								this.style.width = data.width + 'px';
								this.style.opacity = data.opacity;
							},
							onComplete: function (data, to) {
								console.log(to);
								console.log(this.style.opacity + ' end');
							}
							// delay: 100,
							// easing: TWEEN.Easing.Elastic.InOut
						}
					},
					closing: {
						'.option': {

							onStart: function (data) {
								this.style.opacity = data.opacity;
							},

							from: { opacity: 1, width: 50 },

							to: { opacity: 0, width: 500 },

							time: 1000,

							onUpdate: function (data) {
								this.style.opacity = data.opacity;
							},
							onComplete: function (data, to) {
								console.log(to);
								console.log(this.style.opacity + ' end');
							}
							// delay: 100,
							// easing: TWEEN.Easing.Elastic.InOut

						}
					}

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

		selectFree.bind(selectFree.KEYS.EVENTS.DESTROY, function () {
			console.log(selectFree.KEYS.EVENTS.DESTROY);
		});


		/*
		 setTimeout(function () {
		 selectFree.destroy();
		 }, 4000);
		 */

	}

	win.addEventListener('load', init, false);

}(window));
