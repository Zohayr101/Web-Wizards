document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Pomodoro script is linked correctly and running after DOM is loaded!");

    let pomodoroTime = 0.15;
    let shortBrTime = 0.15;
    let longBrTime = 0.25;
    let totalLoops = 4;

    let loopNum = 0;
    let timeLeft;
    let timer;
    let isRunning = false;
    let currentMode = "Pomodoro";

    // ⏳ Set Timer Function
    function setTimer(minutes, mode) {
        clearInterval(timer);
        timeLeft = minutes * 60;
        currentMode = mode;
        isRunning = false;
        updateUI();
        updateTheme(mode); // Apply theme changes
        console.log(`Mode set to: ${mode}`);
    }

    // ▶ Start Timer Function
    function startTimer() {
        console.log("⏳ Start button clicked!");
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateUI();
                } else {
                    if (currentMode === "Pomodoro") {
                        if (++loopNum === totalLoops) {
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

    // ⏸ Pause Timer Function
    function pauseTimer() {
        console.log("⏸ Pause button clicked!");
        clearInterval(timer);
        isRunning = false;
    }

    // 🔄 Reset Timer Function
    function resetTimer() {
        console.log("🔄 Reset button clicked!");
        clearInterval(timer);
        setTimer(pomodoroTime, "Pomodoro");
    }

    // ⏲ Update UI (Timer & Status)
    function updateUI() {
        document.getElementById('timer').innerText = formatTime(timeLeft);
        document.getElementById('status').innerText = currentMode === "Pomodoro" ? "Time to focus!" : "Take a break!";
    }

    // ⏳ Format Time as MM:SS
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 🎨 Update Theme Based on Mode
    function updateTheme(mode) {
        const body = document.body;
        const container = document.querySelector(".container");

        if (mode === "Pomodoro") {
            body.style.backgroundColor = "#B74D41"; // Red for Pomodoro
            container.style.backgroundColor = "#A5433F";
        } else if (mode === "Short Break") {
            body.style.backgroundColor = "#6BAA75"; // Green for Short Break
            container.style.backgroundColor = "#5F9565";
        } else if (mode === "Long Break") {
            body.style.backgroundColor = "#4A7BAE"; // Blue for Long Break
            container.style.backgroundColor = "#41699B";
        }
    }

    // 📅 Display Current Date (No Emoji)
    function updateDate() {
        const dateElement = document.getElementById("current-date");
        if (dateElement) {
            const today = new Date();
            const options = { weekday: "short", month: "short", day: "numeric" };
            dateElement.innerText = today.toLocaleDateString("en-US", options);
        } else {
            console.error("❌ Date element not found!");
        }
    }

    // 📅 Toggle Mini Calendar Visibility
    function toggleCalendar() {
        const calendar = document.getElementById("mini-calendar");
        if (calendar) {
            calendar.classList.toggle("active");
        } else {
            console.error("❌ Mini calendar not found!");
        }
    }

    // 🎯 Attach Event Listeners
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const resetBtn = document.getElementById("reset-btn");
    const pomodoroBtn = document.getElementById("pomodoro-btn");
    const shortBreakBtn = document.getElementById("short-break-btn");
    const longBreakBtn = document.getElementById("long-break-btn");

    if (startBtn) startBtn.addEventListener("click", startTimer);
    if (pauseBtn) pauseBtn.addEventListener("click", pauseTimer);
    if (resetBtn) resetBtn.addEventListener("click", resetTimer);

    if (pomodoroBtn) pomodoroBtn.addEventListener("click", () => setTimer(pomodoroTime, "Pomodoro"));
    if (shortBreakBtn) shortBreakBtn.addEventListener("click", () => setTimer(shortBrTime, "Short Break"));
    if (longBreakBtn) longBreakBtn.addEventListener("click", () => setTimer(longBrTime, "Long Break"));

    // 📅 Initialize Date Display on Page Load
    updateDate();

    // 📅 Make toggleCalendar function globally available
    window.toggleCalendar = toggleCalendar;

    // ⏳ Set Default Mode
    setTimer(pomodoroTime, "Pomodoro");
});
