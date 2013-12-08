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
		
			Group.find().done(function(err, groups) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (groups) {
				
					new_groups = [];
				
					groups.forEach(function(group) {
						if (req.user.id == group.owner || group.subscribers.indexOf(req.user.id) > -1) {
							delete group.bookmarks;
							delete group.subscribers;
							new_groups.push(group);
						}
					});
					
					return res.json(new_groups, 200);
				
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
				
					if (group.private == false || req.user.id == group.owner || group.subscribers.indexOf(req.user.id) > -1) {
						
						if (group.bookmarks.length > 0) {
				
							// Bunch of async stuff
							var gb = group.bookmarks.length,
								new_bookmarks_array = [];
							
							function checkIfReady(gb) {
								if (gb == 1) {
									group.bookmarks = new_bookmarks_array;
									delete group.subscribers;
									return res.json(group, 200);
								}
							}
						
							group.bookmarks.forEach(function(group_bookmark){
							
								Bookmark.findOne({ id: group_bookmark }).done(function(err, bookmark) {
									if (err) {
										return res.json({ status: 500, error: err }, 500);
									}
									
									if (bookmark) {
										delete bookmark.updatedAt;
										new_bookmarks_array.push(bookmark);
										checkIfReady(gb--);
									} else {
										checkIfReady(gb--);
									}
								});
								
							});
							
						} else {
							delete group.subscribers;
							return res.json(group, 200);
						}
						
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
	
		if (req.param('id')) {
		
			Group.findOne({ id: req.param('id') }).done(function(err, group) {
			
				if (err) {
					return res.json({ status: 500, error: err }, 500);
				}
				
				if (group) {
					
					// Check permission
					if (req.user.id == group.owner || group.subscribers.indexOf(req.user.id) > -1) {
						
						Group.findOne({ id: req.param('id') }).done(function(err, group) {
						
							if(err) {
								return res.json({ status: 500, error: err }, 500);
							}
							
							if (group) {
							
								function groupSave() {
									group.save(function(err){
										return res.json({ status: 200, message: 'Group updated', attributes: group }, 200);
									});
								}
							
								if (req.param('name')) {
									group.name = req.param('name');
								}
								
								if (req.param('description')) {
									group.description = req.param('description');
								}
								
								if (req.param('private')) {
									if (req.param('private') == 'true') {
										group.private = true;
									} else if (req.param('private') == 'false') {
										group.private = false; 
									} else {
										return res.json({ status: 400, error: 'Private parameter not formed correctly' }, 400);
									}
								}
								
								if (req.param('bookmark') && req.param('subscriber') ) {
									return res.json({ status: 400, message: 'Cannot update subscriber and bookmark in the same request' }, 400); 
								} else if (req.param('bookmark')) {

									Bookmark.findOne({ id: req.param('bookmark') }).done(function(err, bookmark){
										if (err) {
											return res.json({ status: 500, error: err }, 500);
										}
										
										if (bookmark) {
											if (req.user.id == bookmark.userId) {
												if (group.bookmarks.indexOf(bookmark.id) == -1) {
												
													group.bookmarks.push(bookmark.id);
													groupSave();
													
												} else {
													return res.json({ status: 400, message: 'That bookmark is already part of this group' }, 400); 
												}
											} else {
												return res.json({ status: 400, message: 'User does not have permission to edit that bookmark' }, 400);
											}
										} else {
											return res.json({ status: 400, message: 'No record found for that bookmark ID' }, 400);
										}
									});
								
								} else if (req.param('subscriber')) {
								
									User.findOne({ id: req.param('subscriber') }).done(function(err, user) {
										if (err) {
											return res.json({ status: 500, error: err }, 500);
										}
										
										if (user) {
											if (group.subscribers.indexOf(user.id) == -1) {
											
												group.subscribers.push(user.id);
												groupSave();
												
											} else {
												return res.json({ status: 400, message: 'That user is already part of this group' }, 400); 
											}
										} else {
											return res.json({ status: 400, message: 'No record found for that user ID' }, 400);
										}
									});
									
								} else {
									groupSave();
								}
								
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
