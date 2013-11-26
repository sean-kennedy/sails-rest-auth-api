/**
 * UserController
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
 
/*var bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , MIN_PASSWORD_LENGTH = 8;*/
  
var request = require('request');

module.exports = {

	find: function(req, res) {
	
		if (!req.param('id')) {
		
			User.find().done(function(err, users) {
			
				if (err) {
					return res.json({ status: 404, error: err }, 404);
				}
				
				return res.json({ users: users }, 200);
				
			});
		
		} else {
			
			User.findOne({ facebook_id: req.param('id') }).done(function(err, users) {
			
				if (err) {
					return res.json({ status: 404, error: err }, 404);
				}
				
				return res.json({ user: users }, 200);
				
			});
			
		}
		
	},
	
	/*create: function(req, res) {
	
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
		
			// Creating a new user with the Facebook credentials, lets validate them first agaisnt Facebook
			request.get({ url: graph_api+access_token, json: true }, function (error, response, body) {
			
				if (!error && response.statusCode == 200) {
					
					// User data received, try to enter it in the database 
					// Errors will be caught by Waterline using the validation rules set on the User model
					User.create({
					
						name: body.name,
						email: body.email,
						facebook_id: body.id
						
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
		
			// Insufficient params supplied, send back an error response the client can use
			return res.json({ status: 403, error: 'Access token or user ID not specified' }, 403);
			
		}
		
		//return res.json({ id: req.param('facebook_id'), access_token: req.param('access_token') });
		
	},*/
	
	destroy: function(req, res) {
		
		if (req.param('id')) {
			
			var id = req.param('id');
			
			User.destroy({ facebook_id: id }).done(function(err, users) {
			
				if(err) {
					console.log(err);
					return res.json(err);
				} else {
					return res.json({ status: 200, message: 'User deleted' }, 200);
				}
			
			});
		
		} else {
			
			return res.json({ status: 200, error: 'No ID specified' }, 200);
			
		}
		
	},
	
	/*create: function(req, res) {
	
         try {
         
	         if(!req.param('password') || req.param('password').length < MIN_PASSWORD_LENGTH) {
		         return res.json({ error: 'Password not sent or doesn\'t meet length requirement ('+MIN_PASSWORD_LENGTH+' chars)!' });
	         }
	         
	         if (!req.param('email')) {
		         return res.json({ error: 'No email entered!' });
	         }
	        
	         function createUser(hash) {
	         
		         User.create({
		         
			     	name: req.param('name'),
			     	email: req.param('email'),
			     	password: hash
			     	
		         }).done(function(err, user){
		         
		         	if(err) {
		         		console.log(err);
		         		return res.json(err);
		         	}
		         	
		         	if (user) {
		         		res.json(user);
		         	}
		         	
		         });
		         
	         };
	        
	         bcrypt.hash(req.param('password'),SALT_WORK_FACTOR,function(err, hash){
	         
	         	if(err) {
	         		console.log(err);
	         	}
	         	
	         	createUser(hash);
	         	
	         });
        
         } catch(e) {
	         return res.json({ error: e.message }, 500);
         }
         
	},*/
	
	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {}
  
};
