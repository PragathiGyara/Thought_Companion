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

                <div class="thought-section-header">

                    ▼ Highlights

                </div>

                <div
                    id="highlight-section"
                    class="thought-section-content"
                >

                </div>

            </div>

            <div class="thought-section">

                <div class="thought-section-header">

                    ▼ Annotations

                </div>

                <div
                    id="annotation-section"
                    class="thought-section-content"
                >

                </div>

            </div>

            <div class="thought-section">

                <div class="thought-section-header">

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