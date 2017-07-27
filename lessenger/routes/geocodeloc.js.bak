var express = require('express');
var multiparty = require('multiparty');
var util = require('util');
var _ = require('lodash');

var googleMapsClient = require('@google/maps').createClient({
	  key: 'AIzaSyD7W7v5psM8TDJwUV2WxsPkoYRtByh07Y0'
	});

/* Get the location co-ordinates from location string using google maps API */ 
exports.getLocation = function(location, callback){
	googleMapsClient.geocode({
		  address: location
		}, function(err, response) {
			if (!err) {
				var results = response.json.results && response.json.results;
				if(results && results.length > 0) {
					console.log(JSON.stringify(response.json.results));
					console.log("Formatted address= "+response.json.results[0].formatted_address);
					console.log("co-ordinates= "+ JSON.stringify(response.json.results[0].geometry.location));
					
					/* Almost all the time we get only one entry in the results array. So get the zeroeth entry */ 
					var ret =  { 'addr'    : response.json.results[0].formatted_address,
								 'co_ords' : response.json.results[0].geometry.location}
					callback(null, ret);	
				 } else {
					 callback('Error', 'Unable to get the gelocation information');
				 }
		    
		  } else {
			  callback(err, response);
		  }
	});
}

