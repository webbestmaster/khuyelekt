/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */

	win.addEventListener('load', function () {

		var node = win.document.querySelector('.me');

		console.log(new NodeParser(node));
		console.log(nodeParserUtil.parseNode(node));

	}, false);

}(window));
