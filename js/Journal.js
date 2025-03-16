window.onload = function () {
  console.log("✅ Window fully loaded, running Journal.js...");

  //
  // 1) THEME LOADING (for the page background + mini-calendar)
  //
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
      document.body.classList.add(savedTheme);
  }

  //
  // 2) DOM ELEMENTS - Debugging Check
  //
  console.log("🔍 Checking elements in Journal.js...");
  
  const journalTitle = document.getElementById("journal-title");
  const journalText = document.getElementById("journal-text");
  const saveButton = document.getElementById("save-journal");
  const dateDisplay = document.getElementById("journal-date");

  const miniCalendar = document.getElementById("mini-calendar");
  const miniCalTitle = document.getElementById("mini-calendar-title");
  const miniCalGrid = document.getElementById("mini-calendar-grid");
  const prevMonthBtn = document.getElementById("mini-cal-prev-month");
  const nextMonthBtn = document.getElementById("mini-cal-next-month");

  // Image elements
  const imageInput = document.getElementById("journal-image-input");
  const imagePreview = document.getElementById("image-preview");

  // Debugging logs to check if elements exist
  console.log("journal-title:", journalTitle);
  console.log("journal-text:", journalText);
  console.log("save-journal:", saveButton);
  console.log("journal-date:", dateDisplay);
  console.log("mini-calendar:", miniCalendar);
  console.log("mini-calendar-title:", miniCalTitle);
  console.log("mini-calendar-grid:", miniCalGrid);
  console.log("mini-cal-prev-month:", prevMonthBtn);
  console.log("mini-cal-next-month:", nextMonthBtn);
  console.log("journal-image-input:", imageInput);
  console.log("image-preview:", imagePreview);

  // If any elements are null, print an error message
  if (!journalTitle || !journalText || !saveButton || !dateDisplay) {
      console.error("❌ ERROR: One or more required elements are missing in Journal.html!");
      return;
  }

  //
  // 3) TRACK CURRENT DATE
  //
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  let viewYear = currentDate.getFullYear();
  let viewMonth = currentDate.getMonth();

  // "realToday" used to block future days
  const realToday = new Date();
  realToday.setHours(0, 0, 0, 0);

  //
  // 4) We store the currently selected image data (Base64) in a variable 
  //    so it can be saved when the user presses "Save Entry."
  //
  let currentImageData = "";

  //
  // 5) HELPER FUNCTIONS
  //
  function formatDateKey(dateObj) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
  }

  function formatDateDisplay(dateObj) {
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();
      return `${month}/${day}/${year}`;
  }

  //
  // 6) LOAD + SAVE
  //
  function loadEntryForDate(dateObj) {
      const dateKey = formatDateKey(dateObj);

      // Title
      const titleKey = "journalTitle_" + dateKey;
      const savedTitle = localStorage.getItem(titleKey) || "";
      journalTitle.value = savedTitle;

      // Body
      const entryKey = "journalEntry_" + dateKey;
      const savedText = localStorage.getItem(entryKey) || "";
      journalText.value = savedText;

      // Image
      const imageKey = "journalImage_" + dateKey;
      const savedImage = localStorage.getItem(imageKey) || "";
      currentImageData = savedImage;

      // Show image (if any)
      if (savedImage) {
          imagePreview.innerHTML = '<img src="' + savedImage + '">';
      } else {
          imagePreview.innerHTML = "";
      }
  }

  function saveEntryForDate(dateObj) {
      const dateKey = formatDateKey(dateObj);

      // Title
      const titleKey = "journalTitle_" + dateKey;
      localStorage.setItem(titleKey, journalTitle.value);

      // Body
      const entryKey = "journalEntry_" + dateKey;
      localStorage.setItem(entryKey, journalText.value);

      // Image
      const imageKey = "journalImage_" + dateKey;
      localStorage.setItem(imageKey, currentImageData);
  }

  //
  // 7) UPDATE UI
  //
  function updateUI() {
      dateDisplay.textContent = formatDateDisplay(currentDate);
      loadEntryForDate(currentDate);
  }

  //
  // 8) SAVE BUTTON FUNCTIONALITY
  //
  saveButton.addEventListener("click", function () {
      saveEntryForDate(currentDate);
      alert("Journal entry saved!");
  });

  //
  // 9) INITIALIZE PAGE
  //
  updateUI();
};
