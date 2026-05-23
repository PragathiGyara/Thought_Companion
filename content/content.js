console.log("CONTENT JS LOADED");

// =====================================================
// TEXT SELECTION HANDLER
// =====================================================

document.addEventListener(
    "mouseup",
    (event) => {

        // -------------------------------------------------
        // IGNORE CLICKS INSIDE TOOLBAR
        // -------------------------------------------------

        if (
            toolbar &&
            toolbar.contains(
                event.target
            )
        ) {
            return;
        }

        // -------------------------------------------------
        // GET CURRENT SELECTION
        // -------------------------------------------------

        const selection =
            window
                .getSelection()
                .toString()
                .trim();

        // -------------------------------------------------
        // SHOW TOOLBAR IF TEXT SELECTED
        // -------------------------------------------------

        if (
            selection.length > 0
        ) {

            createToolbar(
                event.pageX,
                event.pageY
            );

        }

        // -------------------------------------------------
        // OTHERWISE REMOVE TOOLBAR
        // -------------------------------------------------

        else {

            removeToolbar();

        }
    }
);

// =====================================================
// OUTSIDE CLICK HANDLER
// =====================================================

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