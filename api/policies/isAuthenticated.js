/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function(req, res, next) {

	// Provide option to send API key as a query param or x-api-key header.
	// Query params are cached in server logs and browser history, potential security risk
	
	if (req.headers['x-api-key'] !== '' || req.param('api_key')) {
		
		var apiKey = '';
		
		if (req.headers['x-api-key'] !== '') {
			apiKey = req.headers['x-api-key'];
		} 
		
		if (req.param('api_key')) {
			apiKey = req.param('api_key');
		}
	
		User.findOne({ api_key: apiKey }).done(function(err, users) {
		
			if (err) {
				return res.json({ status: 500, error: err }, 500);
			}
			
			if (users) {
				// Set the user making the request to the req param to do some validation in the controller
				req.user = users;
				return next();
			} else {
				return res.json({ status: 400, message: 'Invalid API key' }, 400);
			}
		
		});
		
	} else {
		
		return res.json({ status: 400, message: 'No API key sent with request' }, 400);
		
	}
  
};
