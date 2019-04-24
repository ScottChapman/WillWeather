const _ = require('lodash')
const moment = require('moment')
const openwhisk = require('openwhisk')

async function main(message) {
    console.log("***" + JSON.stringify(process.env))
    console.log("***" + JSON.stringify(message))
    const ow = openwhisk();
    const [package] = _.filter(await ow.packages.list(), package => {
        if (package.name.startsWith("Bluemix_Weather"))
            return package;
    })

    if (!package)
        throw new Error("No Weather Service bound to this space")
    
    var hours = _.split(message.hours || "7,11,15",",");
    const today = moment();
    const tomorrow = moment().add(1,'day');
    hours = _.map(hours, hour => {
        return _.parseInt(hour)
    })
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
        const day = moment.unix(forecast.fcst_valid)
        if (!day.isBetween(today,tomorrow))
            continue
        if (today.date() === day.date())
            forecast.day = "Today"
        else
            forecast.day = "Tomorrow"
        forecast.hour = day.format("hhA")
        if (hours.includes(day.hour())) {
            resp.push(`${forecast.day} ${forecast.hour}: ${forecast.golf_category}/${forecast.phrase_12char} (${forecast.temp}\u00B0F, ${forecast.pop}%, ${forecast.wspd}MPH)`);
        }
    }
    return { forecasts: resp }
}

// process.env.TZ = "America/New_York"

main({
    latitude: "42.6167569",
    longitude: "-71.5828456"
}).then(resp => {
    console.log(JSON.stringify(resp,null,2))
}).catch(err => {
    console.dir(err)
})