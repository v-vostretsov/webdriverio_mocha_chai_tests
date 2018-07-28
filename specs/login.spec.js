const loginPage = require('../pages/loginPage');
const message = require("./test-data/login-parameters").messages;
const invalidCredentials = require("./test-data/login-parameters").invalidCredentials;
const username = browser.options.credentials.username;
const password = browser.options.credentials.password;

describe("Login", function(){

    beforeEach(function(){
        loginPage.open();
    });

    it("should login with valid credentials", function(){
        loginPage.login(username, password);
        expect(loginPage.getMessageText()).to.equal(message.welcomeMessage, "user was not logged in");  
    });

    invalidCredentials.forEach(function (data){
        it(`should not login with invalid ${data.incorrectData}`, function(){
            loginPage.login(data.username, data.password);
            expect(loginPage.getMessageText()).to.equal(message.accessDeniedMessage, "user was logged in with invalid credentials");    
        });
    });

    it("user should login with valid credentials through http request", async function(){
        let loginInfo = await loginPage.loginThroughHttp(username, password);
        expect(loginInfo.code).to.equal(200, "http response didn't include 200 code");   
        expect(loginInfo.message).to.equal(message.welcomeMessage, "user was not logged in");     
    });

    invalidCredentials.forEach(function (data){
        it(`user should not login with invalid ${data.incorrectData} through http request`, async function(){
            let loginInfo = await loginPage.loginThroughHttp(data.username, data.password);
            expect(loginInfo.code).to.equal(200, "http response didn't include 200 code");   
            expect(loginInfo.message).to.equal(message.accessDeniedMessage, "user was not logged in");   
        });
    });

    it("user should not be logged without properly stored cookie", function(){
        loginPage.login(username, password).
            clearAllCookie();
        expect(loginPage.getMessageText()).to.equal(message.cookieMissingMessage);   
    });

});
