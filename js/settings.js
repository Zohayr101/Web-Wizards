const themes = window.THEMES;

window.addEventListener("load", () => {
    // Apply saved theme
    document.body.classList.add(localStorage.getItem("theme"));
    // Start cycling motivational quotes
    cycleQuotes();

    // Generate divs/buttons for settings selection
    // Layouts

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
    //document.head.removeChild(colorFetcher); // remove from head after use
    // Fonts
  });

  function setLayout(layout) {
    localStorage.setItem("layout", layout);
  }

  function setTheme(theme) {
    const body = document.body;
    localStorage.setItem("theme", theme);
    // remove the current theme
    for (let t of themes) {
      body.classList.remove(t);
    }
    body.classList.add(theme);
  }


// copied from todo.js on 2/19/25 at 3:33pm
const quoteElement = document.getElementById("motivational-quote");
const motivationalQuotes = window.QUOTES; // adjusted by hand
  
  // Function to cycle through quotes
  function cycleQuotes() {
    let quoteIndex = 0;
  
    // Function to display the next quote
    const showNextQuote = () => {
      // Remove 'visible' class to start fade-out
      quoteElement.classList.remove("visible");
  
      // After the fade-out transition ends, update the text and fade in
      setTimeout(() => {
        quoteElement.textContent = motivationalQuotes[quoteIndex];
        quoteElement.classList.add("visible");
  
        // Update index to the next quote, looping back if necessary
        quoteIndex = (quoteIndex + 1) % motivationalQuotes.length;
      }, 1000); // 1000ms matches the CSS transition duration
    };
  
    // Initially show the first quote
    showNextQuote();
  
    // Set interval to change quotes every 5 seconds
    setInterval(showNextQuote, 5000);
  }
  