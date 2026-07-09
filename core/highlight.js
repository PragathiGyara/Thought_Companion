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
        // CREATE HIGHLIGHT SPAN
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
        // SAVE AS AN ANNOTATION
        // -------------------------------------------------

        const saved =
            await saveAnnotation({

                ...serializedRange,

                highlight: true
            });

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
    annotation
) {

    // -------------------------------------------------
    // ONLY RESTORE HIGHLIGHTS
    // -------------------------------------------------

    if (
        !annotation.highlight
    ) {

        return true;
    }

    // -------------------------------------------------
    // TRY EXACT RANGE RESTORATION
    // -------------------------------------------------

    const range =
        deserializeRange(
            annotation
        );

    if (!range) {

        console.log(
            "Range restoration failed"
        );

        return false;
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

        span.dataset.annotationId =
            annotation.id;

        // -------------------------------------------------
        // WRAP CONTENT
        // -------------------------------------------------

        range.surroundContents(
            span
        );

        return true;

    } catch (err) {

        console.log(
            "Restore failed:",
            err
        );

        return false;
    }
}

// =====================================================
// RESTORE ALL HIGHLIGHTS
// =====================================================

function restoreHighlights() {

    getPageAnnotations(

        (pageAnnotations) => {

            let failedCount = 0;

            pageAnnotations

                .filter(

                    annotation =>

                        annotation.highlight

                )

                .forEach(

                    (annotation) => {

                        try {

                            const success =
                                highlightTextOnPage(
                                    annotation
                                );

                            if (
                                success === false
                            ) {

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

            if (

                failedCount > 0

            ) {

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
        createThoughtPanel();

        restoreHighlights();

    }
);