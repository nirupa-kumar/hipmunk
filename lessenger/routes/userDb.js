/* Array to store joined users */
var userDb = [];

exports.addUser = function(userObj) {
	userDb[userObj.user_id] = { 
			                    user_id: userObj.user_id, 
			                    name : userObj.name
			                  };
}

