DELETE FROM [dbo].[stats]
OUTPUT DELETED.*
WHERE id = @id AND userId = @userId;