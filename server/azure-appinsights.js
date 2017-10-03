if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    const appInsights = require('applicationinsights');
    console.log("Enabling azure application insights");
    appInsights.setup().start();
    module.exports = appInsights.client;
} else {
    module.exports = null;
}
