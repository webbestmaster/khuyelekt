/*jslint white: true, nomen: true */
(function (win, doc) {

	"use strict";
	/*global window */

	function SelectFree(select, elementData, listData, options) {

		// select.style.display = 'none';

		var selectFree = this;

		selectFree.attr = {};

		selectFree.set(selectFree.KEYS.NODE.$_SELECT, select);
		selectFree.set(selectFree.KEYS.ELEMENT.TEMPLATE, elementData.template);
		selectFree.set(selectFree.KEYS.ELEMENT.EVENTS, elementData.events || {});
		selectFree.set(selectFree.KEYS.LIST.TEMPLATE, listData.template);
		selectFree.set(selectFree.KEYS.LIST.EVENTS, listData.events || {});

		selectFree.set(selectFree.KEYS.OPTIONS, options || {});

		selectFree.onClickElement = selectFree.onClickElement.bind(selectFree);

		selectFree.initialize(select, options);

	}

	SelectFree.prototype.onClickElement = function () {

		console.log(this);
		console.log('open or close select here .....');

	};

	SelectFree.prototype.bindElementEventListeners = function () {

		var selectFree = this,
			$nodeElements = selectFree.get(selectFree.KEYS.NODE.$_ELEMENTS),
			events = selectFree.get(selectFree.KEYS.ELEMENT.EVENTS);

		$nodeElements.on('click', selectFree.onClickElement);

		selectFree.bindEventListenersToElement($nodeElements, events);

	};

	SelectFree.prototype.bindEventListenersToElement = function ($nodes, evetns) {

		var selectFree = this,
			key;

		for (key in evetns) {
			if (evetns.hasOwnProperty(key)) {
				$nodes.on(key, evetns[key].bind(selectFree));
			}
		}

	};

	SelectFree.prototype.set = function (key, value) {
		this.attr[key] = value;
	};

	SelectFree.prototype.get = function (key) {
		return this.attr[key];
	};

	SelectFree.prototype.KEYS = {

		ELEMENT: {
			TEMPLATE: 'select-free:element:template',
			EVENTS: 'select-free:element:events'
		},
		LIST: {
			TEMPLATE: 'select-free:list:template',
			EVENTS: 'select-free:list:events'
		},
		// TEMPLATE: {
		// 	ELEMENT: 'select-free:template:element',
		// 	LIST: 'select-free:template:list'
		// },
		NODE: {
			$_SELECT: 'select-free:node:select',
			$_ELEMENTS: 'select-free:node:element',
			$_LIST: 'select-free:node:list'
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
			$oldNodeElements = selectFree.get(selectFree.KEYS.NODE.$_ELEMENTS),
			$select = selectFree.get(selectFree.KEYS.NODE.$_SELECT),
			template = selectFree.get(selectFree.KEYS.ELEMENT.TEMPLATE),
			$newNodeElements = selectFree.createNodes(template);

		if ($oldNodeElements) {
			$oldNodeElements.off().remove();
		}

		selectFree.set(selectFree.KEYS.NODE.$_ELEMENTS, $newNodeElements);

		$newNodeElements.insertAfter($select);

		selectFree.bindElementEventListeners();

	};

	SelectFree.prototype.createNodes = function (template) {

		var selectFree = this,
			select = selectFree.get(selectFree.KEYS.NODE.$_SELECT);

		return  $(template.call(this, select));

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