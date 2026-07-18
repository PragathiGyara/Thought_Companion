console.log("SELECTION JS LOADED");

// =====================================================
// GENERATE UNIQUE XPATH FOR NODE
// =====================================================

function getXPath(node) {

    // -------------------------------------------------
    // HANDLE TEXT NODES
    // -------------------------------------------------

    if (
        node.nodeType ===
        Node.TEXT_NODE
    ) {

        const parent =
            node.parentNode;

        // ---------------------------------------------
        // FIND TEXT NODE INDEX
        // ---------------------------------------------

        let index = 1;

        let sibling =
            node.previousSibling;

        while (sibling) {

            if (
                sibling.nodeType ===
                Node.TEXT_NODE
            ) {

                index++;
            }

            sibling =
                sibling.previousSibling;
        }

        return (
            getXPath(parent) +
            `/text()[${index}]`
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
    // FIND ELEMENT INDEX
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
    // BUILD ELEMENT PATH
    // -------------------------------------------------

    return (
        getXPath(
            node.parentNode
        ) +
        "/" +
        node.tagName.toLowerCase() +
        `[${index}]`
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


// =====================================================
// CHECK IF RANGE IS SAFE TO HIGHLIGHT
// =====================================================

function isSafeRange(range) {

    // -------------------------------------------------
    // INVALID RANGE
    // -------------------------------------------------

    if (!range) {

        return false;

    }

    // -------------------------------------------------
    // EMPTY SELECTION
    // -------------------------------------------------

    if (range.collapsed) {

        return false;

    }

    // -------------------------------------------------
    // START / END MUST EXIST
    // -------------------------------------------------

    if (
        !range.startContainer ||
        !range.endContainer
    ) {

        return false;

    }

    return true;

}


// =====================================================
// GET NODE FROM XPATH
// =====================================================

function getNodeFromXPath(xpath) {

    try {

        const result =
            document.evaluate(

                xpath,

                document,

                null,

                XPathResult
                    .FIRST_ORDERED_NODE_TYPE,

                null
            );

        return result.singleNodeValue;

    } catch (err) {

        console.error(
            "Invalid XPath:",
            xpath
        );

        return null;
    }
}

// =====================================================
// DESERIALIZE RANGE
// =====================================================

function deserializeRange(
    serializedRange
) {

    try {

        // ---------------------------------------------
        // FIND START/END NODES
        // ---------------------------------------------

        const startNode =
            getNodeFromXPath(
                serializedRange
                    .startXPath
            );

        const endNode =
            getNodeFromXPath(
                serializedRange
                    .endXPath
            );

        if (
            !startNode ||
            !endNode
        ) {

            console.log(
                "Could not restore nodes"
            );

            return null;
        }

        // ---------------------------------------------
        // CREATE RANGE
        // ---------------------------------------------

        const range =
            document.createRange();

        range.setStart(
            startNode,
            serializedRange
                .startOffset
        );

        range.setEnd(
            endNode,
            serializedRange
                .endOffset
        );

        return range;

    } catch (err) {

        console.error(
            "Failed to deserialize range:",
            err
        );

        return null;
    }
}