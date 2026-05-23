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

// =====================================================
// SAVE HIGHLIGHT
// =====================================================

async function saveHighlight(
    highlightData
) {

    const pageUrl =
        window.location.href;

    return new Promise(
        (resolve) => {

            getAllHighlights(
                (highlights) => {

                    // -----------------------------
                    // PREVENT DUPLICATES
                    // -----------------------------

                    const alreadyExists =
                        highlights.some(
                            h =>

                                h.url ===
                                pageUrl &&

                                h.text ===
                                highlightData.text &&

                                h.startXPath ===
                                highlightData.startXPath &&

                                h.startOffset ===
                                highlightData.startOffset
                        );

                    if (alreadyExists) {

                        resolve(true);

                        return;
                    }

                    // -----------------------------
                    // ADD NEW HIGHLIGHT
                    // -----------------------------

                    highlights.push({

                        id:
                            crypto.randomUUID(),

                        url:
                            pageUrl,

                        ...highlightData
                    });

                    // -----------------------------
                    // SAVE TO STORAGE
                    // -----------------------------

                    chrome.storage.local.set(

                        {
                            [HIGHLIGHT_STORAGE_KEY]:
                                highlights
                        },

                        () => {

                            // ---------------------
                            // HANDLE STORAGE ERRORS
                            // ---------------------

                            if (
                                chrome.runtime
                                    .lastError
                            ) {

                                console.error(

                                    "Storage failed:",

                                    chrome.runtime
                                        .lastError
                                );

                                resolve(false);

                                return;
                            }

                            console.log(
                                "Highlight saved!"
                            );

                            resolve(true);
                        }
                    );
                }
            );
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