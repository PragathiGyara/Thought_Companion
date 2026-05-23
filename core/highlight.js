console.log("HIGHLIGHT JS LOADED");

// =====================================================
// APPLY HIGHLIGHT
// =====================================================

function applyHighlight(range) {

    if (range.collapsed) {
        return;
    }

    try {

        // -------------------------------------------------
        // EXTRACT SELECTED CONTENT
        // -------------------------------------------------

        const extractedContents =
            range.extractContents();

        // -------------------------------------------------
        // CREATE HIGHLIGHT SPAN
        // -------------------------------------------------

        const span =
            document.createElement(
                "span"
            );

        span.className =
            "thought-highlight";

        span.appendChild(
            extractedContents
        );

        // -------------------------------------------------
        // INSERT HIGHLIGHT
        // -------------------------------------------------

        range.insertNode(span);

        // -------------------------------------------------
        // SAVE HIGHLIGHT
        // -------------------------------------------------

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

// =====================================================
// RESTORE SINGLE HIGHLIGHT
// =====================================================

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

        if (!parent) {
            continue;
        }

        // -------------------------------------------------
        // SKIP INVALID NODES
        // -------------------------------------------------

        if (
            ["SCRIPT", "STYLE", "NOSCRIPT"]
                .includes(parent.tagName)
        ) {
            continue;
        }

        // -------------------------------------------------
        // PREVENT NESTED HIGHLIGHTS
        // -------------------------------------------------

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

        // -------------------------------------------------
        // MATCH FOUND
        // -------------------------------------------------

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

// =====================================================
// RESTORE ALL HIGHLIGHTS
// =====================================================

function restoreHighlights() {

    getPageHighlights(
        (pageHighlights) => {

            pageHighlights.forEach(
                (highlight) => {

                    highlightTextOnPage(
                        highlight.text
                    );

                }
            );
        }
    );
}

// =====================================================
// AUTO RESTORE
// =====================================================

window.addEventListener(
    "load",
    () => {

        restoreHighlights();

    }
);