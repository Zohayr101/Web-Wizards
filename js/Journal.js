document.addEventListener("DOMContentLoaded", function () {
    const journalText = document.getElementById("journal-text");
    const saveButton = document.getElementById("save-journal");

    // Typing effect for placeholder
    let placeholderText = "Write your thoughts here...";
    let i = 0;

    function typePlaceholder() {
        if (i < placeholderText.length) {
            journalText.setAttribute("placeholder", placeholderText.substring(0, i + 1));
            i++;
            setTimeout(typePlaceholder, 50); // Speed of typing effect
        }
    }

    typePlaceholder(); // Start typing effect

    // Load saved journal entry (if any)
    const savedEntry = localStorage.getItem("journalEntry");
    if (savedEntry) {
        journalText.value = savedEntry;
    }

    // Save journal entry when clicking the button
    saveButton.addEventListener("click", function () {
        localStorage.setItem("journalEntry", journalText.value);
        alert("Journal entry saved!");
    });
});
