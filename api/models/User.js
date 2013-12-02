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
		    type: 'email',
		    email: true,
		    required: true,
		    unique: true
	    },
	    
	    password: {
		    type: 'String',
		    required: true
	    },
	    
	    facebookId: {
		    type: 'string',
		    defaultsTo: null
	    },
	    
	    api_key: {
		    type: 'string'
	    },
	    
	    toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			//delete obj.api_key;
			delete obj.facebookId;
			return obj;
	    }
		    
	}

};
