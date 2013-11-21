/**
 * Default 404 (Not Found) handler
 *
 * If no route matches are found for a request, Sails will respond using this handler.
 * 
 * This middleware can also be invoked manually from a controller or policy:
 * Usage: res.notFound()
 */

module.exports[404] = function pageNotFound(req, res) {

	/*
	* NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
	* work just like their Express equivalents to handle HTTP requests, they also simulate
	* the same interface for receiving socket messages.
	*/

	var result = {
		status: 404,
		message: 'This endpoint does not exist'
	};
	
	res.json(result, 404);

};