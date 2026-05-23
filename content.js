console.log("CONTENT JS LOADED");

let toolbar = null;

// ---------------- TOOLBAR ----------------

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

    toolbar.style.position =
        "absolute";

    toolbar.style.top =
        `${y}px`;

    toolbar.style.left =
        `${x}px`;

    document.body.appendChild(
        toolbar
    );

    // Prevent losing selection
    toolbar.addEventListener(
        "mousedown",
        (event) => {

            event.preventDefault();
            event.stopPropagation();

        }
    );

    // ---------------- HIGHLIGHT ----------------

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

    // ---------------- ANNOTATE ----------------

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

    // ---------------- REVIEW ----------------

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

// ---------------- REMOVE TOOLBAR ----------------

function removeToolbar() {

    if (toolbar) {

        toolbar.remove();

        toolbar = null;
    }
}

// ---------------- TEXT SELECTION ----------------

document.addEventListener(
    "mouseup",
    (event) => {

        if (
            toolbar &&
            toolbar.contains(
                event.target
            )
        ) {
            return;
        }

        const selection =
            window
                .getSelection()
                .toString()
                .trim();

        if (
            selection.length > 0
        ) {

            createToolbar(
                event.pageX,
                event.pageY
            );

        } else {

            removeToolbar();

        }
    }
);

// ---------------- OUTSIDE CLICK ----------------

document.addEventListener(
    "mousedown",
    (event) => {

        if (
            toolbar &&
            !toolbar.contains(
                event.target
            )
        ) {

            removeToolbar();

        }
    }
);