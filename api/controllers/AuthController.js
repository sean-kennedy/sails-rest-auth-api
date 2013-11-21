/**
 * AuthmarkController
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
			The alternative is hitting Facebook to authenticate every request to the API. Or  ***/
			
		/** In the case of a single page app this route could be loaded at the start of the app bootstrap and set the global key for the rest of the app's calls. 
			With page reloads this route will be called for every request. Work in progress. **/
		
		var api_key = '',
			user = {};
		
		// See if the request is using an API key
		if (!api_key) {
			
			// Check for Facebook ID and Access token params
			if (access_token && facebook_id) {
				
				// Lookup DB for the User
				user = db.lookup.facebook_id;
				
				if (!user) {
					
					// User doesn't exist yet, we need to verify from Facebook this is a legit request, this is now a registration as the user
					// was not in the DB already. Best to include the API's Facebook app secret key with these calls to verify the token originates from our app
					
					var user_data = graph.api.call.withapp.secret;
					
					if (!err) {
						
						// User is legit with legit token, generate an API key from some credentials and add them to the DB
						// Optional: Store the Facebook token, no real need though
						
						api_key = newapi_key;
						
						user.add.to.db;
						
						// Send the success response to the client with the new API key to use
						
					} else {
						
						// Token isn't verified, send back an error the client can use
						
					}
					
				} else {
					
					// User exists already in our database
					// Query Facebook to check the Facebook token is legit as the Facebook ID is easy to fake
					// Best to include the API's Facebook app secret key with these calls to verify the token originates from our app
					
					var user_data = graph.api.call.withapp.secret;
					
					if (!err) {
						
						// User is legit, lookup their API key and send it back to the client for use
						
					} else {
						
						// Token isn't verified, send back an error the client can use
						
					}
					
				}
				
			} else {
				
				// Insufficient params supplied, send back an error response the client can use
				
			}
			
		} else {
			
			// They have an API key, might not be a real one though
			// This shouldn't happen as the /auth route shouldn't be used if the client already has an API key
			
			// Probably best to spit the API key back at the client as this route is only for authenticating
			
			// Optional: check the API key against the DB, if nothing is found send back an error, else, spit the key back.
			// Not much use in this option and it's adding to server load. It might prevent the client setting a fake key for use in the app though.
			
		}
		
		// Get Params
		if (req.param('facebook_id')) {
			var facebook_id = req.param('facebook_id');
		} else {
			facebook_id = null;
		}
		
		if (req.param('access_token')) {
			var access_token = req.param('access_token');
		} else {
			access_token = null;
		}
		
		// Query Facebook to see if the Facebook token is valid for the supplied Facebook ID
		var graph_api = 'https://graph.facebook.com/me?access_token=';
		
		request(graph_api+access_token, function (error, response, body) {
		
			if (!error && response.statusCode == 200) {
			
				console.log(body);
				
				var result = {
					status: 200, 
					facebook_id: facebook_id,
					access_token: access_token
				};
		
				res.json(result, 200);
				
			} else {
				return res.json({ status: 200, error: 'Facebook did not like this request' }, 200);
			}
			
		});
		
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to AuthmarkController)
	*/
	_config: {}
  
};
