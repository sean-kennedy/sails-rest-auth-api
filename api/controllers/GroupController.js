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
	
		res.json({ status: 200, message: 'Find' });
	
	},
	
	create: function(req, res) {
	
		if (!req.param('name')) {
			return res.json({ status: 400, error: 'No group name specified' }, 400);
		}

		Group.create({
		
			name: req.param('name'),
			description: req.param('description'),
			owner: req.user.id
			
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
	
		res.json({ status: 200, message: 'Destroy' });
	
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to GroupController)
	*/
	_config: {}
  
};
