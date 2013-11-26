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

	create: function(req, res) {
    
		// Set the vars
		var facebook_id = '',
			access_token = '',
			graph_api = 'https://graph.facebook.com/me?access_token=';
		
		// Gen API key method
		function gen_api_key() {
		    var hash = 0, i, char;
		    if (this.length == 0) return hash;
		    for (i = 0, l = this.length; i < l; i++) {
		        char  = this.charCodeAt(i);
		        hash  = ((hash<<5)-hash)+char;
		        hash |= 0; // Convert to 32bit integer
		    }
		    return hash;
		};
		
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
					
					// User doesn't exist, so let's verify they are real via Facebook then add them to the DB
					//return res.json({ status: 403, error: 'User does not exist' }, 403);
					
					request.get({ url: graph_api+access_token, json: true }, function (error, response, body) {
					
						if (!error && response.statusCode == 200) {
							
							// User has a legit token
							
							// Generate an API key
							var new_api_key = gen_api_key();
							
							console.log(new_api_key);
							
							// Add them to DB
							User.create({
							
								name: body.name,
								email: body.email,
								facebook_id: body.id,
								api_key: new_api_key
								
							}).done(function(err, user){
							
								if(err) {
									console.log(err);
									return res.json(err);
								}
								
								if (user) {
									res.json(user);
								}
								
							});
							
						} else {
						
							// Token isn't verified, send back an error the client can use
							return res.json({ status: 403, error: 'Facebook did not like this request' }, 403);
							
						}
						
					});
					
					
				} else {  	
				
					// User exists already in our database
					// Query Facebook to check the Facebook token is legit as the Facebook ID is easy to fake
					// Best to include the API's Facebook app secret key with these calls to verify the token originates from our app
					
					request.get({ url: graph_api+access_token, json: true }, function (error, response, body) {
					
						if (!error && response.statusCode == 200) {
							
							// Check to see if the DB user ID matches the returned ID from Facebook
							if (body.id == users.facebook_id) {
								
								var new_api_key = gen_api_key();
								
								console.log(new_api_key);
								
								User.update({
									
									api_key: new_api_key
									
								},{
									
									facebook_id: facebook_id
									
								}).done(function(err, user){
								
									if(err) {
										console.log(err);
										return res.json(err);
									}
									
								});
								
								// Send the user back to the client
								res.json(users);
								
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
	
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to AuthController)
	*/
	_config: {}
  
};
