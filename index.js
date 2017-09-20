/*
 * @param {function} middleware - connect style, (req, res, next)
 * @return {function} middleware - dietjs style ($)
 * Proxies the signal object
 */
function compatible (middleware, safe) {
	return function ($) {
		var req = $.request;
		var res = $.response;
		var $req = $;

		if (safe) {
			$.req = $.req || {};
			$req = $.req;
		}

		var reqProxy = new Proxy(req, {
			get: function (target, name) {
				return name in target ? target[name] : $req[name];
			},
			set: function (target, prop, value, receiver) {
				target[prop] = value;
				$req[prop] = value;
				return true;
			}
		});

		middleware(reqProxy, res, function (err) {
			$.return();
		});
	}
}

module.exports = compatible;
module.exports.safe = function (middleware) {
	return compatible(middleware, true);
}
