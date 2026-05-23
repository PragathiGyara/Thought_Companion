console.log("SELECTION JS LOADED");

// =====================================================
// GENERATE XPATH FOR NODE
// =====================================================

function getXPath(node) {

    // -------------------------------------------------
    // HANDLE TEXT NODES
    // -------------------------------------------------

    if (
        node.nodeType ===
        Node.TEXT_NODE
    ) {

        return (
            getXPath(
                node.parentNode
            ) +
            "/text()"
        );
    }

    // -------------------------------------------------
    // STOP AT BODY
    // -------------------------------------------------

    if (
        node === document.body
    ) {

        return "/html/body";
    }

    // -------------------------------------------------
    // COUNT SAME TAG SIBLINGS
    // -------------------------------------------------

    let index = 1;

    let sibling =
        node.previousElementSibling;

    while (sibling) {

        if (
            sibling.tagName ===
            node.tagName
        ) {

            index++;
        }

        sibling =
            sibling.previousElementSibling;
    }

    // -------------------------------------------------
    // BUILD PATH RECURSIVELY
    // -------------------------------------------------

    return (
        getXPath(
            node.parentNode
        ) +
        "/" +
        node.tagName.toLowerCase() +
        "[" + index + "]"
    );
}

// =====================================================
// SERIALIZE RANGE
// =====================================================

function serializeRange(range) {

    return {

        text:
            range.toString(),

        startXPath:
            getXPath(
                range.startContainer
            ),

        endXPath:
            getXPath(
                range.endContainer
            ),

        startOffset:
            range.startOffset,

        endOffset:
            range.endOffset
    };
}