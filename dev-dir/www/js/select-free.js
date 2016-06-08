/*jslint white: true, nomen: true */
(function (win, doc) {

	"use strict";
	/*global window */

	function SelectFree($select, elementData, listData, options) {

		// select.style.display = 'none';

		var selectFree = this;

		selectFree.attr = {};

		MicroEvent.mixin(this);

		selectFree.set(selectFree.KEYS.NODE.$_BODY, $(doc.body));
		selectFree.set(selectFree.KEYS.NODE.$_SELECT, $select);
		selectFree.set(selectFree.KEYS.ELEMENT.TEMPLATE, elementData.template);
		selectFree.set(selectFree.KEYS.ELEMENT.EVENTS, elementData.events || {});
		selectFree.set(selectFree.KEYS.LIST.TEMPLATE, listData.template);
		selectFree.set(selectFree.KEYS.LIST.EVENTS, listData.events || {});
		// selectFree.set(selectFree.KEYS.OPTIONS, options || {});
		selectFree.setOpenState(selectFree.KEYS.STATES.CLOSE);

		selectFree.setValue($select.val());

		selectFree.onClickElement = selectFree.onClickElement.bind(selectFree);

		selectFree.initialize();

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

		var selectFree = this,
			template = selectFree.get(selectFree.KEYS.LIST.TEMPLATE),
			$list = selectFree.createNodes(template),
			currentOpenState = selectFree.getOpenState(),
			promise;

		if (
			currentOpenState === selectFree.KEYS.STATES.OPEN ||
			currentOpenState === selectFree.KEYS.STATES.OPENING
		) {
			return selectFree.get(selectFree.KEYS.PROMISES.OPENING);
		}

		promise = new Promise(function (resolve, reject) {

			// show list animation here
			setTimeout(resolve, 1000);

		}).then(function () {

			selectFree.bindListEventListeners();
			selectFree.setOpenState(selectFree.KEYS.STATES.OPEN);

			selectFree.trigger(selectFree.KEYS.STATES.OPEN);

		});

		selectFree.setOpenState(selectFree.KEYS.STATES.OPENING);

		selectFree.get(selectFree.KEYS.NODE.$_BODY).append($list);
		selectFree.set(selectFree.KEYS.NODE.$_LIST, $list);

		selectFree.set(selectFree.KEYS.PROMISES.OPENING, promise);

		return promise;

	};

	SelectFree.prototype.close = function () {

		var selectFree = this,
			$list = selectFree.get(selectFree.KEYS.NODE.$_LIST),
			currentOpenState = selectFree.getOpenState(),
			promise;

		if (
			currentOpenState === selectFree.KEYS.STATES.CLOSE ||
			currentOpenState === selectFree.KEYS.STATES.CLOSING
		) {
			return selectFree.get(selectFree.KEYS.PROMISES.CLOSING);
		}

		promise = new Promise(function (resolve, reject) {

			setTimeout(resolve, 1000);

		}).then(function () {

			$list.remove();

			selectFree.setOpenState(selectFree.KEYS.STATES.CLOSE);

			selectFree.trigger(selectFree.KEYS.STATES.CLOSE);

		});

		selectFree.setOpenState(selectFree.KEYS.STATES.CLOSING);

		$list.off();

		selectFree.set(selectFree.KEYS.PROMISES.CLOSING, promise);

		return promise;

	};

	SelectFree.prototype.getValue = function () {

		var selectFree = this;

		return selectFree.get(selectFree.KEYS.VALUE);

	};

	SelectFree.prototype.setValue = function (value) {

		var selectFree = this,
			currentValue = selectFree.getValue(),
			$select;

		selectFree.set(selectFree.KEYS.VALUE, value);

		selectFree.trigger(selectFree.KEYS.EVENTS.SELECT, value);

		if (currentValue !== value) {
			$select = selectFree.get(selectFree.KEYS.NODE.$_SELECT);
			$select.val(value);
			selectFree.trigger(selectFree.KEYS.EVENTS.CHANGE, value);
		}

	};

	SelectFree.prototype.selectAndClose = function (e) {

		var selectFree = this;

		selectFree.select(e);

		selectFree.close();

	};

	SelectFree.prototype.select = function (e) {

		var selectFree = this,
			node = e.currentTarget,
			value = node.dataset.value;

		selectFree.setValue(value);

	};

	SelectFree.prototype.bindElementEventListeners = function () {

		var selectFree = this,
			$nodeElements = selectFree.get(selectFree.KEYS.NODE.$_ELEMENTS),
			events = selectFree.get(selectFree.KEYS.ELEMENT.EVENTS);

		selectFree.bindEventListenersToNodes($nodeElements, events);

	};

	SelectFree.prototype.bindListEventListeners = function () {

		var selectFree = this,
			$nodeElements = selectFree.get(selectFree.KEYS.NODE.$_LIST),
			events = selectFree.get(selectFree.KEYS.LIST.EVENTS);

		selectFree.bindEventListenersToNodes($nodeElements, events);

	};

	SelectFree.prototype.bindEventListenersToNodes = function ($nodes, evetns) {

		var selectFree = this,
			key,
			eventData,
			eventName,
			selector,
			reSelectorEvent = selectFree.KEYS.RE.SELECTOR_EVENT;

		for (key in evetns) {
			if (evetns.hasOwnProperty(key)) {
				eventData = key.match(reSelectorEvent);
				selector = eventData[1].trim();
				eventName = eventData[2].trim();
				if (eventName) {
					$nodes.find(selector).on(eventName, evetns[key].bind(selectFree));
				} else {
					$nodes.on(selector, evetns[key].bind(selectFree));
				}
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

		RE: {
			SELECTOR_EVENT: /^(\S+)\s*([\s\S]*)$/
		},

		OPEN_STATE: 'select-free:open-state',

		VALUE: 'select-free:value',

		STATES: {
			OPENING: 'select-free:events:opening',
			OPEN: 'select-free:events:open',
			CLOSING: 'select-free:events:closing',
			CLOSE: 'select-free:events:close'
		},

		PROMISES: {
			OPENING: 'select-free:promises:opening',
			CLOSING: 'select-free:promises:closing'
		},

		EVENTS: {
			SELECT: 'select-free:select',
			CHANGE: 'select-free:change'
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
			$_LIST: 'select-free:node:list',
			$_BODY: 'select-free:node:body'
		}
		// OPTIONS: 'select-free:options'
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

		return $(template.call(this, select));

	};


	var _globals = (function () {
		return this || (0, eval)('this');
	}());

	if (typeof module !== "undefined" && module.exports) {
		module.exports = SelectFree;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return SelectFree;
		});
	} else {
		_globals.SelectFree = SelectFree;
	}

}(window, window.document));