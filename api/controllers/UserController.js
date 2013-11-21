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
 
var bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , MIN_PASSWORD_LENGTH = 8;

module.exports = {
	
	create: function(req, res) {
	
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
         
	},
	
	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {}
  
};
