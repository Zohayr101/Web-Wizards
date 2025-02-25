document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Pomodoro script is linked correctly and running after DOM is loaded!");

    let timeLeft = 25 * 60;
    let timer;
    let isRunning = false;
    let currentMode = "Pomodoro";

    function setTimer(minutes, mode) {
        clearInterval(timer);
        timeLeft = minutes * 60;
        currentMode = mode;
        isRunning = false;
        updateUI();
        console.log(`Mode set to: ${mode}`);
    }

    function startTimer() {
        console.log("⏳ Start button clicked!");
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateUI();
                } else {
                    clearInterval(timer);
                    alert(currentMode + " session ended!");
                    isRunning = false;
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        console.log("⏸ Pause button clicked!");
        clearInterval(timer);
        isRunning = false;
    }

    function resetTimer() {
        console.log("🔄 Reset button clicked!");
        clearInterval(timer);
        setTimer(25, "Pomodoro");
    }

    function updateUI() {
        document.getElementById('timer').innerText = formatTime(timeLeft);
        document.getElementById('status').innerText = currentMode === "Pomodoro" ? "Time to focus!" : "Take a break!";
    }

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Wait until DOM is fully loaded before attaching event listeners
    const startBtn = document.getElementById("start-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const resetBtn = document.getElementById("reset-btn");

    if (startBtn) {
        startBtn.addEventListener("click", startTimer);
        console.log("✅ Start button is ready!");
    } else {
        console.error("❌ Start button not found!");
    }

    if (pauseBtn) {
        pauseBtn.addEventListener("click", pauseTimer);
        console.log("✅ Pause button is ready!");
    } else {
        console.error("❌ Pause button not found!");
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", resetTimer);
        console.log("✅ Reset button is ready!");
    } else {
        console.error("❌ Reset button not found!");
    }

    // Set default mode
    setTimer(25, "Pomodoro");
});
