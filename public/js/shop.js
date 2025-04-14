const themes = window.THEMES;
const layouts = window.LAYOUTS;
const fonts = window.FONTS;

window.addEventListener("load", async () => {
    // Fetch user stats
    try {
        let response = await fetch("/api.stats");

        if (response.ok) {
            let stats = await response.json();

            if (stats.length === 0) {
                // No stats found, initialize them
                console.log("No stats found. Initializing...");
                const initResponse = await fetch("/api/stats/initialize", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (initResponse.ok) {
                    stats = await initResponse.json();
                    console.log("Stats initialized:", stats);
                } else {
                    console.error("Failed to initialize stats:", initResponse.statusText);
                    return;
                }
            } else {
                stats = stats[0]; // Assuming stats is an array, take the first entry
            }

            // Populate stats fields
            document.querySelector(".stat:nth-child(1)").textContent = `Pomodoros Completed: ${stats.pomoCompleted}`;
            document.querySelector(".stat:nth-child(2)").textContent = `Tasks Completed: ${stats.tasksCompleted}`;
            document.querySelector(".stat:nth-child(3)").textContent = `Habits Completed: ${stats.habitsCompleted}`;
            document.querySelector(".stat:nth-child(4)").textContent = `Journal Entries Written: ${stats.journalEntriesWritten}`;
            document.querySelector(".stat:nth-child(5)").textContent = `Notes Written: ${stats.notesWritten}`;
            document.querySelector(".stat:nth-child(6)").textContent = `Movies Liked: ${stats.movieLikes}`;
            document.querySelector(".stat:nth-child(7)").textContent = `Longest Habit Streak: ${stats.longestHabitStreak}`;
            document.querySelector(".stat:nth-child(8)").textContent = `Weather Checked: ${stats.weatherChecks}`;
            document.querySelector(".stat:nth-child(9)").textContent = `Stocks Viewed: ${stats.stocksChecked}`;
            document.querySelector(".stat:nth-child(10)").textContent = `Settings Changed: ${stats.settingsChanged}`;
            document.querySelector(".stat:nth-child(11)").textContent = `Gold Earned: ${stats.goldEarned}`;
            document.querySelector(".stat:nth-child(12)").textContent = `Gold Spent: ${stats.goldSpent}`;
        } else {
            console.error("Failed to fetch stats:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching stats:", error);
    }

    // Load quotes
    let checkedQuotes = localStorage.getItem('checkedQuotes')?.split(',') || [];
    for (let option of checkedQuotes) {
        quotes = quotes.concat(window[option]);
    }
    shuffleArray(quotes);
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