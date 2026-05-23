console.log("HIGHLIGHT JS LOADED");

// =====================================================
// APPLY HIGHLIGHT
// =====================================================

async function applyHighlight(
    range
) {

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
        // EXTRACT CONTENT
        // -------------------------------------------------

        const extractedContents =
            range.extractContents();

        // -------------------------------------------------
        // CREATE SPAN
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

        const saved =
            await saveHighlight(
                serializedRange
            );

        // -------------------------------------------------
        // HANDLE STORAGE FAILURE
        // -------------------------------------------------

        if (!saved) {

            showToast(

                "Highlight created but could not be saved",

                "error"
            );

            console.error(
                "Storage save failed"
            );
        }

    } catch (err) {

        console.error(
            "Highlight failed:",
            err
        );

        showToast(

            "Could not create highlight",

            "error"
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

// =====================================================
// RESTORE ALL HIGHLIGHTS
// =====================================================

function restoreHighlights() {

    getPageHighlights(
        (pageHighlights) => {

            let failedCount = 0;

            pageHighlights.forEach(
                (highlight) => {

                    try {

                        const success =
                            highlightTextOnPage(
                                highlight
                            );

                        if (!success) {

                            failedCount++;
                        }

                    } catch (err) {

                        failedCount++;
                    }
                }
            );

            // ---------------------------------------------
            // SHOW SINGLE FAILURE TOAST
            // ---------------------------------------------

            if (failedCount > 0) {

                showToast(

                    `${failedCount} highlight(s) could not be restored`,

                    "error"
                );
            }
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