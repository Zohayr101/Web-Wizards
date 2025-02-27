document.addEventListener("DOMContentLoaded", function () {

    //
    // 1) THEME LOADING (for the page background + mini-calendar)
    //
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
  
    //
    // 2) DOM ELEMENTS
    //
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
    //    Title => "journalTitle_YYYY-MM-DD"
    //    Body => "journalEntry_YYYY-MM-DD"
    //    Image => "journalImage_YYYY-MM-DD"
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
    // 8) DATE DISPLAY CLICK => TOGGLE MINI-CALENDAR
    //
    dateDisplay.addEventListener("click", () => {
      if (miniCalendar.style.display === "none") {
        buildMiniCalendar(viewYear, viewMonth);
        miniCalendar.style.display = "block";
      } else {
        miniCalendar.style.display = "none";
      }
    });
  
    //
    // 9) BUILD MINI-CALENDAR
    //
    function buildMiniCalendar(year, month) {
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      miniCalTitle.textContent = `${monthName} ${year}`;
  
      miniCalGrid.innerHTML = "";
  
      const firstOfMonth = new Date(year, month, 1);
      const lastOfMonth = new Date(year, month + 1, 0);
  
      const firstDayOfWeek = firstOfMonth.getDay();
      const totalDays = lastOfMonth.getDate();
  
      // Fill "empty" days
      for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("mini-calendar-day", "empty");
        miniCalGrid.appendChild(emptyDiv);
      }
  
      // Actual days
      for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("mini-calendar-day");
        dayDiv.textContent = dayNum;
  
        const testDate = new Date(year, month, dayNum);
  
        if (testDate > realToday) {
          // Future => disable
          dayDiv.classList.add("disabled");
        } else {
          // Clickable
          dayDiv.addEventListener("click", () => {
            // Save the current date's content
            saveEntryForDate(currentDate);
            // Switch to the new date
            currentDate = testDate;
            // Hide the mini-calendar
            miniCalendar.style.display = "none";
            // Update UI
            updateUI();
            // Also update the "view" so next time we open the calendar we see the correct month
            viewYear = currentDate.getFullYear();
            viewMonth = currentDate.getMonth();
          });
        }
        miniCalGrid.appendChild(dayDiv);
      }
    }
  
    //
    // 10) PREV/NEXT MONTH FOR MINI-CALENDAR
    //
    prevMonthBtn.addEventListener("click", () => {
      viewMonth--;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear--;
      }
      buildMiniCalendar(viewYear, viewMonth);
    });
  
    nextMonthBtn.addEventListener("click", () => {
      viewMonth++;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear++;
      }
      buildMiniCalendar(viewYear, viewMonth);
    });
  
    //
    // 11) SAVE BUTTON
    //
    saveButton.addEventListener("click", function () {
      saveEntryForDate(currentDate);
      alert("Journal entry saved!");
    });
  
    //
    // 12) IMAGE UPLOAD
    //     We'll preview it immediately, but only store it when user hits "Save Entry"
    //
    imageInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function(e) {
        // e.target.result is the Base64 data
        currentImageData = e.target.result;
        // Show preview
        imagePreview.innerHTML = '<img src="' + currentImageData + '">';
      };
      reader.readAsDataURL(file);
    });
  
    //
    // 13) OPTIONAL TYPING EFFECT for <textarea> placeholder
    //
    let placeholderText = "Write your thoughts here...";
    let i = 0;
    function typePlaceholder() {
        if (i < placeholderText.length) {
            journalText.setAttribute("placeholder", placeholderText.substring(0, i + 1));
            i++;
            setTimeout(typePlaceholder, 50);
        }
    }
    typePlaceholder();
  
    //
    // 14) INITIAL LOAD
    //
    updateUI();
  });
  