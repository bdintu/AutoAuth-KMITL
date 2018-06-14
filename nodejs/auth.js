/*********SETTINGS*********************/
var user = '',
    pass = '',
    filename = 'img.png',
    CookieJar = "cookejar.json"

var fs = require('fs');
var pageResponses = {};
var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;

phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
/*********SETTINGS END*****************/

//console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
//    console.log(msg);
};
/**********COOKIE***********************/

page.onResourceReceived = function(response) {
    pageResponses[response.url] = response.status;
    fs.write(CookieJar, JSON.stringify(phantom.cookies), "w");
};

if(fs.isFile(CookieJar))
    Array.prototype.forEach.call(JSON.parse(fs.read(CookieJar)), function(x){
        phantom.addCookie(x);
	});

/**********COOKIE END***********************/

/**********DEFINE STEPS THAT FANTOM SHOULD DO***********************/

var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
console.log(formatted);

var page_detect = require('webpage').create();
var url = 'http://detectportal.firefox.com/success.txt';
page_detect.open(url, function(status) {
	page_detect.render('check.png');
    if (page_detect.plainText === 'success\n') {
		console.log('\tconnect ok');
		phantom.exit();
	}

	console.log('\tconnect failed');
});

var url = 'https://mylogin.kmitl.ac.th:8445/PortalServer/customize/1498718975450/pc/auth.jsp';
page.open(url, function(status) {
    if (status === "success") {
        page.onConsoleMessage = function(msg, lineNum, sourceId) {
            //console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
        };

        page.evaluate(function() {
	  document.getElementById('username').classList.remove('input-empty');
          document.getElementById('username').value = '';
          document.getElementById('password').classList.remove('input-empty');
          document.getElementById('password').value = '';
          document.getElementById('loginBtn').click();
	  console.log('\tauth kmitl ok');
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
//    console.log('Loading started');
};

page.onLoadFinished = function() {
    loadInProgress = false;
//    console.log('Loading finished');
};

page.onConsoleMessage = function(msg) {
//    console.log(msg);
};
