// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

var request = require('request-promise');

/**
 * Get hourly weather forecast for a lat/long from the Weather API service.
 *
 * Must specify one of zipCode or latitude/longitude.
 *
 * @param username The Weather service API account username.
 * @param username The Weather service API account password.
 * @param latitude Latitude of coordinate to get forecast.
 * @param longitude Longitude of coordinate to get forecast.
 * @param zipCode ZIP code of desired forecast.
 * @return The hourly forecast for the lat/long.
 */
function main(params) {
    console.log('input params:', params);
    var username = params.__bx_creds.weatherinsights.username;
    var password = params.__bx_creds.weatherinsights.password;
    var language = params.language || 'en-US';
    var zipcode = params.zipcode;
    var host = params.__bx_creds.weatherinsights.host || 'twcservice.mybluemix.net';
    var url = 'https://' + host + '/api/weather/v3/location/point';
    var qs = {language: language, postalKey: zipcode+":us"};

    console.log('url:', url);

    return request({
        url: url,
        qs: qs,
        auth: {username: username, password: password},
        json: true,
        timeout: 30000
    });
}

/*
const params = { 
    postalKey: "01450",
    __bx_creds: {
        weatherinsights: {
        credentials: "credentials",
        host: "twcservice.mybluemix.net",
        instance: "Weather",
        password: "sHQ2UCsNcK",
        port: 443,
        url: "https://4d5fe0d5-c4cc-456e-a003-13bae6dcd421:sHQ2UCsNcK@twcservice.mybluemix.net",
        username: "4d5fe0d5-c4cc-456e-a003-13bae6dcd421"
        }
    }
}

  main(params).then(resp => {
      console.dir(resp)
  }).catch(err => {
      console.dir(err)
  })
  */