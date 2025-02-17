function pomodoro(pomodoroTime, shortTimeout, longTimeout, cycleNum, cycleTotal) {
    let cycle = 0;
    
    const startPomodoro = () => {
        //console.log("pom");
        setTimeout(() => {
            if (!(++cycle % cycleNum)) {
                startBreak(longTimeout);
            } else {
                startBreak(shortTimeout);
            }
        }, pomodoroTime);
    };
    
    const startBreak = (breakTime) => {
        //console.log(breakTime);
        setTimeout(() => {
            //console.log(cycle, cycleTotal)
            if (cycle >= cycleTotal) {
                return;
            }

            startPomodoro();
        }, breakTime);
    };

    startPomodoro();
}
