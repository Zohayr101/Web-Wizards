/**
 * Available themes defined on the global window object.
 * @constant {Object}
 */
const themes = window.THEMES;

/**
 * Available layouts defined on the global window object.
 * @constant {Object}
 */
const layouts = window.LAYOUTS;

/**
 * Available fonts defined on the global window object.
 * @constant {Object}
 */
const fonts = window.FONTS;

/**
 * Source of shop items
 * @constant {Object}
 */
const itemsSource = {
    'hat1': "media/hat1.png", // path to hat image
    'hat2': "media/hat2.png",
    'hat3': "media/hat3.png",
    'hat4': "media/hat4.png",
    'hat5': "media/hat5.png",
    'theme1': "media/theme1.png",
    'theme2': "media/theme2.png",
    'theme3': "media/theme3.png",
    'theme4': "media/theme4.png",
    'quote1': window.QUOTES_PRESIDENTIAL,
    'quote2': window.QUOTES_TECH_CEO,
    'quote3': window.QUOTES_WALL_STREET,
    'quote4': window.QUOTES_CELEBRITY,
}

/**
 * Value of each action in gold amount
 * @constant {Object}
 */
const actionWorth = {
    'pomoCompleted': 10,
    'pomoTimeSpentMinutes': 1,
    'tasksCompleted': 5,
    'habitsCompleted': 5,
    'longestHabitStreak': 10,
    'stocksChecked': 1,
    'weatherChecks': 1,
    'movieLikes': 1,
    'settingsChanged': 1,
    'journalEntriesWritten': 3,
    'notesWritten': 2,
}

let purchasedItems = localStorage.getItem('purchasedItems');

// Check if purchasedItems exists in localStorage
if (!purchasedItems) {
    // Initialize purchasedItems as an empty array and store it in localStorage
    purchasedItems = [];
    localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
} else {
    // Parse the existing purchasedItems from localStorage
    purchasedItems = JSON.parse(purchasedItems);
}

/**
 * Initializes the app after the window has fully loaded.
 *
 * This event listener performs the following tasks:
 * - Fetches user statistics from the `/api.stats` endpoint.
 *   - If no stats are found, it attempts to initialize them via a POST request to `/api/stats/initialize`.
 *   - Updates various DOM elements with the retrieved statistics.
 * - Loads motivational quotes from local storage, shuffles them, and begins cycling through the quotes.
 * - Applies the saved theme and font preferences from local storage to the document.
 *
 * @listens window#load
 */
window.addEventListener("load", async () => {
    recallPurchased();
    updateStats();

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
/**
 * An array to store motivational quotes.
 *
 * @global
 * @type {Array<string>}
 */
let quotes = [];

/**
 * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
 *
 * @param {Array} array - The array to be shuffled.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to cycle through quotes
/**
 * Cycles through motivational quotes by updating the text content of the element with ID "motivational-quote".
 *
 * This function:
 * - Retrieves the HTML element with the ID "motivational-quote".
 * - Sets up an interval to change the quote every 5 seconds.
 * - Applies a fade-out effect before updating the text and a fade-in effect after updating.
 */
function cycleQuotes() {
    const quoteElement = document.getElementById("motivational-quote");
    let quoteIndex = 0;

    // Function to display the next quote
        /**
     * Displays the next quote by updating the quote element.
     * - Removes the "visible" class to trigger a fade-out effect.
     * - After a 1000ms delay (matching the CSS transition duration), updates the text and adds the "visible" class to fade in the new quote.
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

async function updateGold(stats) {
    let response = await fetch("/api.stats");
    stats = await response.json();
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
        } else {
            console.error("Failed to initialize stats:", initResponse.statusText);
            return;
        }
    } else {
        stats = stats[0]; // Assuming stats is an array, take the first entry
    }
    let id = await stats.id;

    // Calculate total gold earned
    let totalGold = 500; // each user starts with 500 gold
    for (let key in actionWorth) {
        if (stats[key]) {
            totalGold += stats[key] * actionWorth[key];
        }
    }

    stats.goldEarned = totalGold;
    stats.goldAmount = totalGold - stats.goldSpent;

    // Update the DOM element displaying the gold amount
    document.getElementById("balance").textContent = `Gold Balance: ${stats.goldAmount}`;

    const updateResponse = await fetch(`/api/stats/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(stats)
    });
    if (!updateResponse.ok) {
        console.error(updateResponse.statusText);
    }
}

async function buyItem(item, price) {
    let response = await fetch("/api.stats");
    stats = await response.json();
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
        } else {
            console.error("Failed to initialize stats:", initResponse.statusText);
            return;
        }
    } else {
        stats = stats[0]; // Assuming stats is an array, take the first entry
    }
    let id = await stats.id;

    let currentGold = stats.goldEarned - stats.goldSpent;
    if (currentGold < price) {
        alert("Not enough gold!");
        return;
    }
    stats.goldSpent += price;

    // Add the item to purchasedItems and update localStorage
    purchasedItems.push(item);
    localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));

    // Update the button to reflect the purchase
    instantiateItem(item);

    const updateResponse = await fetch(`/api/stats/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(stats)
    });
    if (!updateResponse.ok) {
        console.error(updateResponse.statusText);
    }
    updateGold();
    updateStats();
}

function instantiateItem(item) {
    window.PURCHASED[item] = true;
    let purchaseButton = document.getElementById(item).querySelector('button');
    purchaseButton.textContent = "Purchased";
    purchaseButton.disabled = true;
    console.log(`Successfully bought ${item}`);
}

async function updateStats() {
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
                } else {
                    console.error("Failed to initialize stats:", initResponse.statusText);
                    return;
                }
            } else {
                stats = stats[0]; // Assuming stats is an array, take the first entry
            }

            // Update gold values
            updateGold();

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
}

async function setGold(amount) {

    let response = await fetch("/api.stats");
    stats = await response.json();
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
        } else {
            console.error("Failed to initialize stats:", initResponse.statusText);
            return;
        }
    } else {
        stats = stats[0]; // Assuming stats is an array, take the first entry
    }
    let id = await stats.id;

    // Calculate total gold earned
    let totalGold = 0;
    for (let key in actionWorth) {
        if (stats[key]) {
            totalGold += stats[key] * actionWorth[key];
        }
    }

    stats.goldEarned = amount;
    stats.goldSpent = 0;
    stats.goldAmount = totalGold - stats.goldSpent;

    // Update the DOM element displaying the gold amount
    document.getElementById("balance").textContent = `Gold Balance: ${stats.goldAmount}`;

    const updateResponse = await fetch(`/api/stats/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(stats)
    });
    if (!updateResponse.ok) {
        console.error(updateResponse.statusText);
    }
}

function recallPurchased() {
    // Iterate through purchasedItems and update the buttons
    purchasedItems.forEach(item => {
        const purchaseButton = document.getElementById(item)?.querySelector('button');
        if (purchaseButton) {
            purchaseButton.textContent = "Purchased";
            purchaseButton.disabled = true;
        }
    });
}