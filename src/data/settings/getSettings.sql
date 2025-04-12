SELECT 
    [id],
    [userId],
    [theme],
    [layout],
    [quotes]
FROM [dbo].[settings]
WHERE userId = @userId;