SELECT 	[id]
	, [title]
	, [complete]
	, [daysComplete]
	, [maxDays]
	, [frequency]
	, [lastCompleted]

FROM	[dbo].[habits]
WHERE	[userId] = @userId
ORDER BY
	[title]