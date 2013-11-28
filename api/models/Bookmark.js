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
	
	    url: {
	        type: 'string',
	        required: true
	    },
	    
	    description: {
		    type: 'text'
	    },
	    
	    user_id: {
		    type: 'string',
		    required: true
	    },
	    
	    user_name: {
		    type: 'string',
		    required: true
	    },
	 
		getUserName: function(callback) {
		
			User.findOne({ id: this.user_id }).exec(function(err, user) {
				callback(user);
			});
			
		}
	    
	}

};
