console.log("PANEL JS LOADED");

// =====================================================
// PANEL STATE
// =====================================================

let thoughtPanel = null;

let thoughtPanelCollapsed = true;

// =====================================================
// CREATE PANEL
// =====================================================

function createThoughtPanel() {

    if (thoughtPanel) {

        return;

    }

    thoughtPanel =
        document.createElement(
            "div"
        );

    thoughtPanel.id =
        "thought-panel";

    thoughtPanel.classList.add(
        "collapsed"
    );

    thoughtPanel.innerHTML = `

        <div id="thought-panel-tab">

            💭

        </div>

        <div id="thought-panel-content">

            <div class="thought-panel-header">

                Thought Companion

            </div>

            <div class="thought-section">

                <div
                    class="thought-section-header"
                    data-target="highlight-section"
                >

                    ▼ Highlights

                </div>

                <div
                    id="highlight-section"
                    class="thought-section-content"
                >

                </div>

            </div>

            <div class="thought-section">

                <div
                    class="thought-section-header"
                    data-target="annotation-section"
                >

                    ▼ Annotations

                </div>

                <div
                    id="annotation-section"
                    class="thought-section-content"
                >

                </div>

            </div>

            <div class="thought-section">

                <div
                    class="thought-section-header"
                    data-target="review-section"
                >

                    ▼ Marked for Review

                </div>

                <div
                    id="review-section"
                    class="thought-section-content"
                >

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(
        thoughtPanel
    );

    document
        .getElementById(
            "thought-panel-tab"
        )
        .addEventListener(
            "click",
            toggleThoughtPanel
        );

    document

        .querySelectorAll(
            ".thought-section-header"
        )

        .forEach(

            (header) => {

                header.addEventListener(

                    "click",

                    () => {

                        const section =
                            document.getElementById(

                                header.dataset.target

                            );

                        section.classList.toggle(

                            "collapsed"

                        );

                    }

                );

            }

        );

}

// =====================================================
// TOGGLE PANEL
// =====================================================

function toggleThoughtPanel() {

    thoughtPanelCollapsed =
        !thoughtPanelCollapsed;

    if (
        thoughtPanelCollapsed
    ) {

        thoughtPanel.classList.add(
            "collapsed"
        );

    }

    else {

        thoughtPanel.classList.remove(
            "collapsed"
        );

    }

}

// =====================================================
// UPDATE PANEL
// =====================================================

function updateThoughtPanel() {

    getPageAnnotations(

        (annotations) => {

            const highlights =
                annotations.filter(
                    annotation =>
                        annotation.highlight
                );

            const notes =
                annotations.filter(
                    annotation =>
                        annotation.note &&
                        annotation.note.trim() !== ""
                );

            const review =
                annotations.filter(
                    annotation =>
                        annotation.review
                );

            // ---------------------------------------------
            // UPDATE COUNTS
            // ---------------------------------------------

            document.querySelector(
                '[data-target="highlight-section"]'
            ).textContent =
                `▼ Highlights (${highlights.length})`;

            document.querySelector(
                '[data-target="annotation-section"]'
            ).textContent =
                `▼ Annotations (${notes.length})`;

            document.querySelector(
                '[data-target="review-section"]'
            ).textContent =
                `▼ Marked for Review (${review.length})`;

            // ---------------------------------------------
            // GET SECTION CONTAINERS
            // ---------------------------------------------

            const highlightContainer =
                document.getElementById(
                    "highlight-section"
                );

            const annotationContainer =
                document.getElementById(
                    "annotation-section"
                );

            const reviewContainer =
                document.getElementById(
                    "review-section"
                );

            highlightContainer.innerHTML = "";
            annotationContainer.innerHTML = "";
            reviewContainer.innerHTML = "";

            // ---------------------------------------------
            // RENDER HIGHLIGHTS
            // ---------------------------------------------

            highlights.forEach(

                (annotation) => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "thought-item";

                    item.dataset.annotationId =
                        annotation.id;

                    item.textContent =
                        annotation.text;

                    highlightContainer.appendChild(
                        item
                    );

                }

            );

            // ---------------------------------------------
            // RENDER NOTES
            // ---------------------------------------------

            notes.forEach(

                (annotation) => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "thought-item";

                    item.dataset.annotationId =
                        annotation.id;

                    item.innerHTML = `

                        <div class="thought-item-text">

                            ${annotation.text}

                        </div>

                        <div class="thought-item-note">

                            ${annotation.note}

                        </div>

                    `;

                    annotationContainer.appendChild(
                        item
                    );

                }

            );

            // ---------------------------------------------
            // RENDER REVIEW
            // ---------------------------------------------

            review.forEach(

                (annotation) => {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "thought-item";

                    item.dataset.annotationId =
                        annotation.id;

                    item.textContent =
                        annotation.text;

                    reviewContainer.appendChild(
                        item
                    );

                }

            );

        }

    );

}

// =====================================================
// AUTO REFRESH PANEL
// =====================================================

window.addEventListener(

    "thought-companion-updated",

    () => {

        updateThoughtPanel();

    }

);