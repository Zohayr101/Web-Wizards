SELECT 	[id]
	, [title]
	, [description]
	, [startDate]
	, [startTime]
	, [endDate]
	, [endTime]
	, [complete]
FROM	[dbo].[events]
WHERE	[userId] = @userId
ORDER BY
	[startDate], [startTime]