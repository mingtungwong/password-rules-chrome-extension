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

function renderRules(host, data) {
    const name = document.getElementById('site_name');
    const list = document.getElementById('rules');
    if(data) {
        name.innerHTML = `Password Rules for ${data.site}`;
        const ruleStrings = data.rules.map(rulesToTextMapper);
        for(let string of ruleStrings) {
            let li = document.createElement('li');
            li.innerHTML = string;
            list.appendChild(li);
        }
    }
    else {
        name.innerHTML = `No entry found for ${host}`;
        const link = document.getElementById('add_rules_link');
        link.innerHTML = `You can add the entry for <b><i>${host}</i></b> <a href="http://password-rules.myrandomcode.com/#/addsite/${host}" target="_blank">here</a>`;
    }
}

function setAppDetails() {
    const header = document.getElementById('app_name_version');
    const manifest = chrome.runtime.getManifest();
    header.innerHTML = `${manifest.name} version ${manifest.version}`;
}

function rulesToTextMapper(rule) {
    switch(rule.rule) {
        case 'Range':
            return `Between ${rule.quantity[0]} and ${rule.quantity[1]} ${rule.category}`;
            break;
        case 'Minimum':
            return `At least ${rule.quantity[0]} ${rule.category}`;
            break;
        case 'Maximum':
            return `At most ${rule.quantity[0]} ${rule.category}`;
            break;
        case 'No':
            return `No ${rule.category}`;
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setAppDetails();
    getCurrentTabHost(function(host) {
        fetch(`${apiURL}${host}`, {mode: 'cors'})
        .then(function(response) {
            response.json().then(function(data) {
                renderRules(host, data[0]);
            })
        })
    })
})
