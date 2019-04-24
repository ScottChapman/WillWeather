# WillWeather
Weather Forecast for Will

## Installation steps:
 * [Install ibmcloudcli](https://console.bluemix.net/docs/cli/index.html#overview)
 * Install cloud functions plugin: `ibmcloud plugin install cloud-functions`
 * log in: `ibmcloud login --sso -r us-south`
 * set ibmcloud target org: `ibmcloud target -o <IBM Email Address>`
 * create space (if it doesn't already exist): `ibmcloud cf create-space WeatherWidget`
 * Create service instance in [WebUI](https://cloud.ibm.com/catalog/services/weather-company-data)
   * Note: Be sure to add te service to your org & space (WeatherWidget)
 * Create credentials for the service
 * Refresh Cloud Functions Packages: `ibmcloud fn package refresh`
 * Install action: `ibmcloud fn action update forecast index.js --web true --kind nodejs:10`
 * get URL for action: `ibmcloud fn action get --url forecast`
 * in your browser invoke that URL (NOTE: Add `.json` to the end of the URL
 * URL parameters include:
    * *hours*: (comma separated list of hours, defaults to `7,11,15`
    * *latitude*: required
    * *longitude*: required
