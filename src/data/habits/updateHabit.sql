UPDATE  [dbo].[habits]
SET     [title] = @title
       , [complete] = @complete
       , [daysComplete] = @daysComplete
       , [maxDays] = @maxDays
       , [frequency] = @frequency
       , [lastCompleted] = @lastCompleted
WHERE   [id] = @id
 AND   [userId] = @userId;

SELECT  [id]
       , [title]
       , [complete]
       , [daysComplete]
       , [maxDays]
       , [frequency]
       , [lastCompleted]
FROM    [dbo].[habits]
WHERE   [id] = @id
 AND   [userId] = @userId;