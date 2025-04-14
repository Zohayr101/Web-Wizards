"use strict";

const utils = require("../utils");

/**
 * Registers SQL operations for user statistics.
 *
 * Loads SQL queries from the "stats" directory and returns an object containing methods
 * for interacting with user statistics in the database.
 *
 * @param {Object} config - The configuration object.
 * @param {Object} config.sql - An object representing the SQL library with necessary data types.
 * @param {Function} config.getConnection - A function that returns a promise resolving to a database connection.
 * @returns {Promise<Object>} An object containing the following functions:
 *   - getStats: Retrieves statistics for a specified user.
 *   - addStats: Adds a new statistics record.
 *   - updateStats: Updates an existing statistics record.
 *   - deleteStats: Deletes a statistics record.
 */
const register = async ({ sql, getConnection }) => {
	const sqlQueries = await utils.loadSqlQueries("stats");

	/**
	 * Retrieves user statistics.
	 *
	 * @param {string} userId - The unique identifier of the user.
	 * @returns {Promise<Object>} A promise that resolves to the query result containing the user's statistics.
	 */
	const getStats = async userId => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.VarChar(50), userId);
		return request.query(sqlQueries.getStats);
	};

	/**
	 * Adds a new statistics record for a user.
	 *
	 * @param {Object} stats - An object containing the statistics details.
	 * @param {string} stats.userId - The unique identifier of the user.
	 * @param {number} stats.goldAmount - The current amount of gold.
	 * @param {number} stats.goldEarned - Total gold earned.
	 * @param {number} stats.goldSpent - Total gold spent.
	 * @param {number} stats.pomoCompleted - Number of completed pomodoros.
	 * @param {number} stats.pomoTimeSpentMinutes - Total minutes spent on pomodoros.
	 * @param {number} stats.tasksCompleted - Number of completed tasks.
	 * @param {number} stats.habitsCompleted - Number of completed habits.
	 * @param {number} stats.longestHabitStreak - The longest habit streak achieved.
	 * @param {number} stats.stocksChecked - Number of times stocks were checked.
	 * @param {number} stats.weatherChecks - Number of times weather was checked.
	 * @param {number} stats.movieLikes - Number of movie likes.
	 * @param {number} stats.settingsChanged - Number of times settings have been changed.
	 * @param {number} stats.journalEntriesWritten - Number of journal entries written.
	 * @param {number} stats.notesWritten - Number of notes written.
	 * @returns {Promise<Object>} A promise that resolves to the query result after inserting the statistics.
	 */
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

		return request.query(sqlQueries.addStats);
	};

	/**
	 * Updates an existing statistics record for a user.
	 *
	 * @param {Object} stats - An object containing the updated statistics details.
	 * @param {number} stats.id - The unique identifier of the statistics record.
	 * @param {string} stats.userId - The unique identifier of the user.
	 * @param {number} stats.goldAmount - The updated current amount of gold.
	 * @param {number} stats.goldEarned - Updated total gold earned.
	 * @param {number} stats.goldSpent - Updated total gold spent.
	 * @param {number} stats.pomoCompleted - Updated number of completed pomodoros.
	 * @param {number} stats.pomoTimeSpentMinutes - Updated total minutes spent on pomodoros.
	 * @param {number} stats.tasksCompleted - Updated number of completed tasks.
	 * @param {number} stats.habitsCompleted - Updated number of completed habits.
	 * @param {number} stats.longestHabitStreak - Updated longest habit streak achieved.
	 * @param {number} stats.stocksChecked - Updated number of times stocks were checked.
	 * @param {number} stats.weatherChecks - Updated number of times weather was checked.
	 * @param {number} stats.movieLikes - Updated number of movie likes.
	 * @param {number} stats.settingsChanged - Updated number of times settings have been changed.
	 * @param {number} stats.journalEntriesWritten - Updated number of journal entries written.
	 * @param {number} stats.notesWritten - Updated number of notes written.
	 * @returns {Promise<Object>} A promise that resolves to the query result after updating the statistics.
	 */
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

	/**
	 * Deletes a statistics record for a user.
	 *
	 * @param {Object} info - An object containing information to identify the statistics record.
	 * @param {number} info.id - The unique identifier of the statistics record to delete.
	 * @param {string} info.userId - The unique identifier of the user.
	 * @returns {Promise<Object>} A promise that resolves to the query result after deletion.
	 */
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
