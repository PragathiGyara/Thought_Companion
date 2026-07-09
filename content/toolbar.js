console.log("TOOLBAR JS LOADED");

// =====================================================
// TOOLBAR STATE
// =====================================================

let toolbar = null;

// =====================================================
// CREATE TOOLBAR
// =====================================================

function createToolbar(x, y) {

    removeToolbar();

    toolbar =
        document.createElement("div");

    toolbar.id =
        "thought-companion-toolbar";

    toolbar.style.top =
        `${y}px`;

    toolbar.style.left =
        `${x}px`;

    toolbar.innerHTML = `
        <div id="toolbar-actions">

            <button id="highlight-btn">
                Highlight
            </button>

            <button id="annotate-btn">
                Annotate
            </button>

            <button id="review-btn">
                Review
            </button>

        </div>
    `;

    document.body.appendChild(
        toolbar
    );

    // -------------------------------------------------
    // PREVENT SELECTION LOSS
    // -------------------------------------------------

    toolbar.addEventListener(
        "mousedown",
        (event) => {

            // ---------------------------------------------
            // ALLOW TEXT INPUTS TO RECEIVE FOCUS
            // ---------------------------------------------

            if (

                event.target.closest(
                    "textarea"
                ) ||

                event.target.closest(
                    "input"
                )

            ) {

                event.stopPropagation();

                return;

            }

            // ---------------------------------------------
            // PREVENT TEXT SELECTION LOSS
            // ---------------------------------------------

            event.preventDefault();

            event.stopPropagation();

        }
    );

    // -------------------------------------------------
    // HIGHLIGHT
    // -------------------------------------------------

    document
        .getElementById(
            "highlight-btn"
        )
        .addEventListener(
            "click",
            () => {

                const selection =
                    window.getSelection();

                if (
                    !selection.rangeCount
                ) {

                    return;

                }

                const range =
                    selection.getRangeAt(
                        0
                    );

                applyHighlight(
                    range
                );

                selection.removeAllRanges();

                removeToolbar();

            }
        );

    // -------------------------------------------------
    // ANNOTATE
    // -------------------------------------------------

    document
        .getElementById(
            "annotate-btn"
        )
        .addEventListener(
            "click",
            () => {

                toolbar.innerHTML = `

                    <textarea
                        id="annotation-text"
                        placeholder="Write a note..."
                    ></textarea>

                    <div id="annotation-actions">

                        <button id="save-annotation-btn">
                            Save
                        </button>

                        <button id="cancel-annotation-btn">
                            Cancel
                        </button>

                    </div>

                `;

                document
                    .getElementById(
                        "save-annotation-btn"
                    )
                    .addEventListener(
                        "click",
                        async () => {

                            const selection =
                                window.getSelection();

                            if (
                                !selection.rangeCount
                            ) {

                                removeToolbar();

                                return;

                            }

                            const note =
                                document
                                    .getElementById(
                                        "annotation-text"
                                    )
                                    .value
                                    .trim();

                            if (
                                note.length === 0
                            ) {

                                showToast(
                                    "Annotation cannot be empty",
                                    "error"
                                );

                                return;

                            }

                            const range =
                                selection.getRangeAt(
                                    0
                                );

                            const serializedRange =
                                serializeRange(
                                    range
                                );

                            const saved =
                                await saveAnnotation({

                                    ...serializedRange,

                                    highlight:
                                        false,

                                    note,

                                    review:
                                        false

                                });

                            if (
                                saved
                            ) {

                                showToast(
                                    "Annotation saved",
                                    "success"
                                );

                            } else {

                                showToast(
                                    "Could not save annotation",
                                    "error"
                                );

                            }

                            selection.removeAllRanges();

                            removeToolbar();

                        }
                    );

                document
                    .getElementById(
                        "cancel-annotation-btn"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            removeToolbar();

                        }
                    );

            }
        );

    // -------------------------------------------------
    // REVIEW
    // -------------------------------------------------

    document
        .getElementById(
            "review-btn"
        )
        .addEventListener(
            "click",
            () => {

                console.log(
                    "Review clicked"
                );

            }
        );

}

// =====================================================
// REMOVE TOOLBAR
// =====================================================

function removeToolbar() {

    if (toolbar) {

        toolbar.remove();

        toolbar = null;
    }
}