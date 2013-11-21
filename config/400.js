/**
 * Default 400 (Bad Request) handler
 *
 * Sails will automatically respond using this middleware when a blueprint is requested
 * with missing or invalid parameters
 * (e.g. `POST /user` was used to create a user, but required parameters were missing)
 *
 * This middleware can also be invoked manually from a controller or policy:
 * res.badRequest( [validationErrors], [redirectTo] )
 *
 *
 * @param {Array|Object|String} validationErrors
 *      optional errors
 *      usually an array of validation errors from the ORM
 *
 * @param {String} redirectTo
 *      optional URL
 *      (absolute or relative, e.g. google.com/foo or /bar/baz) 
 *      of the page to redirect to.  Usually only relevant for traditional HTTP requests,
 *      since if this was triggered from an AJAX or socket request, JSON should be sent instead.
 */

module.exports[400] = function badRequest(validationErrors, redirectTo, req, res) {

	/*
	* NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
	* work just like their Express equivalents to handle HTTP requests, they also simulate
	* the same interface for receiving socket messages.
	*/

	var result = {
		status: 400,
		message: 'Bad request'
	};
	
	res.json(result, 400);

};