DECLARE @newId INT;

INSERT INTO [dbo].[stats]
(
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
)
VALUES
(
    @userId,
    @goldAmount,
    @goldEarned,
    @goldSpent,
    @pomoCompleted,
    @pomoTimeSpentMinutes,
    @tasksCompleted,
    @habitsCompleted,
    @longestHabitStreak,
    @stocksChecked,
    @weatherChecks,
    @movieLikes,
    @settingsChanged,
    @journalEntriesWritten,
    @notesWritten
);

SELECT @newId = SCOPE_IDENTITY();

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
WHERE id = @newId;