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
 
var bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10,
  hat = require('hat'),
  request = require('request');

module.exports = {

	find: function(req, res) {
	
		if (req.param('auth_type')) {
			var auth_type = req.param('auth_type');
		}
		
		if (auth_type == 'traditional') {
			
			// AUTH: Traditional (Username & Password)
			
			if(!req.param('password') || !req.param('email')) {
				return res.json({ status: 400, error: 'Missing parameters' }, 400);
			}
			
			User.findOne({ email: req.param('email') }).done(function(err, user) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (user) {
					
					var db_password = user.password;
					
					bcrypt.compare(req.param('password'), db_password, function(err, isMatch) {
					    
					    if (err) {
						    return res.json({ status: 500, error: err }, 500);
					    }
					    
					    if (isMatch == true) {
					    	
					    	user.apiKey = user.api_key;
						    return res.json(user, 200);
						    
					    } else {
						    return res.json({ status: 400, message: 'Incorrect login details' }, 400);
					    }
					    
					});
					
					
				} else {
					return res.json({ status: 400, message: 'Incorrect login details' }, 400);
				}
			
			});
		
		} else if (auth_type == 'facebook') {
			
			// AUTH: Facebook
			
			if (!req.param('facebook_id') || !req.param('facebook_token')) {
				return res.json({ status: 400, error: 'Missing Facebook token or ID' }, 400);
			}
			
			User.findOne({ facebookId: req.param('facebook_id') }).done(function(err, user) {
				
				if (err) {
					return res.json({ status: 500, error: err }, 500); 
				}
				
				if (user) {
					
					var graph_api = 'https://graph.facebook.com/me?access_token=',
						facebook_token = req.param('facebook_token');
					
					request.get({ url: graph_api+facebook_token, json: true }, function (error, response, body) {
					
						if (!error && response.statusCode == 200) {
							
							if (body.id == user.facebookId) {
								
								console.log('Facebook user found in DB!');
								user.apiKey = user.api_key;
								return res.json(user, 200);
								
							} else {
								return res.json({ status: 403, error: 'Facebook token not valid' }, 403);
							}
							
						} else {
							return res.json({ status: 403, error: 'Facebook token not valid' }, 403);
						}
						
					});
					
				} else {
				
					// No Record, as it's Facebook we'll create one
					//return res.json({ status: 400, message: 'No record found for that Facebook ID' }, 400);
					
					var graph_api = 'https://graph.facebook.com/me?access_token=',
						facebook_token = req.param('facebook_token');
				
					request.get({ url: graph_api+facebook_token, json: true }, function (error, response, body) {
					
						if (!error && response.statusCode == 200) {
							
							var new_api_key = hat();
							
							User.create({
							 
							 	name: body.name,
							 	email: body.email,
							 	facebookId: req.param('facebook_id'),
							 	password: 'null',
							 	api_key: new_api_key
							 	
							}).done(function(err, user){
							 
								if (err) {
									return res.json({ status: 400, error: err }, 400);
								}
								
								if (user) {
									console.log('Facebook user created!');
									user.apiKey = user.api_key;
									return res.json(user, 200);
								} else {
									return res.json({ status: 500, error: 'Looks like something went wrong' }, 500);
								}
							 	
							});
							
						} else {
							return res.json({ status: 403, error: 'Facebook token not valid' }, 403);
						}
						
					});
				}
				
			});
			
		} else {
			return res.json({ status: 400, message: 'Invalid or missing authentication type' }, 400);
		}
		
	},
	
	create: function(req, res) {
	
		if (req.param('auth_type')) {
			var auth_type = req.param('auth_type');
		}
		
		if (auth_type == 'traditional') {
		
			// AUTH: Traditional (Username & Password)
		
			try {
			
				if(!req.param('password') && !req.param('email') && !req.param('name')) {
					return res.json({ status: 400, error: 'Missing parameters' }, 400);
				}
				
				function createUser(hash) {
					
					var new_api_key = hat();
					
					User.create({
					 
					 	name: req.param('name'),
					 	email: req.param('email'),
					 	password: hash,
					 	api_key: new_api_key
					 	
					}).done(function(err, user){
					 
						if (err) {
							return res.json({ status: 500, error: err }, 500);
						}
						
						if (user) {
							return res.json({ user: user, api_key: new_api_key });
						} else {
							return res.json({ status: 500, error: 'Looks like something went wrong' }, 500);
						}
					 	
					});
				 
				};
				
				bcrypt.hash(req.param('password'),SALT_WORK_FACTOR,function(err, hash){
				
					if(err) {
						return res.json({ status: 500, error: err }, 500);
					}
					
					createUser(hash);
					
				});
			
			} catch(e) {
				return res.json({ status: 500, error: e.message }, 500);
			}
		
		} else if (auth_type == 'facebook') {
		
			// AUTH: Facebook
			
			if (!req.param('facebook_token') || !req.param('facebook_id')) {
				return res.json({ status: 400, error: 'Missing Facebook token or ID' }, 400);
			}
			
			var graph_api = 'https://graph.facebook.com/me?access_token=',
				facebook_token = req.param('facebook_token');
			
			request.get({ url: graph_api+facebook_token, json: true }, function (error, response, body) {
			
				if (!error && response.statusCode == 200) {
					
					var new_api_key = hat();
					
					User.create({
					 
					 	name: body.name,
					 	email: body.email,
					 	facebookId: req.param('facebook_id'),
					 	password: 'null',
					 	api_key: new_api_key
					 	
					}).done(function(err, user){
					 
						if (err) {
							return res.json({ status: 400, error: err }, 400);
						}
						
						if (user) {
							user.apiKey = user.api_key;
							return res.json(user, 200);
						} else {
							return res.json({ status: 500, error: 'Looks like something went wrong' }, 500);
						}
					 	
					});
					
				} else {
					return res.json({ status: 403, error: 'Facebook token not valid' }, 403);
				}
				
			});
			
		} else {
			return res.json({ status: 400, message: 'Invalid or missing authentication type' }, 400);
		}
	
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to AuthController)
	*/
	_config: {
		blueprints: {
			pluralize: false
		}
	}
  
};
