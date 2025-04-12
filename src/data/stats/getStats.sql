SELECT 
    [id],
    [userId],
    [goldAmount],
    [goldEarned],
    [goldSpent],
    [pomoCompleted],
    [pomoTimeSpentMinutes],
    [tasksCompleted],
    [habitsCompleted],
    [longestHabitStreak],
    [stocksChecked],
    [weatherChecks],
    [movieLikes],
    [settingsChanged],
    [journalEntriesWritten],
    [notesWritten]
FROM [dbo].[stats]
WHERE userId = @userId;