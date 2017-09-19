var mixin = require('mixin-object');

/*
 * @param {function} middleware - connect style, (req, res, next)
 * @return {function} middleware - dietjs style ($)
 */
function compatible (middleware) {
	return function ($) {
		// clone $.request and mixin signal
		var req = mixin(mixin({}, $.request), $);
		// proxy any changes to req to signal
		var reqProxy = new Proxy(req, {
			set: function (target, prop, value, receiver) {
				target[prop] = value;
				$[prop] = value;
				return true;
			}
		});
		var res = $.response;

		middleware(reqProxy, res, function (err) {
			$.return();
		});
	}
}

module.exports = compatible;
