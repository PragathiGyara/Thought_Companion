console.log("STORAGE JS LOADED");

// =====================================================
// STORAGE KEY
// =====================================================

const ANNOTATION_STORAGE_KEY =
    "annotations";

// =====================================================
// GET ALL ANNOTATIONS
// =====================================================

function getAllAnnotations(callback) {

    chrome.storage.local.get(
        [ANNOTATION_STORAGE_KEY],
        (result) => {

            callback(
                result[
                    ANNOTATION_STORAGE_KEY
                ] || []
            );
        }
    );
}

// =====================================================
// SAVE ANNOTATION
// =====================================================

async function saveAnnotation(
    annotationData
) {

    const pageUrl =
        window.location.href;

    return new Promise(
        (resolve) => {

            getAllAnnotations(
                (annotations) => {

                    // -----------------------------------------
                    // PREVENT DUPLICATES
                    // -----------------------------------------

                    const alreadyExists =
                        annotations.some(
                            a =>

                                a.url ===
                                pageUrl &&

                                a.text ===
                                annotationData.text &&

                                a.startXPath ===
                                annotationData.startXPath &&

                                a.startOffset ===
                                annotationData.startOffset
                        );

                    if (alreadyExists) {

                        resolve(true);

                        return;
                    }

                    // -----------------------------------------
                    // CREATE ANNOTATION
                    // -----------------------------------------

                    annotations.push({

                        id:
                            crypto.randomUUID(),

                        url:
                            pageUrl,

                        highlight:
                            false,

                        note:
                            "",

                        review:
                            false,

                        createdAt:
                            Date.now(),

                        updatedAt:
                            Date.now(),

                        ...annotationData
                    });

                    // -----------------------------------------
                    // SAVE
                    // -----------------------------------------

                    chrome.storage.local.set(

                        {
                            [ANNOTATION_STORAGE_KEY]:
                                annotations
                        },

                        () => {

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
                                "Annotation saved!"
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
// GET CURRENT PAGE ANNOTATIONS
// =====================================================

function getPageAnnotations(
    callback
) {

    const pageUrl =
        window.location.href;

    getAllAnnotations(
        (annotations) => {

            callback(

                annotations.filter(
                    a =>
                        a.url === pageUrl
                )

            );

        }
    );
}


function updateAnnotation(
    annotationId,
    updates
) {

    return new Promise(

        (resolve) => {

            getAllAnnotations(

                (annotations) => {

                    const annotation =
                        annotations.find(

                            a =>

                                a.id ===
                                annotationId

                        );

                    if (
                        !annotation
                    ) {

                        resolve(
                            false
                        );

                        return;

                    }

                    Object.assign(

                        annotation,

                        updates,

                        {

                            updatedAt:
                                Date.now()

                        }

                    );

                    chrome.storage.local.set(

                        {

                            [ANNOTATION_STORAGE_KEY]:
                                annotations

                        },

                        () => {

                            resolve(

                                !chrome.runtime
                                    .lastError

                            );

                        }

                    );

                }

            );

        }

    );

}