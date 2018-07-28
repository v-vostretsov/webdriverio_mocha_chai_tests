const Page = require('./page');
const request = require("request-promise-native");
const cheerio = require("cheerio");

const loginPage = Object.create(Page, {
    /**
     * define elements
     */
    username: { get: () => $("#usr") },
    password: { get: () => $("#pwd") },
    loginButton: { get: () => $("input[type='submit']") },
    messageText: { get: () => $("#case_login h3") },

    /**
     * define or overwrite page methods
     */
    open: { value: function() {
        Page.open.call(this, '/login');
    }},

    login: { value: function(username, password) {
        this.username.setValue(username);
        this.password.setValue(password);
        this.loginButton.click();
        return this;
    }},

    getMessageText: { value: function(){
        return this.messageText.getText();
    }},

    loginThroughHttp: { value: function (username, password){
        let options = { 
            method: "POST", 
            uri: "http://testing-ground.scraping.pro/login?mode=login", 
            form: { usr: username, pwd: password},
            followAllRedirects: true,
            timeout: 30000,
            resolveWithFullResponse: true,
            jar: true
        };
        return request(options).then(function (resp) { 
            let $ = cheerio.load(resp.body);
            return {
                code: resp.statusCode,
                message: $("#case_login h3").text()
            }
            
        });

    }}

});

module.exports = loginPage;