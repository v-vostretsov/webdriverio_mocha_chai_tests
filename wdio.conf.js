const fs = require("fs");

exports.config = {
    
    specs: [
        './specs/*.spec.js'
    ],
  
    exclude: [
        // 'path/to/excluded/files'
    ],
   
    maxInstances: 1,
   
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        chromeOptions: {
            args: ["no-sandbox", "window-size=1920,1080"]
        }
    }],

    credentials: {
        username: "admin",
        password: "12345"
    },
 
    reporters: ["spec", "allure"],

    sync: true,
 
    logLevel: 'silent',
  
    coloredLogs: true,
  
    bail: 0,

    services: ["selenium-standalone"],
 
    screenshotPath: './errorShots/',
   
    baseUrl: 'http://testing-ground.scraping.pro',
    
    waitforTimeout: 10000,
  
    connectionRetryTimeout: 90000,
    
    connectionRetryCount: 3,

    framework: 'mocha',
  
    mochaOpts: {
        ui: 'bdd',
        timeout: 600000
    },

    reporterOptions: {
        allure: {
            outputDir: "allure-results"
        }
    },

    before: function (capabilities, specs) {
        var chai = require("chai");
        chai.config.includeStack = true;
        chai.config.showDiff = true;
        chai.config.truncateThreshold = 0;
        global.expect = chai.expect;
        chai.Should();
    },

    afterTest: function (test) {
        //attach screenshot and browser console logs to allure report on failure
        if (!test.passed) {
            try {
                var screenshotDir = "./errorShots";
                
                if (!fs.existsSync(screenshotDir)) {
                    fs.mkdirSync(screenshotDir);
                }
                browser.saveScreenshot(`./errorShots/Error ${test.fullTitle + + new Date()}.png`);
            } catch(e) {
                console.log(e);
            }
            browser.log("browser");
            
        }
    },

    afterSuite: function (suite){
        browser.deleteCookie();
    }
  
}
