var express = require('express');
var https = require('https');
var multiparty = require('multiparty');
var util = require('util');
var _ = require('lodash');
var request = require('request');  
var DARKSKY_KEY = "cb9222cd2c1e9d6b92099e397014ed29";

exports.getCurrentWeather = function(geoLocation,callback){
//var options = {
//		  host: 'api.darksky.net',
//		  path: '/forecast/cb9222cd2c1e9d6b92099e397014ed29/37%2E7749%2C%2D122%2E4194'
//		};
//
//		callback = function(response) {
//		  var str = '';
//
//		  //another chunk of data has been recieved, so append it to `str`
//		  response.on('data', function (chunk) {
//		    str += chunk;
//		  });
//
//		  //the whole response has been recieved, so we just print it out here
//		  response.on('end', function () {
//		    console.log(str);
//		  });
//		}
//
//		https.request(options, callback).end();
	
	console.log("getCurrentWeather: getting weather for: " +   JSON.stringify(geoLocation));
	
	var dskyUrl = "https://api.darksky.net/forecast/" + DARKSKY_KEY+ "/" 
			             + encodeURIComponent(geoLocation.lat+","+geoLocation.lng);

	console.log("getCurrentWeather: GET URL = "+ dskyUrl);
	
	request(dskyUrl, function (error, response, body) {
	  console.log('getCurrentWeather: response error:', error); 
	  console.log('getCurrentWeather: response statusCode:', response && response.statusCode); 
	 
	  if(error) {
		  callback (error.code, null);
	  } else if(response) {
		   if (response.statusCode == 200 && body!=null) {
			   var bodyJson = JSON.parse(body);
			   var currConditions = _.get(bodyJson, 'currently'	);
			   if(currConditions != null) {
		           var resStr =  "It is " + _.get(currConditions, 'temperature') +"F. " + _.get(currConditions, 'summary');
		           console.log("getCurrentWeather: Success response: "+resStr);
		           callback(null, resStr);
			   } else {
				   callback("Missing Information", null);
			   }
	       } else {
	    	   callback(response.statusCode, null);
	       }
 	  } else {
 		  callback("Error", null);
 	  }
	});
}