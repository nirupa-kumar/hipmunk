var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var _ = require('lodash');
var geocodeloc = require('./geocodeloc.js');
var msgProcessor = require('./messageProcessor.js');
var weather = require('./weather.js');
var userDb = require('./userDb.js');

router.get('/', function(req, res) {
	  res.send("chat!!!!");
	});

router.post('/messages',function(req,res) {
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {
		
		if(err) {
			res.statusMessage = "Invalid form data";
		    res.status(400).end();
		}
		
		console.log(util.inspect({fields: fields, files: files}));

		var action = _.get(fields, 'action');
		/* If action is join add user to userDb and return a hello message */
		if(action == "join") {
			var id = _.get(fields, 'user_id');
			var name = _.get(fields, 'name');
			
			console.log("User "+name +" joined chatbot");
			
			if(name && name.length > 0) {
				
				/* Add a new user to user database */
				var usr = { 'user_id' : id, 'name' : name };
				userDb.addUser(usr);
				
				/* Send response to user */
				res.setHeader('Content-Type', 'application/json');
				var ret = {
						   "messages": [
							             {
								           "type": "text",
								           "text": "Hello " + name +"!"
								         },
								       ]
					     }
				res.send(ret);
			}
		} else if (action == 'message') {
			/* Process message to get location info and return weather */
			var location = "";
			var text = _.get(fields, 'text');			
			if(text && text.length > 0) {
				res.setHeader('Content-Type', 'application/json');
			
				/* Call message processor that will return location from the string */
				msgProcessor.processUserMessage(text, function(err, mpRes){
					
					if(err) {
						res.statusMessage = "Failure in geo location processing";
						res.status(400).send(getErrorMessage());
					} else {
						location = mpRes;
						
						/* Use the location info to get the co-ordinates from Google Maps API */
						geocodeloc.getLocation(location, function(err, geoRes){
							if(err) {
								res.statusMessage = "Failure in geo location processing";
								res.status(400).send(getLocErrorMessage());
							} else {
								/*Call the weather API and return the results. */								
								console.log("Location to fetch weather info: "+JSON.stringify(geoRes));
								var geoLocation = JSON.stringify(geoRes);
								weather.getCurrentWeather(geoRes.co_ords,function(err,weaRes){
									if(err) {
										res.statusMessage = "Failure in current weather processing";
										res.status(400).send(getWeatherErrorMessage());
									} else {
									    console.log(weaRes);
									    var ret = {
												   "messages": [
												                {
											            	      "type": "text",
											            	      "text": weaRes
												                 },
												               ]
							                      };
									    res.send(ret);
									}
								});
							}
						});
					}
				});
			}
		} 
		
	});
});

function getErrorMessage() {
	var ret = {
				"messages": [
				             {
			            	  "type": "text",
			            	  "text": "Sorry, I am not very intelligent. Could not process your message. Can you try again please?"
				             },
				            ]
              };
	return ret;
}

function getLocErrorMessage() {
	var ret = {
				"messages": [
				             {
			            	  "type": "text",
			            	  "text": "Sorry, I could not recognize the location. Can you please try again?"
				             },
				            ]
              };
	return ret;
}

function getWeatherErrorMessage() {
	var ret = {
				"messages": [
				             {
			            	  "type": "text",
			            	  "text": "Sorry, Unable to get weather information. Can you try again please?"
				             },
				            ]
              };
	return ret;
}

module.exports = router;
