//events
"use strict"

const utils = require("../utils");

/**
 * Registers the events database queries.
 *
 * This function loads the SQL queries for events from the utils and returns an object
 * containing functions to perform CRUD operations on events.
 *
 * @param {Object} dependencies - The dependency object.
 * @param {Object} dependencies.sql - The SQL module (e.g., mssql) providing data types and query functionality.
 * @param {Function} dependencies.getConnection - A function to obtain a database connection.
 * @returns {Promise<Object>} An object with methods: addEvent, deleteEvent, getEvents, updateEvent.
 */
const register = async ({sql, getConnection}) => {
    const sqlQueries = await utils.loadSqlQueries("events");

    /**
     * Retrieves events for the specified user.
     *
     * @async
     * @param {string} userId - The ID of the user whose events are to be retrieved.
     * @returns {Promise<Object>} The results of the getEvents query.
     */
    const getEvents = async userId => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.VarChar(50), userId);
        return await request.query( sqlQueries.getEvents);
    };

    /**
     * Adds a new event to the database.
     *
     * @async
     * @param {Object} eventData - The event data.
     * @param {string} eventData.userId - The ID of the user creating the event.
     * @param {string} eventData.title - The title of the event.
     * @param {string} eventData.description - The description of the event.
     * @param {Date} eventData.startDate - The start date for the event.
     * @param {Date|string} eventData.startTime - The start time of the event.
     * @param {Date} eventData.endDate - The end date for the event.
     * @param {Date|string} eventData.endTime - The end time of the event.
     * @param {boolean} eventData.complete - The completion status of the event.
     * @param {string} eventData.category - The category of the event.
     * @param {number} eventData.priority - The priority level of the event.
     * @returns {Promise<Object>} The results of the addEvent query.
     */
	const addEvent = async ({userId, title, description, startDate, startTime, endDate, endTime, complete, category, priority}) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("userId", sql.VarChar(50), userId);
		request.input("title", sql.NVarChar(200), title);
		request.input("description", sql.NVarChar(1000), description);
		request.input("startDate", sql.Date, startDate);
		request.input("startTime", sql.Time, startTime);
		request.input("endDate", sql.Date, endDate);
		request.input("endTime", sql.Time, endTime);
		request.input("complete", sql.Bit, complete);
		request.input("category", sql.VarChar(50), category);
		request.input("priority", sql.Int, priority);

		return await request.query(sqlQueries.addEvent);
	};

    /**
     * Updates an existing event in the database.
     *
     * @async
     * @param {Object} eventData - The updated event data.
     * @param {number} eventData.id - The unique identifier of the event.
     * @param {string} eventData.userId - The ID of the user owning the event.
     * @param {string} eventData.title - The title of the event.
     * @param {string} eventData.description - The description of the event.
     * @param {Date} eventData.startDate - The new start date of the event.
     * @param {Date|string} eventData.startTime - The new start time of the event.
     * @param {Date} eventData.endDate - The new end date of the event.
     * @param {Date|string} eventData.endTime - The new end time of the event.
     * @param {boolean} eventData.complete - The new completion status of the event.
     * @param {string} eventData.category - The updated category of the event.
     * @param {number} eventData.priority - The updated priority level of the event.
     * @returns {Promise<Object>} The results of the updateEvent query.
     */
    const updateEvent = async ( { id, userId, title, description, startDate, startTime, endDate, endTime, complete, category, priority } ) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.VarChar(50), userId);
		request.input("title", sql.NVarChar(200), title);
		request.input("description", sql.NVarChar(1000), description);
		request.input("startDate", sql.Date, startDate);
		request.input("startTime", sql.Time, startTime);
		request.input("endDate", sql.Date, endDate);
		request.input("endTime", sql.Time, endTime);
		request.input("complete", sql.Bit, complete);
		request.input("category", sql.VarChar(50), category);
		request.input("priority", sql.Int, priority);

		return request.query(sqlQueries.updateEvent);
	};

    /**
     * Deletes an event from the database.
     *
     * @async
     * @param {Object} deleteData - The event deletion data.
     * @param {number} deleteData.id - The unique identifier of the event to delete.
     * @param {string} deleteData.userId - The ID of the user who owns the event.
     * @returns {Promise<Object>} The results of the deleteEvent query.
     */
	const deleteEvent = async ({id,userId}) => {
		const cnx = await getConnection();
		const request = await cnx.request();
		request.input("id", sql.Int, id);
		request.input("userId", sql.VarChar(50), userId);
		return request.query(sqlQueries.deleteEvent);
	};

    return {
        addEvent,
        deleteEvent,
        getEvents,
        updateEvent
    };
};

module.exports = {register};
