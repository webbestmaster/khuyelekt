/*jslint white: true, nomen: true */
/*global window */
(function (win) {

	"use strict";

	var lastTime = 0,
		vendors = ['ms', 'moz', 'webkit', 'o'],
		vendor,
		x,
		vendorsLength = vendors.length,
		hasPerformance,
		rAF, startTime;

	for (x = 0; x < vendorsLength && !win.requestAnimationFrame; x += 1) {
		vendor = vendors[x];
		win.requestAnimationFrame = win[vendor + 'RequestAnimationFrame'];
		win.cancelAnimationFrame = win[vendor + 'CancelAnimationFrame'] || win[vendor + 'CancelRequestAnimationFrame'];
	}

	if (!win.requestAnimationFrame) {
		win.requestAnimationFrame = function (callback, element) {
			var currTime = Date.now(),
				timeToCall = Math.max(0, 16 - currTime + lastTime),
				id = win.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!win.cancelAnimationFrame) {
		win.cancelAnimationFrame = win.clearTimeout;
	}

	hasPerformance = !!(win.performance && win.performance.now);

// Add new wrapper for browsers that don't have performance
	if (!hasPerformance) {
		// Store reference to existing rAF and initial startTime
		rAF = win.requestAnimationFrame;
		startTime = Date.now();

		// Override window rAF to include wrapped callback
		win.requestAnimationFrame = function (callback, element) {
			// Wrap the given callback to pass in performance timestamp
			function wrapped(timestamp) {
				// Get performance-style timestamp
				return callback(timestamp < 1e12 ? timestamp : timestamp - startTime);
			}

			// Call original rAF with wrapped callback
			rAF(wrapped, element);

		};
	}

}(window));
