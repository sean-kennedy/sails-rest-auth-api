/**
 * Default 500 (Server Error) middleware
 *
 * If an error is thrown in a policy or controller, 
 * Sails will respond using this default error handler
 *
 * This middleware can also be invoked manually from a controller or policy:
 * res.serverError( [errors] )
 *
 *
 * @param {Array|Object|String} errors
 *      optional errors
 */

module.exports[500] = function serverErrorOccurred(errors, req, res) {

	/*
	* NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
	* work just like their Express equivalents to handle HTTP requests, they also simulate
	* the same interface for receiving socket messages.
	*/

	var result = {
		status: 500,
		message: 'Internal server error'
	};
	
	res.json(result, 500);

};
