console.log("TOAST JS LOADED");

// =====================================================
// ACTIVE TOAST TRACKER
// =====================================================

let activeToast = null;

// =====================================================
// SHOW TOAST
// =====================================================

function showToast(
    message,
    type = "info"
) {

    // -------------------------------------------------
    // REMOVE EXISTING TOAST
    // -------------------------------------------------

    if (activeToast) {

        activeToast.remove();
    }

    // -------------------------------------------------
    // CREATE TOAST ELEMENT
    // -------------------------------------------------

    const toast =
        document.createElement("div");

    toast.className =
        `thought-toast thought-toast-${type}`;

    toast.textContent =
        message;

    // -------------------------------------------------
    // ADD TO PAGE
    // -------------------------------------------------

    document.body.appendChild(
        toast
    );

    activeToast = toast;

    // -------------------------------------------------
    // AUTO REMOVE
    // -------------------------------------------------

    setTimeout(() => {

        toast.remove();

        if (
            activeToast === toast
        ) {

            activeToast = null;
        }

    }, 3000);
}