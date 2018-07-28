function Page () {
    this.title = 'My Page';
}

Page.prototype.open = function (path) {
    browser.url(path)
}

Page.prototype.clearAllCookie = function (path) {
    browser.deleteCookie();
    browser.refresh();
}

module.exports = new Page()