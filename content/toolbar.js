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

    toolbar.innerHTML = `
        <button id="highlight-btn">
            Highlight
        </button>

        <button id="annotate-btn">
            Annotate
        </button>

        <button id="review-btn">
            Review
        </button>
    `;

    // -------------------------------------------------
    // POSITION TOOLBAR
    // -------------------------------------------------

    toolbar.style.top =
        `${y}px`;

    toolbar.style.left =
        `${x}px`;

    document.body.appendChild(
        toolbar
    );

    // -------------------------------------------------
    // PREVENT SELECTION LOSS
    // -------------------------------------------------

    toolbar.addEventListener(
        "mousedown",
        (event) => {

            event.preventDefault();
            event.stopPropagation();

        }
    );

    // -------------------------------------------------
    // HIGHLIGHT BUTTON
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
                    selection.getRangeAt(0);

                applyHighlight(range);

                selection.removeAllRanges();

                removeToolbar();
            }
        );

    // -------------------------------------------------
    // ANNOTATE BUTTON
    // -------------------------------------------------

    document
        .getElementById(
            "annotate-btn"
        )
        .addEventListener(
            "click",
            () => {

                console.log(
                    "Annotate clicked"
                );

            }
        );

    // -------------------------------------------------
    // REVIEW BUTTON
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