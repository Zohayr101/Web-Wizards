INSERT INTO [dbo].[habits]
(
    [userId]
   , [title]
   , [complete]
   , [daysComplete]
   , [maxDays]
   , [frequency]
)
VALUES
(
   @userId
   , @title
   , @complete
   , @daysComplete
   , @maxDays
   , @frequency
);

SELECT SCOPE_IDENTITY() AS id;
