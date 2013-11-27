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

	if (req.param('api_key')) {
	
		User.findOne({ api_key: req.param('api_key') }).done(function(err, users) {
		
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
