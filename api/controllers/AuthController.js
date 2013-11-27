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
  hat = require('hat');
 
//var request = require('request');

module.exports = {

	find: function(req, res) {
	
		// Auth user credentials and return ze API key
		
		// Could include different Auth strategies to login and return the API key
		
		if(!req.param('password') && !req.param('email')) {
			return res.json({ status: 400, error: 'Missing parameters' }, 400);
		}
		
		User.findOne({ email: req.param('email') }).done(function(err, users) {
		
			if (err) {
				return res.json({ status: 500, error: err }, 500);
			}
			
			if (users) {
				
				var db_password = users.password;
				
				// Check the password
				bcrypt.compare(req.param('password'), db_password, function(err, isMatch) {
				    
				    if (err) {
					    return res.json({ status: 500, error: err }, 500);
				    }
				    
				    if (isMatch == true) {
				    	
				    	// Grab the users API key to send back with the response
				    	var api_key = users.getApiKey();
					    return res.json({ user: users, api_key: api_key }, 200);
					    
				    } else {
					    return res.json({ status: 400, message: 'Incorrect login details' }, 400);
				    }
				    
				});
				
				
			} else {
				return res.json({ status: 400, message: 'Incorrect login details' }, 400);
			}
		
		});
		
	},
	
	create: function(req, res) {
	
         try {
         
	         if(!req.param('password') && !req.param('email') && !req.param('name')) {
		         return res.json({ status: 400, error: 'Missing parameters' }, 400);
	         }
	        
	         function createUser(hash) {
	         	
	         	// Generate a new API key
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
						// Include the new API key in the response
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
	
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to AuthController)
	*/
	_config: {}
  
};
