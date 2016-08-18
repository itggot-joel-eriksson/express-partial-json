// jshint esversion: 6
const jsonMask = require("json-mask");

const compile = jsonMask.compile;
const filter = jsonMask.filter;

module.exports = (opt = { query: "fields" }) => {
	const partialJSON = (obj, fields) => {
		if (!fields) return obj;
		return filter(obj, compile(fields));
	};

	const wrap = (orig) => {
		return (obj) => {
			let param = this.req.query[opt.query];
			if (arguments.length === 1) {
				orig(partialJSON(obj, param));
			} else if (arguments.length === 2) {
				if (typeof arguments[1] === "number") {
					orig(arguments[1], partialJSON(obj, param));
				} else {
					orig(obj, partialJSON(arguments[1], param));
				}
			}
		};
	};

	return (req, res, next) => {
		res.json = wrap(res.json.bind(res));
		res.jsonp = wrap(res.jsonp.bind(res));
		next();
	};
};
