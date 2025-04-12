UPDATE [dbo].[Stats]
SET
    [goldAmount] = @goldAmount,
    [goldEarned] = @goldEarned,
    [goldSpent] = @goldSpent,
    [pomoCompleted] = @pomoCompleted,
    [pomoTimeSpentMinutes] = @pomoTimeSpentMinutes,
    [tasksCompleted] = @tasksCompleted,
    [habitsCompleted] = @habitsCompleted,
    [longestHabitStreak] = @longestHabitStreak,
    [stocksChecked] = @stocksChecked,
    [weatherChecks] = @weatherChecks,
    [movieLikes] = @movieLikes,
    [settingsChanged] = @settingsChanged,
    [journalEntriesWritten] = @journalEntriesWritten,
    [notesWritten] = @notesWritten
WHERE id = @id AND userId = @userId;

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
WHERE id = @id;