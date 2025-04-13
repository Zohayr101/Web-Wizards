const themes = window.THEMES;
const layouts = window.LAYOUTS;
const fonts = window.FONTS;

window.addEventListener("load", () => {
    let checkedQuotes = localStorage.getItem('checkedQuotes').split(',');
    for (let option of checkedQuotes) {
      console.log(option);
      quotes = quotes.concat(window[option]);
    }
    shuffleArray(quotes);
    console.log(quotes);
    cycleQuotes();
    // Apply saved theme
    document.body.classList.add(localStorage.getItem("theme"));
    // Apply saved font
    document.body.style.fontFamily = localStorage.getItem("font");
  });
  
  // 6. Motivational Quotes Functionality
  let quotes = [];
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Function to cycle through quotes
  function cycleQuotes() {
    const quoteElement = document.getElementById("motivational-quote");
      let quoteIndex = 0;
    
      // Function to display the next quote
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