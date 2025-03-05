UPDATE  [dbo].[events]
SET     [title] = @title
       , [description] = @description
       , [startDate] = @startDate
       , [startTime] = @startTime
       , [endDate] = @endDate
       , [endTime] = @endTime
       , [complete] = @complete
WHERE   [id] = @id
 AND   [userId] = @userId;

SELECT  [id]
       , [title]
       , [description]
       , [startDate]
       , [startTime]
       , [endDate]
       , [endTime]
       , [complete]
FROM    [dbo].[events]
WHERE   [id] = @id
 AND   [userId] = @userId;