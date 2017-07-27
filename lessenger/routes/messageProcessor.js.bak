var express = require('express');
var util = require('util');
var _ = require('lodash');

var allowedSubStrings = ["what's the weather in", "whats the weather in", "weather in", "weather"];

/* Process the user message and return location from the message string */
exports.processUserMessage = function(message, callback) {
    console.log("In processUserMessage: message= " + message);
	if(!message || message.length == 0) {
		callback(err, "processUserMessage Error: Empty message string!");
	}
	var msgStr = message.toString().toLowerCase();
	console.log("In processUserMessage: msgStr= " + msgStr);

	var len = allowedSubStrings.length;
	var i;
	for(i=0; i<len; i++) {
		var subStr = allowedSubStrings[i];
		console.log("subStr" + util.inspect(subStr));
	
		/* Handle double or more space between words in user messages. 
		 * Remove all spaces from user message strings and substrings and then process 
		 */
		msgStr = msgStr.split(' ').join('');
		subStr = subStr.split(' ').join('');
		
		if(msgStr.includes(subStr)) {
			console.log("message includes" + util.inspect(subStr));
			var location = msgStr.replace(subStr, "");
			console.log("Location is "+location);
			if(location && location.length > 0) {
				location = location.trim();
				console.log("Location is "+location);
				callback(null,location.trim());
				return;
			} 
		} 
	}
	
	console.log("After location processing");
	callback('Error', "processUserMessage Error: Unable to get location!");
}