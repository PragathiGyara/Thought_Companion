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
        // SERIALIZE RANGE BEFORE DOM MODIFICATION
        // -------------------------------------------------

        const serializedRange =
            serializeRange(range);

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
        // SAVE HIGHLIGHT DATA
        // -------------------------------------------------

        saveHighlight(
            serializedRange
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

function highlightTextOnPage(
    highlightData
) {

    // -------------------------------------------------
    // TRY EXACT RANGE RESTORATION
    // -------------------------------------------------

    const range =
        deserializeRange(
            highlightData
        );

    if (!range) {

        console.log(
            "Range restoration failed"
        );

        return;
    }

    try {

        // -------------------------------------------------
        // CREATE HIGHLIGHT SPAN
        // -------------------------------------------------

        const span =
            document.createElement(
                "span"
            );

        span.className =
            "thought-highlight";

        span.dataset.highlightId =
            highlightData.id;

        // -------------------------------------------------
        // EXTRACT + WRAP CONTENT
        // -------------------------------------------------

        const extracted =
            range.extractContents();

        span.appendChild(
            extracted
        );

        range.insertNode(span);

    } catch (err) {

        console.log(
            "Restore failed:",
            err
        );
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
                        highlight
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