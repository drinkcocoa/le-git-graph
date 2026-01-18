// Checks if the page has been opened by the FRE initialiseer in serviceWorker.js
var url = window.location.href;
if (url.indexOf("?") > -1) {
    var params = url.split("?")[1].split("&");
    var paramsObj = {};
    for (var i = 0; i < params.length; i++) {
        var param = params[i].split("=");
        paramsObj[param[0]] = param[1];
    }
    if (paramsObj['fre'] == "true") {
        if (paramsObj['reason'] == "install") {
            waitForCommitsTabAndRun(function() {
                installFre(paramsObj["resume"]);
            });
        }
        else if (paramsObj['reason'] == "update") {
            waitForCommitsTabAndRun(function() {
                updateFre(paramsObj["resume"]);
            });
        }
    }
    else if (paramsObj['page'] == "commits") {
        waitForCommitsTabAndRun(openCommitsTab);
    }
}

// Wait for the commits tab to be added before running FRE
function waitForCommitsTabAndRun(callback) {
    var checkInterval = setInterval(function() {
        var commitsTab = document.getElementById('commits-tab');
        if (commitsTab) {
            clearInterval(checkInterval);
            callback();
        }
    }, 100);

    // Timeout after 10 seconds to prevent infinite waiting
    setTimeout(function() {
        clearInterval(checkInterval);
        console.error('[Le Git Graph] Timed out waiting for commits tab');
    }, 10000);
}