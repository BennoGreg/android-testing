let wd = require('wd');

userName = process.env.BROWSERSTACK_USERNAME
accessKey = process.env.BROWSERSTACK_ACCESS_KEY
app = process.env.BROWSERSTACK_APP_ID



const capabilities1 = {
    // Set your BrowserStack access credentials
    'browserstack.user' : userName,
    'browserstack.key' : accessKey,
    // Set app_url of the application under test
    'app' : app,
    // Specify device and os_version for testing
    'device' : 'Google Pixel 3',
    'os_version' : '9.0',
    // Set other BrowserStack capabilities
    'project' : 'CI Testing Project',
    'build' : 'browserstack-build-ci',
    'name': 'single_test Pixel 3'
}

async function runTestsWithCaps(desiredCaps) {
    // Initialize the remote Webdriver using BrowserStack remote URL
// and desired capabilities defined above
    driver = wd.promiseRemote("http://hub-cloud.browserstack.com/wd/hub");

    console.log("Username: " + userName)
    console.log("Accesskey: " + accessKey)
    console.log("App: " + app)
// Test case for the BrowserStack sample iOS app.
// If you have uploaded your app, update the test case here.
    driver.init(desiredCaps)
        //Write your custom code here
        .then(function (){
            return driver.element("id","add_task_fab")
        })
        .then(function (addTaskButton) {
            return addTaskButton.click()
        })
        .then( function () {
            return driver.element("id","add_task_title_edit_text").then( function (tf) {
                return tf.isDisplayed()
            }).then( function (isdDispayed) {
                return checkElementVisiblity(driver, isdDispayed, true, "Title Textfield")
            })
        })
        .then( function() {
            return driver.element("id", "add_task_description_edit_text").then( function (tf) {
                return tf.isDisplayed()
            }).then( function (isdDispayed) {
                return checkElementVisiblity(driver, isdDispayed, true, "Description Textfield")
            })
        })
        .fin(function() {
            // Invoke driver.quit() after the test is done to indicate that the test is completed.
            return driver.quit();
        })
        .done();
}

function checkElementVisiblity(driver ,actual, expected, element) {
    if (actual === expected) {
        return driver.execute(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "${element} is visible"}}`)
    } else {
        driver.execute(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "${element} is not visibile!"}}`);
    }
}

runTestsWithCaps(capabilities1)