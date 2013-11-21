/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,

	attributes: {
	
	    name: {
	        type: 'string',
	        required: true
	    },
	    
	    email: {
		    type: 'string',
		    email: true,
		    required: true,
		    unique: true
	    },
	    
	    password: {
			type: 'string',
			required: true
	    },
	    
	    facebook_id: {
		    type: 'string'
	    }
	    
	    /*toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
	    }*/
		    
	}

};
