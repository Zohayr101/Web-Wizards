DECLARE @newId INT;

INSERT INTO [dbo].[settings]
(
    [userId],
    [theme],
    [layout],
    [quotes]
)
VALUES
(
    @userId,
    @theme,
    @layout,
    @quotes
);

SELECT @newId = SCOPE_IDENTITY();

SELECT 
    [id],
    [userId],
    [theme],
    [layout],
    [quotes]
FROM [dbo].[settings]
WHERE id = @newId;