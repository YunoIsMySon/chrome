document.addEventListener("DOMContentLoaded", function () {
    // Get the list element
    const list = document.getElementById("clipboard-items");
    const clearBtn = document.getElementById("clear-items");

    chrome.storage.local.get(["clipboardItems", "decryptionKey", "decryptionIv"], function (result) {
        if (result.clipboardItems) {
            decryptData(result.clipboardItems, result.decryptionKey, result.decryptionIv)
                .then(decryptedClipboardItems => {
                    for (let i = 0; i < decryptedClipboardItems.length; i++) {
                        list.children[i].textContent = decryptedClipboardItems[i];
                    }
                });
        } else {
            for (let i = 0; i < 3; i++) {
                list.children[i].textContent = "-";
            }
        }
    });

    clearBtn.addEventListener("click", function() {
        chrome.storage.local.remove("clipboardItems", function() {
            console.log("clipboardItems removed");
            for (let i = 0; i < 3; i++) {
                list.children[i].textContent = "No items copied yet";
            }
        });
    });
});

function decryptData(data, decryptionKey, decryptionIv) {
    return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: decryptionIv }, decryptionKey, data)
        .then(decrypted => new TextDecoder().decode(new Uint8Array(decrypted)))
        .catch(error => {
            console.log("Decryption Error: ", error);
        });
}
