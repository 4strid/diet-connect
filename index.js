/*
 * @param {function} middleware - connect style, (req, res, next)
 * @return {function} middleware - dietjs style ($)
 * Proxies the signal object
 */
function compatible (middleware) {
	return function ($) {
		var req = $.request;
		var res = $.response;

		var $req = new Proxy(req, {
			defineProperty (target, prop, descriptor) {
				return Object.defineProperty(target, prop, descriptor) &&
					   Object.defineProperty($, prop, descriptor)
			},
			has (target, prop) {
				return prop in target || prop in $;
			},
			get (target, prop) {
				return prop in target ? target[prop] : $[prop];
			},
			set (target, prop, value, receiver) {
				$[prop] = value;
				target[prop] = value;
				return true;
			},
			deleteProperty (target, prop) {
				return (delete $[prop]) && (delete target[prop])
			}
		});

		middleware($req, res, function (err) {
			if (err)
				throw err
			$.return();
		});
	}
}

module.exports = compatible;
