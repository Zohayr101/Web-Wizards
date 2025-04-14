//habits
"use strict"

const utils = require("../utils");

/**
 * Registers and returns the habit database operations.
 *
 * This function loads the SQL queries for habits using the provided utils
 * and returns an object containing functions to perform CRUD operations on habits.
 *
 * @param {Object} deps - The dependencies required for database operations.
 * @param {Object} deps.sql - The SQL module (for example, mssql) used for data types and queries.
 * @param {Function} deps.getConnection - A function that returns a Promise resolving to a database connection.
 * @returns {Promise<Object>} An object containing habit operations: getHabits, addHabit, updateHabit, deleteHabit.
 */
const register = async ({sql, getConnection}) => {
    const sqlQueries = await utils.loadSqlQueries("habits");

    /**
     * Retrieves habits for a specified user.
     *
     * @async
     * @param {string} userId - The ID of the user whose habits are to be retrieved.
     * @returns {Promise<Object>} The result of the getHabits SQL query.
     */
    const getHabits = async userId => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.NVarChar(50), userId);
        return await request.query( sqlQueries.getHabits);
    };

	    /**
     * Adds a new habit for a user.
     *
     * @async
     * @param {Object} habitData - The habit data.
     * @param {string} habitData.userId - The ID of the user creating the habit.
     * @param {string} habitData.title - The title of the habit.
     * @param {boolean} habitData.complete - The completion status of the habit.
     * @param {number} habitData.daysComplete - The number of days the habit has been completed.
     * @param {number} habitData.maxDays - The maximum day count for the habit.
     * @param {string} habitData.frequency - The frequency (e.g., daily, weekly) for the habit.
     * @returns {Promise<Object>} The result of the addHabit SQL query.
     */
	const addHabit = async ({ userId, title, complete, daysComplete, maxDays, frequency }) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.NVarChar(50), userId);
		request.input("title", sql.NVarChar(255), title);
		request.input("complete", sql.Bit, complete);
		request.input("daysComplete", sql.Int, daysComplete);
		request.input("maxDays", sql.Int, maxDays);
		request.input("frequency", sql.NVarChar(100), frequency);

		return await request.query(sqlQueries.addHabit);
	};

    /**
     * Updates an existing habit for a user.
     *
     * @async
     * @param {Object} habitData - The habit data to update.
     * @param {number} habitData.id - The unique identifier of the habit.
     * @param {string} habitData.userId - The ID of the user who owns the habit.
     * @param {string} habitData.title - The updated title of the habit.
     * @param {boolean} habitData.complete - The updated completion status of the habit.
     * @param {number} habitData.daysComplete - The updated count of days the habit has been completed.
     * @param {number} habitData.maxDays - The updated maximum days count for the habit.
     * @param {string} habitData.frequency - The updated frequency for the habit.
     * @returns {Promise<Object>} The result of the updateHabit SQL query.
     */
    const updateHabit = async ( { id, userId, title, complete, daysComplete, maxDays, frequency } ) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.NVarChar(50), userId);
		request.input("title", sql.NVarChar(255), title);
		request.input("complete", sql.Bit, complete);
		request.input("daysComplete", sql.Int, daysComplete);
		request.input("maxDays", sql.Int, maxDays);
		request.input("frequency", sql.NVarChar(100), frequency);

		return request.query(sqlQueries.updateHabit);
	};

    /**
     * Deletes a habit for a specified user.
     *
     * @async
     * @param {Object} deleteData - The habit deletion data.
     * @param {number} deleteData.id - The unique identifier of the habit to delete.
     * @param {string} deleteData.userId - The ID of the user who owns the habit.
     * @returns {Promise<Object>} The result of the deleteHabit SQL query.
     */
	const deleteHabit = async ({id,userId}) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.NVarChar(50), userId);
		return request.query(sqlQueries.deleteHabit);
	};

    return {
        addHabit,
        deleteHabit,
        getHabits,
        updateHabit
    };
};

module.exports = {register};
