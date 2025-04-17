DECLARE @newId INT;

INSERT INTO [dbo].[habits]
(
    [userId]
   , [title]
   , [complete]
   , [daysComplete]
   , [maxDays]
   , [frequency]
   , [lastCompleted]
)
VALUES
(
   @userId
   , @title
   , @complete
   , @daysComplete
   , @maxDays
   , @frequency
   , @lastCompleted
);

SELECT @newId = SCOPE_IDENTITY();

SELECT 
    [id],
    [userId],
    [title],
    [complete],
    [daysComplete],
    [maxDays],
    [frequency],
    [lastCompleted]
FROM [dbo].[habits]
WHERE id = @newId;
