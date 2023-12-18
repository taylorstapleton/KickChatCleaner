# KickChatCleaner
A chrome extension that filters chat messages on kick.com for text or emotes set by the user in the extension options menu.

The files in this directory directly match those I [uploaded to the chrome web store](https://chromewebstore.google.com/detail/kick-chat-cleaner/nkpchhnmenbncfofheegmabpgcickkob). A motivated user could check this via checksum. Alternatively, the code here could be downloaded directly fom github and installed via chrome developer mode [instructions here](https://bashvlas.com/blog/install-chrome-extension-in-developer-mode/).

## Description of each file

### background.js
Listens for clicks to the chrome extension button and sends the message to content-script.js.

### options.js
Reads and writes the options list to Chrome storage so that the extension remembers the blocklist of chat/emote messages.

### content-script.js
Listens for mutations (changes) to kick.com pages and checks whether the changes are newly added chat messages. It then examines the chat message and checks it against the list of options set by the user. If it matches any item in the list, the message is removed from the page.

### options.html
Defines a simple layout for the extension options menu.

### manifest.json
Defines the metadata for the extension for the Chrome Extension Store. There are two notable parts with respect to user security:
 - The only requested permission is "storage" which allows the extension to store the user's list of options. This helps guarantee the extension does not have the ability to make network requests and send information.
 - The "matches" section indicates that the only pages on which this extension operate are kick.com URLs. Meaning, no part of the extension is active on any other web page.
