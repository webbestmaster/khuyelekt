/*jslint white: true, nomen: true */
(function (win) {

	'use strict';
	/*global window */

	win.addEventListener('load', function () {

		var node = win.document.querySelector('.me');


		new NodeParser(node);
		nodeParserUtil.parseNode(node);
		debugger


	}, false);

}(window));
