/**
 * Default 403 (Forbidden) middleware
 *
 * This middleware can be invoked from a controller or policy:
 * res.forbidden( [message] )
 *
 *
 * @param {String|Object|Array} message
 *      optional message to inject into view locals or JSON response
 * 
 */

module.exports[403] = function badRequest(message, req, res) {

	/*
	* NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
	* work just like their Express equivalents to handle HTTP requests, they also simulate
	* the same interface for receiving socket messages.
	*/

	var result = {
		status: 403,
		message: 'Access to this endpoint is forbidden'
	};
	
	res.json(result, 403);

};