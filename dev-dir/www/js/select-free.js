/*jslint white: true, nomen: true */
(function (win, doc) {

	"use strict";
	/*global window */

	function SelectFree(select, elementTemplate, listTemplate, options) {

		select.style.display = 'none';

		var selectFree = this;

		selectFree.attr = {};

		selectFree.set(selectFree.KEYS.NODE.SELECT, select);
		selectFree.set(selectFree.KEYS.TEMPLATE.ELEMENT, elementTemplate);
		selectFree.set(selectFree.KEYS.TEMPLATE.LIST, listTemplate);
		selectFree.set(selectFree.KEYS.OPTIONS, options || {});

		selectFree.initialize(select, options);

	}

	SelectFree.prototype.set = function (key, value) {
		this.attr[key] = value;
	};

	SelectFree.prototype.get = function (key) {
		return this.attr[key];
	};

	SelectFree.prototype.KEYS = {
		TEMPLATE: {
			ELEMENT: 'select-free:template:element',
			LIST: 'select-free:template:list'
		},
		NODE: {
			SELECT: 'select-free:node:select',
			ELEMENTS: 'select-free:node:element',
			LIST: 'select-free:node:list'
		},
		OPTIONS: 'select-free:options'
		/*,
		HELPERS: {
			TEMP_NODE: 'select-free:helpers:temp-node'
		}
		*/



	};

	SelectFree.prototype.initialize = function () {

		// hide and wrap node
		var selectFree = this;
		selectFree.updateElementNode();

	};

	SelectFree.prototype.updateElementNode = function () {

		var selectFree = this,
			oldNodeElements = selectFree.get(selectFree.KEYS.NODE.ELEMENTS),
			oldNodeElement,
			select = selectFree.get(selectFree.KEYS.NODE.SELECT),
			template = selectFree.get(selectFree.KEYS.TEMPLATE.ELEMENT),
			newNodeElements = selectFree.createNodes(template),
			i, len;

		if (oldNodeElements) {
			for (i = 0, len = oldNodeElements.length; i < len; i += 1) {
				oldNodeElement = oldNodeElements[i];
				oldNodeElement.parentNode.removeChild(oldNodeElement);
			}
		}

		selectFree.set(selectFree.KEYS.NODE.ELEMENTS, newNodeElements);

		for (i = 0, len = newNodeElements.length; i < len; i += 1) {
			select.parentNode.insertBefore(newNodeElements[i], select);
		}

	};

	SelectFree.prototype.createNodes = function (template) {

		// TODO:
		// optimize  doc.createElement('div'), i.e. create temp div and
		// do not create a new div each time

		var selectFree = this,
			select = selectFree.get(selectFree.KEYS.NODE.SELECT),
			tempNode = doc.createElement('div');

		tempNode.innerHTML = template(select);

		return Array.prototype.slice.call(tempNode.children);

	};






	var _globals = (function(){ return this || (0,eval)('this'); }());

	if (typeof module !== "undefined" && module.exports) {
		module.exports = SelectFree;
	} else if (typeof define === "function" && define.amd) {
		define(function(){return SelectFree;});
	} else {
		_globals.SelectFree = SelectFree;
	}

}(window, window.document));