console.log("HIGHLIGHT JS LOADED");

// =====================================================
// HIGHLIGHT STATE
// =====================================================

let highlightsLoaded = false;


// =====================================================
// WRAP RANGE ACROSS MULTIPLE TEXT NODES
// =====================================================

function wrapRange(
    range,
    annotationId = ""
) {

    // -------------------------------------------------
    // COLLECT TEXT NODES FIRST
    // -------------------------------------------------

    const walker =
        document.createTreeWalker(

            range.commonAncestorContainer,

            NodeFilter.SHOW_TEXT

        );

    const textNodes = [];

    let node;

    while (
        (node = walker.nextNode())
    ) {

        if (
            range.intersectsNode(node)
        ) {

            textNodes.push(node);

        }

    }

    // -------------------------------------------------
    // WRAP EACH TEXT NODE
    // -------------------------------------------------

    textNodes.forEach(

        (textNode) => {

            const nodeRange =
                document.createRange();

            let start = 0;

            let end =
                textNode.length;

            if (
                textNode ===
                range.startContainer
            ) {

                start =
                    range.startOffset;

            }

            if (
                textNode ===
                range.endContainer
            ) {

                end =
                    range.endOffset;

            }

            if (
                start === end
            ) {

                return;

            }

            nodeRange.setStart(
                textNode,
                start
            );

            nodeRange.setEnd(
                textNode,
                end
            );

            const span =
                document.createElement(
                    "span"
                );

            span.className =
                "thought-highlight";

            if (
                annotationId
            ) {

                span.dataset.annotationId =
                    annotationId;

            }

            nodeRange.surroundContents(
                span
            );

        }

    );

}



// =====================================================
// APPLY HIGHLIGHT
// =====================================================

async function applyHighlight(range) {

    if (
        !isSafeRange(range)
    ) {

        showToast(
            "Invalid selection",
            "error"
        );

        return;

    }

    // -------------------------------------------------
    // SERIALIZE BEFORE DOM CHANGES
    // -------------------------------------------------

    const serializedRange =
        serializeRange(
            range
        );

    try {

        // -------------------------------------------------
        // SAVE ANNOTATION
        // -------------------------------------------------

        const annotation = {

            ...serializedRange,

            highlight: true

        };

        const saved =
            await saveAnnotation(
                annotation
            );

        // -------------------------------------------------
        // HANDLE STORAGE FAILURE
        // -------------------------------------------------

        if (
            !saved
        ) {

            showToast(

                "Could not save highlight",

                "error"

            );

            return;

        }

        // -------------------------------------------------
        // GET SAVED ANNOTATION ID
        // -------------------------------------------------

        getPageAnnotations(

            (annotations) => {

                const savedAnnotation =
                    annotations.find(

                        a =>

                            a.highlight &&

                            a.text ===
                            serializedRange.text &&

                            a.startXPath ===
                            serializedRange.startXPath &&

                            a.startOffset ===
                            serializedRange.startOffset

                    );

                wrapRange(

                    range,

                    savedAnnotation?.id || ""

                );

            }

        );

    }

    catch (err) {

        console.error(
            "Highlight failed:",
            err
        );

        showToast(
            "Could not create highlight",
            "error"
        );

    }

}

// =====================================================
// COLLECT TEXT NODES INSIDE RANGE
// =====================================================

function collectTextNodes(range) {

    const root =
        range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer;

    const walker =
        document.createTreeWalker(

            root,

            NodeFilter.SHOW_TEXT,

            {

                acceptNode(node) {

                    return range.intersectsNode(node)

                        ? NodeFilter.FILTER_ACCEPT

                        : NodeFilter.FILTER_REJECT;

                }

            }

        );

    const textNodes = [];

    let node;

    while (
        (node = walker.nextNode())
    ) {

        if (
            node.textContent.length > 0
        ) {

            textNodes.push(node);

        }

    }

    return textNodes;

}

// =====================================================
// WRAP TEXT NODE
// =====================================================

function wrapTextNode(
    textNode,
    startOffset,
    endOffset,
    annotationId = ""
) {

    // -------------------------------------------------
    // NOTHING TO WRAP
    // -------------------------------------------------

    if (
        startOffset >= endOffset
    ) {

        return;

    }

    // -------------------------------------------------
    // SPLIT END FIRST
    // -------------------------------------------------

    if (
        endOffset <
        textNode.length
    ) {

        textNode.splitText(
            endOffset
        );

    }

    // -------------------------------------------------
    // SPLIT START
    // -------------------------------------------------

    let selectedNode =
        textNode;

    if (
        startOffset > 0
    ) {

        selectedNode =
            textNode.splitText(
                startOffset
            );

    }

    // -------------------------------------------------
    // SKIP IF ALREADY HIGHLIGHTED
    // -------------------------------------------------

    if (
        selectedNode.parentElement?.classList.contains(
            "thought-highlight"
        )
    ) {

        return;

    }

    // -------------------------------------------------
    // CREATE SPAN
    // -------------------------------------------------

    const span =
        document.createElement(
            "span"
        );

    span.className =
        "thought-highlight";

    if (
        annotationId
    ) {

        span.dataset.annotationId =
            annotationId;

    }

    selectedNode.parentNode.insertBefore(
        span,
        selectedNode
    );

    span.appendChild(
        selectedNode
    );

}

// =====================================================
// WRAP RANGE
// =====================================================

function wrapRange(
    range,
    annotationId = ""
) {

    const textNodes =
        collectTextNodes(
            range
        );

    textNodes.forEach(

        (textNode) => {

            let start = 0;

            let end =
                textNode.length;

            if (
                textNode ===
                range.startContainer
            ) {

                start =
                    range.startOffset;

            }

            if (
                textNode ===
                range.endContainer
            ) {

                end =
                    range.endOffset;

            }

            wrapTextNode(

                textNode,

                start,

                end,

                annotationId

            );

        }

    );

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

    console.log(document.body.innerHTML.length);

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

        updateThoughtPanel();

    }
);

// =====================================================
// TOGGLE HIGHLIGHTS
// =====================================================

function toggleHighlightsOnPage(show) {

    if (show && !highlightsLoaded) {

        restoreHighlights();

        highlightsLoaded = true;

    }

    document

        .querySelectorAll(
            ".thought-highlight"
        )

        .forEach(

            (highlight) => {

                highlight.style.display =
                    show
                        ? ""
                        : "none";

            }

        );

}