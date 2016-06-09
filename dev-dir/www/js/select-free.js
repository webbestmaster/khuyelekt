/*jslint white: true, nomen: true */
(function (win, doc) {

	"use strict";
	/*global window */

	function SelectFree($select, elementData, listData) {

		var selectFree = this,
			listDataAnimations = listData.animations || {};

		selectFree.attr = {};

		selectFree.events = {};

		$select.css('display', 'none');

		selectFree.set(selectFree.KEYS.NODE.$_BODY, $(doc.body));
		selectFree.set(selectFree.KEYS.NODE.$_SELECT, $select);
		selectFree.set(selectFree.KEYS.ELEMENT.TEMPLATE, elementData.template);
		selectFree.set(selectFree.KEYS.ELEMENT.EVENTS, elementData.events || {});
		selectFree.set(selectFree.KEYS.LIST.TEMPLATE, listData.template);
		selectFree.set(selectFree.KEYS.LIST.EVENTS, listData.events || {});

		selectFree.set(selectFree.KEYS.ANIMATIONS.LIST.OPENING, listDataAnimations.opening || {});
		selectFree.set(selectFree.KEYS.ANIMATIONS.LIST.CLOSING, listDataAnimations.closing || {});

		// selectFree.set(selectFree.KEYS.OPTIONS, options || {});
		selectFree.setOpenState(selectFree.KEYS.STATES.CLOSE);

		selectFree.setValue($select.val());

		selectFree.onClickElement = selectFree.onClickElement.bind(selectFree);

		selectFree.defineDefaultPromises();

		selectFree.initialize();

	}

	SelectFree.prototype.bind = function (event, fn) {

		var events = this.events,
			arr;

		if (!events[event]) {
			events[event] = [];
		}

		arr = events[event];

		arr[arr.length] = fn;

	};

	SelectFree.prototype.unbind = function (event, fn) {

		var selectFree = this,
			events = selectFree.events,
			arr = events[event],
			key;

		// detect selectFree.unbind();
		if (!event && !fn) {
			for (key in events) {
				if (events.hasOwnProperty(key)) {
					events[key] = [];
				}
			}
			return;
		}

		// detect selectFree.unbind(event);
		if (!fn) {
			events[event] = [];
			return;
		}

		// detect not array for this event
		if (!arr) {
			return;
		}

		// detect selectFree.unbind(event, fn);
		arr.splice(arr.indexOf(fn), 1);

	};

	SelectFree.prototype.trigger = function (event /* , args... */) {

		var selectFree = this,
			events = selectFree.events,
			arr = events[event] || [],
			i, len,
			args = [];

		for (i = 1, len = arguments.length; i < len; i += 1) {
			args[i - 1] = arguments[i];
		}

		// WARNING
		// in problem case
		// replace this code for
		// forEach
		for (i = 0, len = arr.length; i < len; i += 1) {
			arr[i].apply(selectFree, args);
		}

	};

	SelectFree.prototype.defineDefaultPromises = function () {

		var selectFree = this;

		// define resolved Promises
		selectFree.set(selectFree.KEYS.PROMISES.OPENING, new Promise(function (resolve, reject) {
			resolve();
		}));

		selectFree.set(selectFree.KEYS.PROMISES.CLOSING, new Promise(function (resolve, reject) {
			resolve();
		}));

	};

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

		promise = selectFree.createAnimations(
			$list,
			selectFree.get(selectFree.KEYS.ANIMATIONS.LIST.OPENING)
		).then(function () {

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

		promise = selectFree.createAnimations(
			$list,
			selectFree.get(selectFree.KEYS.ANIMATIONS.LIST.CLOSING)
		).then(function () {

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
			selectFree.updateElementNode();
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
			SELECT: 'select-free:events:select',
			CHANGE: 'select-free:events:change',
			DESTROY: 'select-free:events:destroy'
		},

		ANIMATIONS: {
			LIST: {
				OPENING: 'select-free:animations:list:opening',
				CLOSING: 'select-free:animations:list:closing'
			}
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

	SelectFree.prototype.removeElementNode = function () {

		var selectFree = this,
			$oldNodeElements = selectFree.get(selectFree.KEYS.NODE.$_ELEMENTS);

		if ($oldNodeElements) {
			$oldNodeElements.off().remove();
		}

	};

	SelectFree.prototype.updateElementNode = function () {

		var selectFree = this,
			$select = selectFree.get(selectFree.KEYS.NODE.$_SELECT),
			template = selectFree.get(selectFree.KEYS.ELEMENT.TEMPLATE),
			$newNodeElements = selectFree.createNodes(template);

		selectFree.removeElementNode();

		selectFree.set(selectFree.KEYS.NODE.$_ELEMENTS, $newNodeElements);

		$newNodeElements.insertAfter($select);

		selectFree.bindElementEventListeners();

	};

	SelectFree.prototype.createNodes = function (template) {

		var selectFree = this,
			$select = selectFree.get(selectFree.KEYS.NODE.$_SELECT);

		return $(template.call(this, $select));

	};

	SelectFree.prototype.destroy = function () {

		var selectFree = this,
			$select = selectFree.get(selectFree.KEYS.NODE.$_SELECT);

		selectFree.close().then(function () {

			selectFree.removeElementNode();

			$select.css('display', '');

			selectFree.trigger(selectFree.KEYS.EVENTS.DESTROY);

			selectFree.unbind();

		});

	};

	SelectFree.prototype.createAnimations = function ($nodes, animationsData) {

		var selectFree = this,
			key,
			promises = [], i = 0;

		for (key in animationsData) {
			if (animationsData.hasOwnProperty(key)) {
				promises[i] = selectFree.createAnimation($nodes, key, animationsData[key]);
				i += 1;
			}
		}

		return Promise.all(promises);

	};

	SelectFree.prototype.createAnimation = function ($nodes, selector, animationData) {

		var $foundNodes = $nodes.find(selector),
			from = JSON.parse(JSON.stringify(animationData.from || {})),
			to = JSON.parse(JSON.stringify(animationData.to || {})),
			onUpdate = animationData.onUpdate,
			onComplete = animationData.onComplete,
			onStart = animationData.onStart,
			delay = animationData.delay,
			time = animationData.time || 0,
			easing = animationData.easing,
			promises = [],
			tweens = [],
			node,
			i, len;

		for (i = 0, len = $foundNodes.length; i < len; i += 1) {

			node = $foundNodes[i];

			onStart.call(node, from);

			promises[i] = new Promise(function (resolve, reject) {

				var tween = new TWEEN.Tween(from);

				tween.to(to, time);

				if (onUpdate) {
					tween.onUpdate(onUpdate.bind(node, from));
				}

				if (onComplete) {
					tween.onComplete(function () {
						onComplete.call(node, from, to);
						resolve();
					});
				} else {
					tween.onComplete(resolve);
				}

				if (delay) {
					tween.delay(delay);
				}

				if (easing) {
					tween.easing(easing);
				}

				tweens[i] = tween;

				tween.start();

			});

		}

		return Promise.all(promises).then(function () {

			var i, len;

			for (i = 0, len = tweens.length; i < len; i += 1) {
				TWEEN.remove(tweens[i]);
			}

		});

	};

	if (typeof TWEEN !== undefined) {
		(function animate(time) {
			requestAnimationFrame(animate);
			TWEEN.update(time);
		}());
	}

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