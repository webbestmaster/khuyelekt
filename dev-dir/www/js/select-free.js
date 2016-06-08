/*jslint white: true, nomen: true */
(function (win, doc) {

	"use strict";
	/*global window */

	function SelectFree(select, elementData, listData, options) {

		// select.style.display = 'none';

		var selectFree = this;

		selectFree.attr = {};

		selectFree.setOpenState(selectFree.KEYS.STATES.CLOSE);

		MicroEvent.mixin(this);

		selectFree.set(selectFree.KEYS.NODE.$_SELECT, select);
		selectFree.set(selectFree.KEYS.ELEMENT.TEMPLATE, elementData.template);
		selectFree.set(selectFree.KEYS.ELEMENT.EVENTS, elementData.events || {});
		selectFree.set(selectFree.KEYS.LIST.TEMPLATE, listData.template);
		selectFree.set(selectFree.KEYS.LIST.EVENTS, listData.events || {});

		selectFree.set(selectFree.KEYS.OPTIONS, options || {});

		selectFree.onClickElement = selectFree.onClickElement.bind(selectFree);

		selectFree.initialize(select, options);

	}

	SelectFree.prototype.getOpenState = function () {

		var selectFree = this;

		return selectFree.get(selectFree.KEYS.OPEN_STATE);

	};

	SelectFree.prototype.setOpenState = function (value) {

		var selectFree = this;

		return selectFree.set(selectFree.KEYS.OPEN_STATE, value);

	};

	SelectFree.prototype.onClickElement = function () {

		// detect current state
		// do needed action

		var selectFree = this,
			openState = selectFree.getOpenState();

		switch (openState) {

			case selectFree.KEYS.STATES.OPENING:

				break;

			case selectFree.KEYS.STATES.OPEN:

				selectFree.close();

				break;

			case selectFree.KEYS.STATES.CLOSING:

				break;

			case selectFree.KEYS.STATES.CLOSE:

				selectFree.open();

				break;

			default:

				console.log('Hm, I do NOT know this state -', openState);

		}


	};

	SelectFree.prototype.open = function () {

		var selectFree = this;

		selectFree.setOpenState(selectFree.KEYS.STATES.OPENING);

		return new Promise(function (resolve, reject) {

			setTimeout(resolve, 1000);

		}).then(function () {

			selectFree.setOpenState(selectFree.KEYS.STATES.OPEN);

			selectFree.trigger(selectFree.KEYS.STATES.OPEN);

		});

	};

	SelectFree.prototype.close = function () {

		var selectFree = this;

		selectFree.setOpenState(selectFree.KEYS.STATES.CLOSING);

		return new Promise(function (resolve, reject) {

			setTimeout(resolve, 1000);

		}).then(function () {

			selectFree.setOpenState(selectFree.KEYS.STATES.CLOSE);

			selectFree.trigger(selectFree.KEYS.STATES.CLOSE);

		});

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

		OPEN_STATE: 'select-free:open-state',

		STATES: {
			OPENING: 'select-free:events:opening',
			OPEN: 'select-free:events:open',
			CLOSING: 'select-free:events:closing',
			CLOSE: 'select-free:events:close'
		},
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