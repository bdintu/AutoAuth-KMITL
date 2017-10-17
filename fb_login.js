/* TUTORIAL SITE
	site : 	http://code-epicenter.com/how-to-login-amazon-using-phantomjs-working-example,
			https://gist.github.com/diogofrazao/6ff614dddd7ac688617c567cf0869a5f,
			https://gist.github.com/ecin/2473860
*/

/*********SETTINGS*********************/
var url = 'https://www.facebook.com/login.php',
	email = '',
	pass = '',
	filename = 'fb.png',
	CookieJar = "cookejar.json"

var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');
var pageResponses = {};
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
/*********SETTINGS END*****************/

console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
/**********COOKIE***********************/
/*
page.onResourceReceived = function(response) {
    pageResponses[response.url] = response.status;
    fs.write(CookieJar, JSON.stringify(phantom.cookies), "w");
};
if(fs.isFile(CookieJar))
    Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
        phantom.addCookie(x);
	});
*/
/**********COOKIE END***********************/

/**********DEFINE STEPS THAT FANTOM SHOULD DO***********************/

page.open(url, function(status) {

		if (status === "success") {
			page.onConsoleMessage = function(msg, lineNum, sourceId) {
			console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
		};

		page.evaluate(function() {
/*
			var title = document.title

			if(title == "") {	
				console.log('Page title is login, ' + title);
				phantom.exit();
			};
*/
			document.getElementById("email").value = '';
	      	document.getElementById("pass").value = '';
		  	document.getElementById("loginbutton").click();
	    });

	    setTimeout(function() {
			page.render(filename);
			phantom.exit();
			}, 5000);
		}
	
});
/**********END STEPS THAT FANTOM SHOULD DO***********************/

/**
 * These listeners are very important in order to phantom work properly. Using these listeners, we control loadInProgress marker which controls, weather a page is fully loaded.
 * Without this, we will get content of the page, even a page is not fully loaded.
 */
page.onLoadStarted = function() {
    loadInProgress = true;
    console.log('Loading started');
};
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log('Loading finished');
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
