/**
 * Initializes the Pomodoro timer script and all associated UI components
 * after the DOM has fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Pomodoro script loaded.");
    // Apply saved font
    document.body.style.fontFamily = localStorage.getItem("font");
  
    // Timer durations (in seconds) for testing
    let pomodoroTime = 25;
    let shortBrTime = 5;
    let longBrTime = 15;
    let totalLoops = 4;
  
    let loopNum = 0;
    let timeLeft;
    let timer;
    let isRunning = false;
    let currentMode = "Pomodoro";
    let currentTotalTime = pomodoroTime;
  
    // =========================
    //  SESSION STATS VARIABLES
    // =========================
    let pomodorosCompletedToday = 0;
    let focusTimeToday = 0; // in minutes
  
    // Update stats UI
      /**
   * Updates the statistics UI elements to show the current session stats.
   */
    function updateStatsUI() {
      document.getElementById("pomodoros-completed").textContent = pomodorosCompletedToday;
      document.getElementById("focus-time-today").textContent = focusTimeToday;
    }
  
    // For example, after each Pomodoro completes, increment stats
      /**
   * Callback function to be executed when a Pomodoro session completes.
   * Increments the completed Pomodoros and adds focus time.
   */
    function onPomodoroComplete() {
      pomodorosCompletedToday++;
      // 25 minutes is the normal length of a Pomodoro
      // For real usage, you'd track actual durations; this is an example
      focusTimeToday += 25;
      updateStatsUI();
    }
  
    // Clear stats button
    const clearStatsBtn = document.getElementById("clear-stats-btn");
    clearStatsBtn.addEventListener("click", function() {
      pomodorosCompletedToday = 0;
      focusTimeToday = 0;
      updateStatsUI();
    });
  
    // Get ring selection dropdown, test button, and volume slider
    const ringSelect = document.getElementById("ring-select");
    const testRingBtn = document.getElementById("test-ring-btn");
    const ringVolumeSlider = document.getElementById("ring-volume");
    let testAudio = null;
  
    // Setup progress ring
    const progressCircle = document.querySelector(".progress-ring__circle");
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
  
    // Set Timer function: sets timer duration based on mode
      /**
   * Sets and initializes the timer for a given duration and mode.
   *
   * @param {number} seconds - The duration (in seconds) for the timer.
   * @param {string} mode - The mode for which the timer is being set (e.g., "Pomodoro", "Short Break", or "Long Break").
   */
    function setTimer(seconds, mode) {
      clearInterval(timer);
      timeLeft = seconds;
      currentTotalTime = seconds;
      currentMode = mode;
      isRunning = false;
      updateUI();
      updateTheme(mode);
      console.log(`Mode set to: ${mode}`);
    }
  
    // Start Timer function
      /**
   * Starts the timer, decrementing the time and updating the UI each second.
   * Automatically handles transitions between Pomodoro and break modes upon completion.
   */
    function startTimer() {
      if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateUI();
          } else {
            playSelectedRing();
  
            // Timer completed, check currentMode
            if (currentMode === "Pomodoro") {
              // We completed a Pomodoro, increment stats
              onPomodoroComplete();
  
              loopNum++;
              if (loopNum === totalLoops) {
                loopNum = 0;
                setTimer(longBrTime, "Long Break");
              } else {
                setTimer(shortBrTime, "Short Break");
              }
            } else {
              setTimer(pomodoroTime, "Pomodoro");
            }
            startTimer();
          }
        }, 1000);
      }
    }
  
    // Pause Timer function
      /**
   * Pauses the currently running timer.
   */
    function pauseTimer() {
      clearInterval(timer);
      isRunning = false;
    }
  
    // Reset Timer now resets to the starting time for the current mode
      /**
   * Resets the timer to the starting duration for the current mode.
   * For example, resets to pomodoroTime if the current mode is "Pomodoro".
   */
    function resetTimer() {
      clearInterval(timer);
      if (currentMode === "Pomodoro") {
        setTimer(pomodoroTime, "Pomodoro");
      } else if (currentMode === "Short Break") {
        setTimer(shortBrTime, "Short Break");
      } else if (currentMode === "Long Break") {
        setTimer(longBrTime, "Long Break");
      }
    }
  
    // Update Timer UI and progress ring
      /**
   * Updates the timer display and progress ring on the UI.
   * Shows the remaining time in MM:SS format and updates the ring based on time fraction.
   */
    function updateUI() {
      document.getElementById("timer").innerText = formatTime(timeLeft);
      document.getElementById("status").innerText =
        currentMode === "Pomodoro" ? "Time to focus!" : "Take a break!";
      const fraction = timeLeft / currentTotalTime;
      const offset = circumference * (1 - fraction);
      progressCircle.style.strokeDashoffset = offset;
    }
  
    // Format seconds to MM:SS
      /**
   * Formats a given time value in seconds to a string in MM:SS format.
   *
   * @param {number} seconds - The time in seconds to format.
   * @returns {string} The formatted time string.
   */
    function formatTime(seconds) {
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
  
    // Update theme based on mode using background classes and update button colors
      /**
   * Updates the theme and button colors based on the current mode.
   * This function changes background classes and button style properties.
   *
   * @param {string} mode - The current timer mode ("Pomodoro", "Short Break", or "Long Break").
   */
    function updateTheme(mode) {
      const body = document.body;
      body.classList.remove("bg-pomodoro", "bg-short", "bg-long");
      if (mode === "Pomodoro") {
        body.classList.add("bg-pomodoro");
      } else if (mode === "Short Break") {
        body.classList.add("bg-short");
      } else if (mode === "Long Break") {
        body.classList.add("bg-long");
      }
  
      const modeButtons = document.querySelectorAll(".modes button");
      const controlButtons = document.querySelectorAll(".controls button");
      let btnColor, btnHoverColor;
      if (mode === "Pomodoro") {
        btnColor = "#D96C5F";
        btnHoverColor = "#C95A4E";
      } else if (mode === "Short Break") {
        btnColor = "#4CAF50";  // Green
        btnHoverColor = "#45A049";
      } else if (mode === "Long Break") {
        btnColor = "#2196F3";  // Blue
        btnHoverColor = "#1976D2";
      }
      modeButtons.forEach((btn) => {
        btn.style.backgroundColor = btnColor;
        btn.onmouseover = () => (btn.style.backgroundColor = btnHoverColor);
        btn.onmouseout = () => (btn.style.backgroundColor = btnColor);
      });
      controlButtons.forEach((btn) => {
        btn.style.backgroundColor = btnColor;
        btn.onmouseover = () => (btn.style.backgroundColor = btnHoverColor);
        btn.onmouseout = () => (btn.style.backgroundColor = btnColor);
      });
    }
  
    // Play selected ring when timer ends
      /**
   * Plays the selected audio ring when the timer ends.
   * Audio file path is constructed based on the selected value from the ringSelect dropdown.
   */
    function playSelectedRing() {
      const selectedRing = ringSelect.value;
      const audio = new Audio("../" + selectedRing);
      audio.volume = ringVolumeSlider.value;
      audio.play();
    }
  
    // Attach event listeners to control buttons
    document.getElementById("start-btn").addEventListener("click", startTimer);
    document.getElementById("pause-btn").addEventListener("click", pauseTimer);
    document.getElementById("reset-btn").addEventListener("click", resetTimer);
    document.getElementById("pomodoro-btn").addEventListener("click", () => setTimer(pomodoroTime, "Pomodoro"));
    document.getElementById("short-break-btn").addEventListener("click", () => setTimer(shortBrTime, "Short Break"));
    document.getElementById("long-break-btn").addEventListener("click", () => setTimer(longBrTime, "Long Break"));
  
    // Initialize timer with Pomodoro mode
    setTimer(pomodoroTime, "Pomodoro");
  
    // Test Ring functionality
    testRingBtn.addEventListener("click", function () {
      if (testAudio) {
        testAudio.pause();
        testAudio = null;
      }
      testAudio = new Audio("../" + ringSelect.value);

      testAudio.volume = ringVolumeSlider.value;
      testAudio.play();
      testAudio.onended = function () {
        testAudio = null;
      };
    });
  
    // Volume slider updates test audio volume in real time
    ringVolumeSlider.addEventListener("input", function () {
      if (testAudio) {
        testAudio.volume = ringVolumeSlider.value;
      }
    });
  
    // Initialize stats UI
    updateStatsUI();
  });
  