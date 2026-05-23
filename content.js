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

    toolbar.style.top = `${y}px`;
    toolbar.style.left = `${x}px`;

    document.body.appendChild(toolbar);

    console.log("Toolbar appended");

    toolbar.addEventListener("mousedown", (event) => {
        event.stopPropagation();
    });

    document
        .getElementById("highlight-btn")
        .addEventListener("click", () => {
            console.log("Highlight clicked");
        });

    document
        .getElementById("annotate-btn")
        .addEventListener("click", () => {
            console.log("Annotate clicked");
        });

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

document.addEventListener("mouseup", (event) => {
    console.log("Mouse up detected");

    const selection = window.getSelection().toString().trim();

    console.log("Selection:", selection);

    if (selection.length > 0) {
        console.log("Creating toolbar");
        createToolbar(event.pageX, event.pageY);
    } else {
        removeToolbar();
    }
});

document.addEventListener("mousedown", (event) => {
    if (
        toolbar &&
        !toolbar.contains(event.target)
    ) {
        removeToolbar();
    }
});