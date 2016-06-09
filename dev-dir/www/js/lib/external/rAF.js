// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var hasPerformance = !!(window.performance && window.performance.now);

// Add new wrapper for browsers that don't have performance
if (!hasPerformance) {
    // Store reference to existing rAF and initial startTime
    var rAF = window.requestAnimationFrame,
        startTime = +new Date;

    // Override window rAF to include wrapped callback
    window.requestAnimationFrame = function (callback, element) {
        // Wrap the given callback to pass in performance timestamp
        var wrapped = function (timestamp) {
            // Get performance-style timestamp
            var performanceTimestamp = (timestamp < 1e12)
                ? timestamp
                : timestamp - startTime;

            return callback(performanceTimestamp);
        };

        // Call original rAF with wrapped callback
        rAF(wrapped, element);
    }
}

