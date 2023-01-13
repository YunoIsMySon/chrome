// Create an array to store the last 3 items saved to the clipboard
let clipboardItems = [];

// Add an event listener to the document that listens for the "copy" event
document.addEventListener("copy", (event) => {
    // Get the text that was copied
    const copiedText = event.clipboardData.getData("text");
    // If the copied text is not empty
    if (copiedText.trim() !== "") {
        // Add the copied text to the array
        clipboardItems.unshift(copiedText);
        // If there are already 3 items in the array
        if (clipboardItems.length > 3) {
            // Remove the last item from the array
            clipboardItems.pop();
        }
        //Encrypt the data before storing it in chrome.storage
        let iv = window.crypto.getRandomValues(new Uint8Array(12));
        let key = window.crypto.getRandomValues(new Uint8Array(32));
        let alg = { name: "AES-GCM", iv: iv };
        let enc = new TextEncoder();
        let encodedData = enc.encode(clipboardItems);
        window.crypto.subtle.encrypt(alg, key, encodedData)
            .then(encrypted => {
                chrome.storage.local.set({ clipboardItems: encrypted, iv, key }, function () {
                    console.log("Value is set to " + encrypted);
                });
            })
            .catch(error => {
                console.log("Encryption Error: ", error);
            });
    }
});
