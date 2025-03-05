INSERT INTO [dbo].[events]
(
    [userId]
   , [title]
   , [description]
   , [startDate]
   , [startTime]
   , [endDate]
   , [endTime]
   , [complete]
)
VALUES
(
   @userId
   , @title
   , @description
   , @startDate
   , @startTime
   , @endDate
   , @endTime
   , @complete
);

SELECT SCOPE_IDENTITY() AS id;
