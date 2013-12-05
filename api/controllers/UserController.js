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
  
//var request = require('request');

// req.user contains the user object of the API KEY that made the request

module.exports = {

	find: function(req, res) {
	
		if (!req.param('id')) {
		
			User.find().done(function(err, users) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				return res.json(users, 200);
				
			});
		
		} else {
			
			User.findOne({ id: req.param('id') }).done(function(err, user) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (user) {

					if (req.user.id == user.id) {
					
						Group.find().where({ owner: req.user.id }).done(function(err, groups) {	
							if(err) {
								return res.json({ status: 500, error: err }, 500);
							}
							if (groups) {
								groups.forEach(function(group){
									delete group.createdAt;
									delete group.updatedAt;
									delete group.owner;
								});
								user.groups = groups;
								return res.json(user, 200);
							}
						});

					} else {
						return res.json(user, 200);
					}
					
				} else {
					return res.json({ status: 400, message: 'No record found for that ID' }, 400);
				}
				
			});
			
		}
		
	},
	
	create: function(req, res) {
		
		return res.json({ status: 404, message: 'This endpoint does not exist' }, 404);
		
	},
	
	update: function(req, res) {
	
		if (req.param('id')) {
		
			if (req.user.id == req.param('id')) {
				
				var new_params = {};
				
				if (req.param('name')) {
					new_params.name = req.param('name');
				}
				
				if (req.param('email')) {
					new_params.email = req.param('email');
				}
				
				User.update({ id: req.param('id') }, new_params).done(function(err, users) {
				
					if(err) {
						return res.json({ status: 500, error: err }, 500);
					}
					
					if (!users.length == 0) {
						return res.json({ status: 200, message: 'User updated', attributes: users }, 200);
					} else {
						return res.json({ status: 400, message: 'No record found for that ID' }, 400);
					}
				
				});
				
			} else {
				return res.json({ status: 403, error: 'Forbidden' }, 403);
			}
		
		} else {
			return res.json({ status: 400, error: 'No ID specified' }, 400);
		}
	
	},

	destroy: function(req, res) {
		
		if (req.param('id')) {
		
			if (req.user.id == req.param('id')) {
			
				var id = req.param('id');
				
				User.destroy({ id: id }).done(function(err, users) {
				
					if(err) {
						return res.json({ status: 500, error: err }, 500);
					}
					
					if (!users.length == 0) {
						return res.json({ status: 200, message: 'User deleted' }, 200);
					} else {
						return res.json({ status: 400, message: 'No record found for that ID' }, 400);
					}
				
				});
				
			} else {
				return res.json({ status: 403, error: 'Forbidden' }, 403);
			}
		
		} else {
			
			return res.json({ status: 400, error: 'No ID specified' }, 400);
			
		}
		
	},
	
	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {}
  
};
