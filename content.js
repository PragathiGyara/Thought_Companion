console.log("CONTENT JS LOADED");

let toolbar = null;

function createToolbar(x, y) {
    console.log("Toolbar function called");

    removeToolbar();

    toolbar = document.createElement("div");
    toolbar.id = "thought-companion-toolbar";

    toolbar.innerHTML = `
        <button id="highlight-btn">Highlight</button>
        <button id="annotate-btn">Annotate</button>
        <button id="review-btn">Review</button>
    `;

    toolbar.style.position = "absolute";
    toolbar.style.top = `${y}px`;
    toolbar.style.left = `${x}px`;

    document.body.appendChild(toolbar);

    console.log("Toolbar appended");

    // Prevent toolbar clicks from affecting selection
    toolbar.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();
    });

    // ---------------- HIGHLIGHT ----------------

    document
        .getElementById("highlight-btn")
        .addEventListener("click", () => {

            console.log("Highlight clicked");

            const selection = window.getSelection();

            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);

            if (range.collapsed) return;

            try {

                // Extract selected contents
                const extractedContents = range.extractContents();

                // Create highlight wrapper
                const span = document.createElement("span");

                span.className = "thought-highlight";

                // Put extracted content inside span
                span.appendChild(extractedContents);

                // Insert back into DOM
                range.insertNode(span);

                // Clear selection
                selection.removeAllRanges();

                removeToolbar();

                console.log("Highlighted!");

            } catch (err) {

                console.error("Highlight failed:", err);

            }
        });

    // ---------------- ANNOTATE ----------------

    document
        .getElementById("annotate-btn")
        .addEventListener("click", () => {
            console.log("Annotate clicked");
        });

    // ---------------- REVIEW ----------------

    document
        .getElementById("review-btn")
        .addEventListener("click", () => {
            console.log("Review clicked");
        });
}

function removeToolbar() {
    if (toolbar) {
        toolbar.remove();
        toolbar = null;
    }
}

// ---------------- TEXT SELECTION ----------------

document.addEventListener("mouseup", (event) => {

    // Ignore mouseup inside toolbar
    if (toolbar && toolbar.contains(event.target)) {
        return;
    }

    console.log("Mouse up detected");

    const selection = window
        .getSelection()
        .toString()
        .trim();

    console.log("Selection:", selection);

    if (selection.length > 0) {

        console.log("Creating toolbar");

        createToolbar(event.pageX, event.pageY);

    } else {

        removeToolbar();

    }
});

// ---------------- OUTSIDE CLICK ----------------

document.addEventListener("mousedown", (event) => {

    if (
        toolbar &&
        !toolbar.contains(event.target)
    ) {
        removeToolbar();
    }
});