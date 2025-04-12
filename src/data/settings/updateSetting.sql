UPDATE [dbo].[settings]
SET
    [theme] = @theme,
    [layout] = @layout,
    [quotes] = @quotes
WHERE id = @id AND userId = @userId;

SELECT 
    [id],
    [userId],
    [theme],
    [layout],
    [quotes]
FROM [dbo].[settings]
WHERE id = @id;