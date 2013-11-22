/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
 
var request = require('request');

module.exports = function(req, res, next) {

	// User is allowed, proceed to the next policy, 
	// or if this is the last policy, the controller
	/*if (req.session.authenticated) {
		return next();
	}
	
	// User is not allowed
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	return res.forbidden('You are not permitted to perform this action.');*/
  
	// Set the vars
	var facebook_id = '',
		access_token = '',
		graph_api = 'https://graph.facebook.com/me?access_token=';
	
	// Get Params
	if (req.param('facebook_id')) {
		facebook_id = req.param('facebook_id');
	}
	
	if (req.param('access_token')) {
		access_token = req.param('access_token');
	}	
		
	// Check for Facebook ID and Access token params
	if (access_token && facebook_id) {
		
		// Lookup DB for the User
		User.findOne({ facebook_id: facebook_id }).done(function(err, users) {
		
			if (err || !users) {
				
				// User doesn't exist, return an error, as this is a policy we won't perform an insert
				return res.json({ status: 403, error: 'User does not exist' }, 403);
				
			} else {  	
			
				// User exists already in our database
				// Query Facebook to check the Facebook token is legit as the Facebook ID is easy to fake
				// Best to include the API's Facebook app secret key with these calls to verify the token originates from our app
				
				request.get({ url: graph_api+access_token, json: true }, function (error, response, body) {
				
					if (!error && response.statusCode == 200) {
						
						// Check to see if the DB user ID matches the returned ID from Facebook
						if (body.id == users.facebook_id) {
							
							// User has a legit token
							// Bind the user object to send through to the controller
							req.user = users;
							
							// Call next to approve the policy
							return next();
							
						} else {
							
							// ID did not match, send back an error the client can use (not specific to the exact error)
							return res.json({ status: 403, error: 'Facebook did not like this request' }, 403);
							
						}
						
					} else {
					
						// Token isn't verified, send back an error the client can use
						return res.json({ status: 403, error: 'Facebook did not like this request' }, 403);
						
					}
					
				});
				
			}
			
		});
		
	} else {
		
		// Insufficient params supplied, send back an error response the client can use
		return res.json({ status: 403, error: 'Access token or user ID not specified' }, 403);
		
	}
  
};
