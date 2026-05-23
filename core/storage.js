console.log("STORAGE JS LOADED");

// =====================================================
// STORAGE KEY
// =====================================================

const HIGHLIGHT_STORAGE_KEY =
    "highlights";

// =====================================================
// GET ALL HIGHLIGHTS
// =====================================================

function getAllHighlights(callback) {

    chrome.storage.local.get(
        [HIGHLIGHT_STORAGE_KEY],
        (result) => {

            callback(
                result[
                    HIGHLIGHT_STORAGE_KEY
                ] || []
            );
        }
    );
}

// =====================================================
// SAVE HIGHLIGHT
// =====================================================

function saveHighlight(highlightData) {

    const pageUrl =
        window.location.href;

    getAllHighlights(
        (highlights) => {

            // ---------------------------------------------
            // PREVENT DUPLICATES
            // ---------------------------------------------

            const alreadyExists =
                highlights.some(
                    h =>

                        h.url === pageUrl &&

                        h.text ===
                        highlightData.text &&

                        h.startXPath ===
                        highlightData.startXPath &&

                        h.startOffset ===
                        highlightData.startOffset
                );

            if (!alreadyExists) {

                highlights.push({

                    id:
                        crypto.randomUUID(),

                    url:
                        pageUrl,

                    ...highlightData

                });

                chrome.storage.local.set({

                    [HIGHLIGHT_STORAGE_KEY]:
                        highlights

                });

                console.log(
                    "Highlight saved!"
                );
            }
        }
    );
}

// =====================================================
// GET HIGHLIGHTS FOR CURRENT PAGE
// =====================================================

function getPageHighlights(callback) {

    const pageUrl =
        window.location.href;

    getAllHighlights(
        (highlights) => {

            const filtered =
                highlights.filter(
                    h =>
                        h.url === pageUrl
                );

            callback(filtered);
        }
    );
}