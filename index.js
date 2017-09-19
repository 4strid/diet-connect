/*
 * @param {function} middleware - connect style, (req, res, next)
 * @return {function} middleware - dietjs style ($)
 */
function compatible (middleware) {
	return function ($) {
		// clone $ signal and mixin request
		var req = $.request;
		// proxy any changes to req to signal
		var reqProxy = new Proxy(req, {
			get: function (target, name) {
				return name in target ? target[name] : $[name];
			},
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
