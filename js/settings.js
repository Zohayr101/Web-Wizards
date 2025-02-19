const themes = window.THEMES;

window.addEventListener("load", () => {
    // Initialize quote cycling on window load
    // Start cycling motivational quotes
    cycleQuotes();
  
    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-theme");
    } else if (savedTheme === "green") {
      document.body.classList.add("green-theme");
    } else if (savedTheme === "purple") {
      document.body.classList.add("purple-theme");
    } else if (savedTheme === "jing") {
      document.body.classList.add("jing-theme");
    } else {
      document.body.classList.remove(
        "light-theme",
        "green-theme",
        "purple-theme",
        "jing-theme"
      );
    }
  });

function setTheme(theme) {
    const body = document.body;
    localStorage.setItem("theme", theme);
    // remove the current theme
    for (let t of themes) {
      body.classList.remove(t + "-theme");
    }
    // add the new theme
    body.classList.add(theme + "-theme");
  
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
  