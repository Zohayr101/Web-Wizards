//settings
"use strict"

const utils = require("../utils");

/**
 * Registers SQL operations for user settings.
 *
 * Loads SQL queries from the "settings" directory and returns an object containing methods
 * for interacting with settings in the database.
 *
 * @param {Object} config - The configuration object.
 * @param {Object} config.sql - An object representing the SQL library with necessary data types.
 * @param {Function} config.getConnection - A function that returns a promise resolving to a database connection.
 * @returns {Promise<Object>} An object containing the following functions:
 *   - getSettings: Retrieves settings for a specified user.
 *   - addSetting: Adds a new settings entry.
 *   - updateSetting: Updates an existing settings entry.
 *   - deleteSetting: Deletes a settings entry.
 */
const register = async ({sql, getConnection}) => {
    const sqlQueries = await utils.loadSqlQueries("settings");

    /**
     * Retrieves the settings for a given user.
     *
     * @param {string} userId - The unique identifier of the user.
     * @returns {Promise<Object>} A promise that resolves to the query result containing the user's settings.
     */
    const getSettings = async userId => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.VarChar(50), userId);
        return await request.query( sqlQueries.getSettings);
    };

    /**
     * Adds a new settings entry for a user.
     *
     * @param {Object} setting - The settings object.
     * @param {string} setting.userId - The unique identifier of the user.
     * @param {string} setting.theme - The theme preference.
     * @param {string} setting.layout - The layout configuration.
     * @param {string} setting.quotes - The quotes configuration.
     * @returns {Promise<Object>} A promise that resolves to the query result after inserting the new setting.
     */
    const addSetting = async ({userId, theme, layout, quotes}) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.VarChar(50), userId);
        request.input("theme", sql.NVarChar(200), theme);
        request.input("layout", sql.NVarChar(200), layout);
        request.input("quotes", sql.NVarChar(200), quotes);

        return await request.query(sqlQueries.addSetting);
    };

    /**
     * Updates an existing settings entry.
     *
     * @param {Object} setting - The settings object.
     * @param {number} setting.id - The unique identifier of the settings entry.
     * @param {string} setting.userId - The unique identifier of the user.
     * @param {string} setting.theme - The updated theme preference.
     * @param {string} setting.layout - The updated layout configuration.
     * @param {string} setting.quotes - The updated quotes configuration.
     * @returns {Promise<Object>} A promise that resolves to the query result after updating the setting.
     */
    const updateSetting = async ({id, userId, theme, layout, quotes}) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("id", sql.Int, id);
        request.input("userId", sql.VarChar(50), userId);
        request.input("theme", sql.NVarChar(200), theme);
        request.input("layout", sql.NVarChar(200), layout);
        request.input("quotes", sql.NVarChar(200), quotes);

        return await request.query(sqlQueries.addSetting);
    };

    /**
     * Deletes a settings entry for a user.
     *
     * @param {Object} info - An object containing details needed to delete a setting.
     * @param {number} info.id - The unique identifier of the settings entry to delete.
     * @param {string} info.userId - The unique identifier of the user.
     * @returns {Promise<Object>} A promise that resolves to the query result after deletion.
     */
    const deleteSetting = async ({id,userId}) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("id", sql.Int, id);
        request.input("userId", sql.VarChar(50), userId);
        return request.query(sqlQueries.deleteSetting);
    };

    return {
        addSetting,
        deleteSetting,
        getSettings,
        updateSetting
    };
};

module.exports = {register};
