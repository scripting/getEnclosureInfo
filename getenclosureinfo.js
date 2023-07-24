const fs = require ("fs");
const request = require ("request");
const utils = require ("daveutils");
const davehttp = require ("davehttp");

const config = {
	port: 5347,
	flAllowAccessFromAnywhere: true, 
	flLogToConsole: true
	};

function getEnclosureInfo (url, callback) { //7/24/23 by DW
	var options = {
		uri: url,
		method: "HEAD"
		};
	request (options, function (err, response, body) {
		if (err) {
			callback (err);
			}
		else {
			if (response.statusCode == 200) {
				callback (undefined, {
					length: Number (response.headers ["content-length"]),
					type: response.headers ["content-type"]
					});
				}
			else {
				const message = "Can't get the enclosure info because we received status code == " + response.statusCode + ".";
				callback ({message});
				}
			}
		});
	}

davehttp.start (config, function (theRequest) {
	const params = theRequest.params;
	function returnNotFound () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function returnError (jstruct) {
		theRequest.httpReturn (500, "application/json", utils.jsonStringify (jstruct));
		}
	function returnData (jstruct) {
		if (jstruct === undefined) {
			jstruct = {};
			}
		theRequest.httpReturn (200, "application/json", utils.jsonStringify (jstruct));
		}
	function httpReturn (err, jstruct) {
		if (err) {
			returnError (err);
			}
		else {
			returnData (jstruct);
			}
		}
	switch (theRequest.lowerpath) {
		case "/getenclosureinfo":
			getEnclosureInfo (params.url, httpReturn);
			return (true);
		default: 
			returnNotFound ();
			return (true);
		}
	});

