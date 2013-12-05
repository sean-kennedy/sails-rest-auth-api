/**
 * GroupController
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

module.exports = {
    
	find: function(req, res) {
	
		if (!req.param('id')) {
		
			Group.find().where({ private: false }).done(function(err, groups) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (groups) {
					return res.json(groups, 200);
				} else {
					return res.json({ status: 200, message: 'Goose egg!' }, 200);
				}
				
			});
		
		} else {
			
			Group.findOne({ id: req.param('id') }).done(function(err, group) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (group) {
				
					if (group.private == false || req.user.id == group.owner) {
						return res.json(group, 200);
					} else {
						return res.json({ status: 400, message: 'No record found for that ID' }, 400);
					}	
								
				} else {
					return res.json({ status: 400, message: 'No record found for that ID' }, 400);
				}
				
			});
			
		}
	
	},
	
	create: function(req, res) {
	
		if (!req.param('name')) {
			return res.json({ status: 400, error: 'No group name specified' }, 400);
		}
		
		if (req.param('private')) {
			if (req.param('private') == 'true') {
				var group_private = true;
			} else if (req.param('private') == 'false') {
				var group_private = false; 
			} else {
				return res.json({ status: 400, error: 'Private parameter not formed correctly' }, 400);
			}
		} else {
			var group_private = true;
		}

		Group.create({
		
			name: req.param('name'),
			description: req.param('description'),
			owner: req.user.id,
			private: group_private
			
		}).done(function(err, group) {
		
			if (err) {
				return res.json({ status: 500, error: err }, 500);
			}
			
			if (group) {
				group.owner = req.user.name;
				return res.json(group);
			} else {
				return res.json({ status: 500, error: 'Looks like something went wrong' }, 500);
			}
			
		});
	
	},
	
	update: function(req, res) {
	
		res.json({ status: 200, message: 'Update' });
	
	},
	
	destroy: function(req, res) {
	
		if (req.param('id')) {
		
			Group.findOne({ id: req.param('id') }).done(function(err, group) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (group) {
					
					// Check permission
					if (req.user.id == group.owner) {
					
						group.destroy(function(err){
							if (err) {
								return res.json({ status: 500, error: err }, 500);
							}
							
							return res.json({ status: 200, message: 'Group deleted' }, 200);
						});
						
					} else {
						return res.json({ status: 403, error: 'Forbidden' }, 403);
					}
					
				} else {
					return res.json({ status: 400, message: 'No record found for that ID' }, 400);
				}
			
			});
		
		} else {
			return res.json({ status: 400, error: 'No ID specified' }, 400);
		}
	
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to GroupController)
	*/
	_config: {}
  
};
