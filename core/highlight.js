console.log("HIGHLIGHT JS LOADED");

// =====================================================
// APPLY HIGHLIGHT
// =====================================================

async function applyHighlight(range) {
    if (!isSafeRange(range)) {
        showToast(
            "Complex highlights are not supported yet",
            "error"
        );
        return;
    }
    if (range.collapsed) {
        return;
    }
    let span = null;
    try {
        // -------------------------------------------------
        // SERIALIZE RANGE BEFORE DOM CHANGES
        // -------------------------------------------------
        const serializedRange =
            serializeRange(range);
        // -------------------------------------------------
        // EXTRACT CONTENT
        // -------------------------------------------------
        span =
            document.createElement(
                "span"
            );

        span.className =
            "thought-highlight";

        try {

            range.surroundContents(
                span
            );

        } catch (err) {

            console.error(
                "surroundContents failed:",
                err
            );

            showToast(

                "Could not create highlight",

                "error"
            );

            return;
        }

        // -------------------------------------------------
        // SAVE AFTER DOM INSERTION
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

        // -------------------------------------------------
        // ROLLBACK FAILED INSERTION
        // -------------------------------------------------

        if (span) {

            const parent =
                span.parentNode;

            while (
                span.firstChild
            ) {

                parent.insertBefore(
                    span.firstChild,
                    span
                );
            }

            span.remove();
        }

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

        range.surroundContents(
            span
        );
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