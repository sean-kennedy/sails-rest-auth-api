/**
 * BookmarkController
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
		
			Bookmark.find().done(function(err, bookmarks) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				return res.json(bookmarks, 200);
				
			});
		
		} else {
			
			// Might need to auth this, will leave it global for now
			
			Bookmark.findOne({ id: req.param('id') }).done(function(err, bookmarks) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (bookmarks) {
					return res.json(bookmarks, 200);
				} else {
					return res.json({ status: 400, message: 'No record found for that ID' }, 400);
				}
				
			});
			
		}
		
	},
  
	create: function(req, res) {
	
		if (!req.param('url')) {
			return res.json({ status: 400, error: 'No URL specified' }, 400);
		}
	
		Bookmark.create({
		
			url: req.param('url'),
			description: req.param('description'),
			user_name: req.user.name, 
			user_id: req.user.id
			
		}).done(function(err, bookmark) {
		
			if (err) {
				return res.json({ status: 500, error: err }, 500);
			}
			
			if (bookmark) {
				return res.json(bookmark);
			} else {
				return res.json({ status: 500, error: 'Looks like something went wrong' }, 500);
			}
			
		});
		
	},
	
	update: function(req, res) {
	
		if (req.param('id')) {
		
			Bookmark.findOne({ id: req.param('id') }).done(function(err, bookmark) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (bookmark) {
					
					// Check permission
					if (req.user.id == bookmark.user_id) {
					
						// Update object
						var new_params = {};
						
						if (req.param('url')) {
							new_params.url = req.param('url');
						}
						
						if (req.param('description')) {
							new_params.description = req.param('description');
						}
						
						Bookmark.update({ id: req.param('id') }, new_params).done(function(err, bookmarks) {
						
							if(err) {
								return res.json({ status: 500, error: err }, 500);
							}
							
							if (!bookmarks.length == 0) {
								return res.json({ status: 200, message: 'Bookmark updated', attributes: bookmarks }, 200);
							} else {
								return res.json({ status: 400, message: 'No record found for that ID' }, 400);
							}
						
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
		
			/*if (req.user.id == req.param('id')) {
			
				var id = req.param('id');
				
				var new_params = {};
				
				if (req.param('name')) {
					new_params.name = req.param('name');
				}
				
				if (req.param('email')) {
					new_params.email = req.param('email');
				}
				
				User.update({ id: id }, new_params).done(function(err, users) {
				
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
			}*/
		

	
	},
	
	destroy: function(req, res) {
		
		if (req.param('id')) {
		
			Bookmark.findOne({ id: req.param('id') }).done(function(err, bookmark) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (bookmark) {
					
					// Check permission
					if (req.user.id == bookmark.user_id) {
					
						bookmark.destroy(function(err){
							if (err) {
								return res.json({ status: 500, error: err }, 500);
							}
							
							return res.json({ status: 200, message: 'Bookmark deleted' }, 200);
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
	* (specific to BookmarkController)
	*/
	_config: {}
  
};
