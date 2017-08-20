const apiURL = 'http://api.password-rules.myrandomcode.com/site/';

function getCurrentTabHost(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        const tab = tabs[0];
        const host = new URL(tab.url).hostname;

        callback(host.indexOf('www.') >= 0 ? host.split('www.')[1] : host);
    })
}

function renderRules(data) {
    const name = document.getElementById('site_name');
    name.innerHTML = `Password Rules for ${data.site}`;
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabHost(function(host) {
        fetch(`${apiURL}${host}`, {mode: 'cors'})
        .then(function(response) {
            response.json().then(function(data) {
                renderRules(data[0]);
            })
        })
    })
})
