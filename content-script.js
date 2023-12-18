let state = ""

// Listen for messages from the background script indicating
// the button was clicked.
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        //console.log(request.action);
        state = request.action
    }
);

// Get a value from synced storage given a key.
const getObjectFromSyncStorage = async function (key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(key, function (value) {
                resolve(value[key]);
            });
        } catch (ex) {
            reject(ex);
        }
    });
};

// Check the chat entry for blocked emotes.
function checkEmotes(addedNode, childElement) {
    if (childElement.outerText.split(':')[1].trim() == '') {
        for (let blockItem of blockList) {
            emoteText = "data-emote-name=\"" + blockItem + "\""
            if (childElement.innerHTML.includes(emoteText)) {
                //console.log("removing: " + blockItem)
                addedNode.parentNode.removeChild(addedNode)
                return
            }
        }
    }
}

// Check the chat entry for blocked text.
function checkText(addedNode, childElement) {
    for (let blockItem of blockList) {
        if (childElement.outerText.split(':')[1].trim() == blockItem) {
            //console.log("deleting: " + childElement.outerText)
            addedNode.parentNode.removeChild(addedNode)
            return
        }
    }
}

// Start observing DOM mutations for chat entries and remove blocked items.
async function start() {
    let observer = new MutationObserver(async mutations => {
        if (state == "OFF") {
            return
        }
        for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
                if (addedNode.nodeType == 1) {
                    for (let childNode of addedNode.childNodes) {
                        var childElement = childNode
                        const classes = childElement.classList
                        if (classes == null) {
                            continue
                        }
                        if (classes.contains("chat-entry")) {
                            if (childElement.outerText.includes(':')) {
                                checkEmotes(addedNode, childElement)
                                checkText(addedNode, childElement)
                            }
                        }
                    }
                }
            }
        }
    });
    observer.observe(document, { childList: true, subtree: true });
}

// Wrapped the bulk in a main function to apease the async/await gods.
async function main() {
    blockList = new Array();

    async function loadStorage() {
        stringList = await getObjectFromSyncStorage('stringList');
        if (stringList === '') {
            console.log("Kick Chat Cleaner: blocklist is empty")
        }
        for (let item of stringList.split(/\r?\n/)) {
            blockList.push(item)
        }
    }

    const result = await loadStorage();
    console.log("Kick Chat Cleaner blocklist = \n" + blockList);
    start();
}

main();