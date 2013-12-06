/**
 * Bookmark
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	
	schema: true,

	attributes: {
	
		title: {
			type: 'string'
		},
	
	    url: {
	        type: 'string',
	        required: true
	    },
	    
	    description: {
		    type: 'text',
		    defaultsTo: null
	    },
	    
	    userId: {
		    type: 'string',
		    required: true
	    },
	    
	    userName: {
		    type: 'string'
	    },
	    
	    groups: {
		    type: 'string',
	    },
	 
		getUserName: function(callback) {
		
			User.findOne({ id: this.userId }).exec(function(err, user) {
				callback(user);
			});
			
		}
	    
	}

};
