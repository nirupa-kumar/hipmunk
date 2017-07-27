var express = require('express');
var https = require('https');
var multiparty = require('multiparty');
var util = require('util');
var _ = require('lodash');
var request = require('request');
var DARKSKY_KEY = "cb9222cd2c1e9d6b92099e397014ed29";

exports.getCurrentWeather = function(geoLocation, callback) {
	console.log("getCurrentWeather: getting weather for: "
			+ JSON.stringify(geoLocation));

	var dskyUrl = "https://api.darksky.net/forecast/" + DARKSKY_KEY + "/"
			+ encodeURIComponent(geoLocation.lat + "," + geoLocation.lng);
	request(dskyUrl, function(error, response, body) {
		console.log('getCurrentWeather: response error:', error);
		console.log('getCurrentWeather: response statusCode:', response
				&& response.statusCode);

		if (error) {
			callback(error.code, null);
		} else if (response) {
			if (response.statusCode == 200 && body != null) {
				var bodyJson = JSON.parse(body);
				var currConditions = _.get(bodyJson, 'currently');
				if (currConditions != null) {
					var resStr = "Currently it's "
							+ _.get(currConditions, 'temperature') + "F. "
							+ _.get(currConditions, 'summary');
					console.log("getCurrentWeather: Success response: "
							+ resStr);
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