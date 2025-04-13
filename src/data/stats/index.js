"use strict";

const utils = require("../utils");

const register = async ({ sql, getConnection }) => {
	const sqlQueries = await utils.loadSqlQueries("stats");

	const getStats = async userId => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.VarChar(50), userId);
		return request.query(sqlQueries.getStats);
	};

    const addStats = async ({ userId, goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak,     stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten }) => {
		const cnx = await getConnection();
		const request = await cnx.request();

        request.input("userId", sql.VarChar(50), userId);
		
        request.input("goldAmount", sql.Int, goldAmount);
		request.input("goldEarned", sql.Int, goldEarned);
		request.input("goldSpent", sql.Int, goldSpent);

		request.input("pomoCompleted", sql.Int, pomoCompleted);
		request.input("pomoTimeSpentMinutes", sql.Int, pomoTimeSpentMinutes);

		request.input("tasksCompleted", sql.Int, tasksCompleted);
		request.input("habitsCompleted", sql.Int, habitsCompleted);
		request.input("longestHabitStreak", sql.Int, longestHabitStreak);

		request.input("stocksChecked", sql.Int, stocksChecked);
		request.input("weatherChecks", sql.Int, weatherChecks);
		request.input("movieLikes", sql.Int, movieLikes);

		request.input("settingsChanged", sql.Int, settingsChanged);
		request.input("journalEntriesWritten", sql.Int, journalEntriesWritten);
		request.input("notesWritten", sql.Int, notesWritten);

		return request.query(sqlQueries.updateStats);
	};

	const updateStats = async ({ id, userId, goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak,     stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten }) => {
		const cnx = await getConnection();
		const request = await cnx.request();

        request.input("id", sql.Int, id);
        request.input("userId", sql.VarChar(50), userId);
		
        request.input("goldAmount", sql.Int, goldAmount);
		request.input("goldEarned", sql.Int, goldEarned);
		request.input("goldSpent", sql.Int, goldSpent);

		request.input("pomoCompleted", sql.Int, pomoCompleted);
		request.input("pomoTimeSpentMinutes", sql.Int, pomoTimeSpentMinutes);

		request.input("tasksCompleted", sql.Int, tasksCompleted);
		request.input("habitsCompleted", sql.Int, habitsCompleted);
		request.input("longestHabitStreak", sql.Int, longestHabitStreak);

		request.input("stocksChecked", sql.Int, stocksChecked);
		request.input("weatherChecks", sql.Int, weatherChecks);
		request.input("movieLikes", sql.Int, movieLikes);

		request.input("settingsChanged", sql.Int, settingsChanged);
		request.input("journalEntriesWritten", sql.Int, journalEntriesWritten);
		request.input("notesWritten", sql.Int, notesWritten);

		return request.query(sqlQueries.updateStats);
	};

    const deleteStats = async ({id,userId}) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.VarChar(50), userId);
		return request.query(sqlQueries.deleteStats);
	};

	return {
		getStats,
        addStats,
		updateStats,
        deleteStats
	};
};

module.exports = { register };
