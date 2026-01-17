// The first thing that the extension should do is add a 'commits' button.
// Everything else happens only if the user clicks on it.

// Hence every other function/service is called only if the user clicks on the button.

// The commits button is to be added on all repositories.
// Trying to filter out github's reserved pages, like login. (Veryyyy incomplete. Github has many more URLs.)

var pathsToExclude = ["login", "oauth", "authorize"];
var windowUrlLink = window.location.href;
var windowUrl = new URL(windowUrlLink);
var windowPath = windowUrl.pathname;
var windowPathArray = windowPath.split("/");

if (pathsToExclude.includes(windowPathArray[1]) == false) {
    // Initial attempt to add button
    addCommitsButton();

    // GitHub uses Turbo for dynamic page rendering, which can remove our button.
    // Listen for Turbo events and re-add the button when necessary.
    document.addEventListener('turbo:load', function() {
        console.log('[Le Git Graph] Turbo load event detected, re-adding Commits tab');
        setTimeout(addCommitsButton, 100);
    });

    document.addEventListener('turbo:render', function() {
        console.log('[Le Git Graph] Turbo render event detected, re-adding Commits tab');
        setTimeout(addCommitsButton, 100);
    });

    document.addEventListener('turbo:frame-load', function() {
        console.log('[Le Git Graph] Turbo frame-load event detected, re-adding Commits tab');
        setTimeout(addCommitsButton, 100);
    });

    // MutationObserver to detect when the navigation bar is re-rendered
    // and our Commits tab is removed
    var observer = new MutationObserver(function(mutations) {
        // Check if Commits tab still exists
        var commitsTab = document.getElementById('commits-tab');
        if (!commitsTab) {
            console.log('[Le Git Graph] Commits tab removed, re-adding...');
            addCommitsButton();
        }
    });

    // Start observing the document body for DOM changes
    // We use a timeout to ensure the page is fully loaded before starting observation
    setTimeout(function() {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('[Le Git Graph] MutationObserver started watching for navigation changes');
    }, 500);
}