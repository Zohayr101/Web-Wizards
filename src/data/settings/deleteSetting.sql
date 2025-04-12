DELETE FROM [dbo].[settings]
OUTPUT DELETED.*
WHERE id = @id AND userId = @userId;