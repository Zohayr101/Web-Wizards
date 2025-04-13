/**
 * @fileoverview Initializes theme selection and signup modal functionality once the DOM is fully loaded.
 *
 * This script performs the following operations:
 * - Loads and applies a saved theme (or defaults to "root").
 * - Updates the page's font style based on a saved preference.
 * - Corrects an old theme name ("jing-theme" to "lilac-theme").
 * - Enables theme switching via a <select> element.
 * - Sets up modal functionality for a signup dialog.
 */
document.addEventListener("DOMContentLoaded", function () {
    
        /**
     * The <select> element for choosing the page theme.
     * @type {HTMLElement|null}
     */
    const themeSelect = document.getElementById("theme-select");

        /**
     * The <body> element of the document.
     * @type {HTMLBodyElement}
     */
    const body = document.body;

    // Load saved theme or default to root
    let savedTheme = localStorage.getItem("selectedTheme") || "root";
    // Apply saved font
    document.body.style.fontFamily = localStorage.getItem("font");

    // If "jing-theme" was saved, convert it to "lilac-theme"
    if (savedTheme === "jing-theme") {
        savedTheme = "lilac-theme";
        localStorage.setItem("selectedTheme", "lilac-theme");
    }

    // ✅ Apply theme immediately when the page loads
    body.className = "";
    body.classList.add(savedTheme);
    themeSelect.value = savedTheme;

    // ✅ Apply theme switching functionality
        /**
     * Handles theme changes by removing all pre-defined theme classes, 
     * adding the newly selected theme class, and updating localStorage.
     *
     * @param {Event} event - The change event triggered by the theme selection element.
     */
    themeSelect.addEventListener("change", function () {
        body.classList.remove("green-theme", "purple-theme", "lilac-theme", "light-theme", "root");
        const newTheme = this.value;
        body.classList.add(newTheme);
        localStorage.setItem("selectedTheme", newTheme);
    });

    // ✅ Fix: Ensure the theme applies properly even if the button is not clicked
    setTimeout(() => {
        body.classList.add(savedTheme);
    }, 100);

    // ✅ Modal Functionality
        /**
     * The modal element for signup.
     * @type {HTMLElement|null}
     */
    const signupModal = document.getElementById("signup-modal");

        /**
     * The button that opens the signup modal.
     * @type {HTMLElement|null}
     */
    const openModalButton = document.getElementById("openSignupModal");

        /**
     * The button inside the modal used to close it.
     * @type {HTMLElement|null}
     */
    const closeModalButton = signupModal ? signupModal.querySelector(".close") : null;

        /**
     * Opens the signup modal by setting its display style to "flex".
     */
    function openSignupModal() {
        if (signupModal) signupModal.style.display = "flex";
    }

    /**
     * Closes the signup modal by setting its display style to "none".
     */
    function closeSignupModal() {
        if (signupModal) signupModal.style.display = "none";
    }

    if (openModalButton) openModalButton.addEventListener("click", openSignupModal);
    if (closeModalButton) closeModalButton.addEventListener("click", closeSignupModal);

    /**
     * Closes the signup modal if the user clicks outside of the modal content.
     *
     * @param {MouseEvent} event - The click event.
     */
    window.addEventListener("click", function (event) {
        if (signupModal && event.target === signupModal) closeSignupModal();
    });
});
