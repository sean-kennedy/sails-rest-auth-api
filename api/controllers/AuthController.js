/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
 
var request = require('request');

module.exports = {

	find: function(req, res) {
	
		var result = {
			status: 400, 
			message: 'GET not supported on /auth'
		};
		
		res.json(result, 400);
		
	},
  
	create: function(req, res) {
	
		// Auth Flow up to this point
		// 1. User logs into Facebook on the client app
		// 2. Provided the Facebook login is a success, the client receives a Facebook access token and the Facebook user ID
		// 3. If this route is being hit, the client isn't using an API key so it's chasing registration or retrieving an exisiting one from the DB
		
		/** This should all be policy middleware to catch every API endpoint ***/
		
		/** Using the API key flow might be a security issue on the client side. Passing the API key back to the client for use in a cookie is bad.
			The alternative is hitting Facebook to authenticate every request to the API.  ***/
			
		/** In the case of a single page app this route could be loaded at the start of the app bootstrap and set the global key for the rest of the app's calls. 
			With page reloads this route will be called for every request. Work in progress. **/
			
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
			var user = '';
			
			if (!user) {
				
				// User doesn't exist yet, we need to verify from Facebook this is a legit request, this is now a registration as the user
				// was not in the DB already.
				// Best to include the API's Facebook app secret key with these calls to verify the token originates from our app
				
				request.get({ url: graph_api+access_token, json: true }, function (error, response, body) {
				
					if (!error && response.statusCode == 200) {
						
						// User has a legit token
						
						// Perform new user insert into the DB here
						
						// Generate response
						var result = {
							status: 200,
							message: 'Successully registered'
						};
						
						// Send the success response to the client
						res.json(result, 200);
						
					} else {
					
						// Token isn't verified, send back an error the client can use
						return res.json({ status: 200, error: 'Facebook did not like this request' }, 200);
						
					}
					
				});
				
			} else {
				
				// User exists already in our database
				// Query Facebook to check the Facebook token is legit as the Facebook ID is easy to fake
				// Best to include the API's Facebook app secret key with these calls to verify the token originates from our app
				
				request.get({ url: graph_api+access_token, json: true }, function (error, response, body) {
				
					if (!error && response.statusCode == 200) {
						
						// Check to see if the DB user ID matches the returned ID from Facebook
						if (body.id == user) {
							
							// User has a legit token
							
							// Generate response
							var result = {
								status: 200,
								message: 'Successully authenticated'
							};
							
							// Send the success response to the client
							res.json(result, 200);
							
						} else {
							
							// ID did not match, send back an error the client can use (not specific to the exact error)
							return res.json({ status: 200, error: 'Facebook did not like this request' }, 200);
							
						}
						
					} else {
					
						// Token isn't verified, send back an error the client can use
						return res.json({ status: 200, error: 'Facebook did not like this request' }, 200);
						
					}
					
				});
				
			}
			
		} else {
			
			// Insufficient params supplied, send back an error response the client can use
			return res.json({ status: 200, error: 'Access token or user ID not specified' });
			
		}
		
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to AuthController)
	*/
	_config: {}
  
};
