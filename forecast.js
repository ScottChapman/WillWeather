const _ = require('lodash')
const moment = require('moment')
const openwhisk = require('openwhisk')

async function main(message) {
    // console.log("***" + JSON.stringify(process.env))
    // console.log("***" + JSON.stringify(message))
    const ow = openwhisk();

    // Check for zipcode first
    if (message.zipcode) {
        const {location} = await ow.actions.invoke({
            name: "geocode",
            blocking: true,
            result: true,
            params: {
                zipcode: message.zipcode
            }
        })
        message.latitude = location.latitude;
        message.longitude = location.longitude;
        delete message.zipcode;
    }
    const [package] = _.filter(await ow.packages.list(), package => {
        if (package.name.startsWith("Bluemix_Weather"))
            return package;
    })

    if (!package)
        throw new Error("No Weather Service bound to this space")
    
    if (message.hours) {
        var hours = _.map(_.split(message.hours,","), hour => {
            return _.parseInt(hour)
        })
    }
    const today = moment();
    const tomorrow = moment().add(1,'day');
    var params = _.assign({
        units: 'e',
        timePeriod: "48hour"
    }, _.pick(message,["latitude","longitude","units","timePeriod"]))
    var resp = [];
    const {forecasts} = await ow.actions.invoke({
        name: `${package.name}/forecast`,
        blocking: true,
        result: true,
        params: params
    });
    for (var forecast of forecasts) {
        const day = moment(forecast.fcst_valid_local)
        forecast.dow = day.format('dddd')
        forecast.hour = day.format("hhA")
        if (!forecast.golf_index)
            forecast.golf_category = "Unknown"
        if (!hours || hours.includes(day.hour())) {
            if (message.raw)
                resp.push(forecast)
            else
                resp.push(`${forecast.dow} ${forecast.hour}: ${forecast.golf_category}/${forecast.phrase_12char} (${forecast.temp}\u00B0F, ${forecast.pop}%, ${forecast.wspd}MPH)`);
            
            if (message.firstOnly && hours) {
                _.remove(hours, val => {
                    return val === day.hour()
                })
            }
        }
    }
    return { forecasts: resp }
}

// process.env.TZ = "America/New_York"

var latlong = {
    latitude: "42.6167569",
    longitude: "-71.5828456"
};
const zipcode = {
    hours: "7,11,15",
    firstOnly: true,
    zipcode: "01450"
}
main(zipcode).then(resp => {
    console.log(JSON.stringify(resp,null,2))
}).catch(err => {
    console.dir(err)
})