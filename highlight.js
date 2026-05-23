console.log("HIGHLIGHT JS LOADED");

// ---------------- SAVE ----------------

function saveHighlight(text) {

    const pageUrl = window.location.href;

    chrome.storage.local.get(
        ["highlights"],
        (result) => {

            const highlights =
                result.highlights || [];

            const alreadyExists =
                highlights.some(
                    h =>
                        h.url === pageUrl &&
                        h.text === text
                );

            if (!alreadyExists) {

                highlights.push({
                    url: pageUrl,
                    text: text
                });

                chrome.storage.local.set({
                    highlights: highlights
                });

                console.log(
                    "Highlight saved!"
                );
            }
        }
    );
}

// ---------------- CREATE HIGHLIGHT ----------------

function applyHighlight(range) {

    if (range.collapsed) return;

    try {

        const extractedContents =
            range.extractContents();

        const span =
            document.createElement("span");

        span.className =
            "thought-highlight";

        span.appendChild(
            extractedContents
        );

        range.insertNode(span);

        saveHighlight(
            span.textContent
        );

        console.log(
            "Highlighted!"
        );

    } catch (err) {

        console.error(
            "Highlight failed:",
            err
        );
    }
}

// ---------------- RESTORE SINGLE ----------------

function highlightTextOnPage(text) {

    const walker =
        document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

    while (walker.nextNode()) {

        const node =
            walker.currentNode;

        const parent =
            node.parentElement;

        if (!parent) continue;

        // Skip scripts/styles
        if (
            ["SCRIPT", "STYLE", "NOSCRIPT"]
                .includes(parent.tagName)
        ) {
            continue;
        }

        // Avoid nested highlights
        if (
            parent.closest(
                ".thought-highlight"
            )
        ) {
            continue;
        }

        const nodeText =
            node.nodeValue;

        const index =
            nodeText.indexOf(text);

        if (index !== -1) {

            const range =
                document.createRange();

            range.setStart(
                node,
                index
            );

            range.setEnd(
                node,
                index + text.length
            );

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "thought-highlight";

            try {

                const extracted =
                    range.extractContents();

                span.appendChild(
                    extracted
                );

                range.insertNode(span);

            } catch (err) {

                console.log(
                    "Restore failed"
                );
            }

            break;
        }
    }
}

// ---------------- RESTORE ALL ----------------

function restoreHighlights() {

    const pageUrl =
        window.location.href;

    chrome.storage.local.get(
        ["highlights"],
        (result) => {

            const highlights =
                result.highlights || [];

            const pageHighlights =
                highlights.filter(
                    h => h.url === pageUrl
                );

            pageHighlights.forEach(h => {

                highlightTextOnPage(
                    h.text
                );

            });
        }
    );
}

// ---------------- AUTO RESTORE ----------------

window.addEventListener(
    "load",
    () => {

        restoreHighlights();

    }
);