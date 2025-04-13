/**
 * An array of available themes from the global window.THEMES.
 * @type {string[]}
 */
const themes = window.THEMES;

/**
 * An array of available layouts from the global window.LAYOUTS.
 * @type {string[]}
 */
const layouts = window.LAYOUTS;

/**
 * An array of available fonts from the global window.FONTS.
 * @type {string[]}
 */
const fonts = window.FONTS;

/**
 * Aggregated list of quotes from selected quote packs.
 * @type {string[]}
 */
let quotes = [];

/**
 * List of identifiers for the quote packs that are currently checked/selected.
 * @type {string[]}
 */
let checkedQuotes = [];

preload();

/**
 * Event listener that initializes quote handling after the window fully loads.
 */
window.addEventListener("load", () => {
    quotesLoad();
    updateQuotes();
    cycleQuotes();
  });

/**
 * Preloads user settings from localStorage and dynamically generates the UI elements
 * for selecting layouts, themes, and fonts. This includes:
 * - Applying the saved theme and font to the document.
 * - Populating layout menu with clickable layout options.
 * - Populating theme menu and fetching sample color values from each theme.
 * - Populating font menu with clickable font options.
 */
  function preload() {
    // Apply saved theme
    document.body.classList.add(localStorage.getItem("theme"));
    // Apply saved font
    document.body.style.fontFamily = localStorage.getItem("font");


    // Generate divs/buttons for settings selection
    // Layouts
    const layoutMenu = document.getElementById("layouts");
    for (let layout of layouts) {
      const layoutSelection = document.createElement("div");
      layoutSelection.classList.add("layout-selection");
      const layoutBody = document.createElement("div");
      layoutBody.classList.add("layout-body");
      layoutSelection.appendChild(layoutBody);
      layoutBody.id = layout;

          // Create dummy elements to simulate a calendar view.
      const dummyCalendar = document.createElement("div");
      dummyCalendar.id = "calendar";
      dummyCalendar.textContent = "calendar";
      layoutBody.appendChild(dummyCalendar);
      const dummyToday = document.createElement("div");
      dummyToday.id = "today";
      dummyToday.textContent = "tdy";
      layoutBody.appendChild(dummyToday);
      const dummyWeek = document.createElement("div");
      dummyWeek.id = "week";
      dummyWeek.textContent = "week";
      layoutBody.appendChild(dummyWeek);
      const dummyMonth = document.createElement("div");
      dummyMonth.id = "month";
      dummyMonth.textContent = "mnth";
      layoutBody.appendChild(dummyMonth);
      const dummyHabits = document.createElement("div");
      dummyHabits.id = "habits";
      dummyHabits.textContent = "hbts";
      layoutBody.appendChild(dummyHabits);

      if (layout === localStorage.getItem("layout")) {
        layoutSelection.id = "selected-layout";
      }

      layoutSelection.addEventListener("click", () => {
        setLayout(layout);
        document.getElementById("selected-layout").removeAttribute("id");
        layoutSelection.id = "selected-layout";
      });

      layoutMenu.appendChild(layoutSelection);
    }

    // Themes
    const themeMenu = document.getElementById("themes");
    const colorFetcher = document.createElement("div"); // will inherit the colors of the themes without updating the screen
    colorFetcher.style.display = "none";
    document.head.appendChild(colorFetcher); // add to head so it is not visible
    for (let theme of themes) {
      const themeSelection = document.createElement("div");
      themeSelection.classList.add("theme-selection");
      
      // retrieve 4 significant colors from the theme
      // will fetch background, text, primary, and secondary colors
      colorFetcher.className = theme;
      const backgroundColor = getComputedStyle(colorFetcher).getPropertyValue('--bg-color');
      const textColor = getComputedStyle(colorFetcher).getPropertyValue('--text-color');
      const primaryColor = getComputedStyle(colorFetcher).getPropertyValue('--primary-color');
      const secondaryColor = getComputedStyle(colorFetcher).getPropertyValue('--secondary-color');
      const buttonColor = getComputedStyle(colorFetcher).getPropertyValue('--button-bg-color');
      
      const backgroundDiv = document.createElement('div');
      backgroundDiv.style.backgroundColor = backgroundColor;
      const textColorDiv = document.createElement('div');
      textColorDiv.style.backgroundColor = textColor;
      const primaryDiv = document.createElement('div');
      primaryDiv.style.backgroundColor = primaryColor;
      const secondaryDiv = document.createElement('div');
      secondaryDiv.style.backgroundColor = secondaryColor;

      //themeSelection.textContent = "text";

      if (theme === localStorage.getItem("theme")) {
        themeSelection.id = "selected-theme";
      }
      themeSelection.addEventListener("click", () => {
        setTheme(theme);
        document.getElementById("selected-theme").removeAttribute("id");
        themeSelection.id = "selected-theme";
      });

      themeMenu.appendChild(themeSelection);
      themeSelection.appendChild(secondaryDiv);
      themeSelection.appendChild(primaryDiv);
      themeSelection.appendChild(textColorDiv);
      themeSelection.appendChild(backgroundDiv);
    }

    // Fonts
    const fontsMenu = document.getElementById("fonts");
    for (let font of fonts) {
      const fontSelection = document.createElement("div");
      fontSelection.classList.add("font-selection");
      fontSelection.textContent = "Tasty Pomodoro!";
      fontSelection.style.fontFamily = font;

      if (font === localStorage.getItem("font")) {
        fontSelection.id = "selected-font";
      }

      fontSelection.addEventListener("click", () => {
        setFont(font);
        document.getElementById("selected-font").removeAttribute("id");
        fontSelection.id = "selected-font";
      });

      fontsMenu.appendChild(fontSelection);
    }
  }

  /**
 * Sets the layout for the application by saving the selected layout to localStorage.
 *
 * @param {string} layout - The identifier of the layout to set.
 */
  function setLayout(layout) {
    localStorage.setItem("layout", layout);
  }

/**
 * Sets the theme for the application.
 * Removes any previously applied theme classes from the document body and applies the new theme.
 *
 * @param {string} theme - The identifier of the theme to set.
 */
  function setTheme(theme) {
    const body = document.body;
    localStorage.setItem("theme", theme);
    // remove the current theme
    for (let t of themes) {
      body.classList.remove(t);
    }
    body.classList.add(theme);
  }

  /**
 * Sets the font for the application by updating the body's font family style and saving the selection to localStorage.
 *
 * @param {string} font - The font-family name to set.
 */
  function setFont(font) {
    localStorage.setItem("font", font);
    document.body.style.fontFamily = font;
  }

/**
 * Loads saved quote pack selections from localStorage and initializes change event listeners
 * for each quote pack option in the quotes menu.
 *
 * Retrieves the saved "checkedQuotes" and applies the checked status to the corresponding DOM elements.
 */
function quotesLoad() {
  checkedQuotes = localStorage.getItem('checkedQuotes');
  console.log("checked quotes: " + checkedQuotes);
  const quoteMenu = document.getElementById("quotes");
  const quoteOptions = quoteMenu.children;
  for (let option of quoteOptions) {
    option = option.children[0];
    if (checkedQuotes != null && checkedQuotes.includes(option.value)) {
      option.checked = true;
    }
    option.addEventListener("change", () => {
      updateQuotes();
    });
  }
}

/**
 * Updates the quotes list based on the currently selected quote packs.
 * This function:
 * - Resets the quotes and checkedQuotes arrays.
 * - Iterates over the quote pack options in the DOM.
 * - Appends quotes from selected quote packs to the global quotes array.
 * - Shuffles the quotes if there are any.
 * - Saves the updated list of checked quotes to localStorage.
 */
function updateQuotes() {
  checkedQuotes = [];
  quotes = [];
  const quoteMenu = document.getElementById("quotes");
  const quoteOptions = quoteMenu.children;
  for (let option of quoteOptions) {
    option = option.children[0];
    if (option.checked) {
      checkedQuotes.push(option.value);
      quotes = quotes.concat(window[option.value]);
    }
  }
  if (quotes.length <= 0) {
    quotes.push('Select a quote pack.');
  } else {
    shuffleArray(quotes);
  }
  localStorage.setItem("checkedQuotes", checkedQuotes);
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
/**
 * Randomly shuffles the elements of the provided array in place using the Fisher–Yates algorithm.
 *
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Cycles through the quotes in the global quotes array, updating the quote display with a fade-out/in effect.
 * Displays each quote in sequence within the HTML element with the id "motivational-quote", changing quotes every 5 seconds.
 */
  function cycleQuotes() {
  const quoteElement = document.getElementById("motivational-quote");
    let quoteIndex = 0;
  
    // Function to display the next quote
      /**
   * Displays the next quote in the array. It first fades out the current quote,
   * updates the text, and then fades in the new quote. The fade effect is achieved
   * by toggling the "visible" class and using a timeout to match the CSS transition duration.
   */
    const showNextQuote = () => {
      // Remove 'visible' class to start fade-out
      quoteElement.classList.remove("visible");
  
      // After the fade-out transition ends, update the text and fade in
      setTimeout(() => {
        quoteElement.textContent = quotes[quoteIndex];
        quoteElement.classList.add("visible");
  
        // Update index to the next quote, looping back if necessary
        quoteIndex = (quoteIndex + 1) % quotes.length;
      }, 1000); // 1000ms matches the CSS transition duration
    };
  
    // Initially show the first quote
    showNextQuote();
  
    // Set interval to change quotes every 5 seconds
    setInterval(showNextQuote, 5000);
  }
  
