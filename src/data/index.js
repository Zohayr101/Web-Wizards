"use strict";

const events = require("./events");
const habits = require("./habits");
const stats = require("./stats");
const settings = require("./settings");
const sql = require("mssql");

/**
 * Creates and configures a database client that registers modules for events, habits,
 * settings, and stats. The client establishes a connection pool using the provided
 * SQL configuration and sets up error handling for the connection pool.
 *
 * @async
 * @param {*} server - The server instance or connection information (currently unused in this implementation).
 * @param {Object} config - The SQL connection configuration options.
 * @returns {Promise<Object>} A promise that resolves to an object containing the registered modules:
 *   - events: The module managing event-related operations.
 *   - habits: The module managing habit-related operations.
 *   - settings: The module managing user settings.
 *   - stats: The module managing user statistics.
 */
const client = async (server, config) => {
    let pool = null;

    /**
     * Closes the SQL connection pool.
     *
     * @async
     * @private
     * @returns {Promise<void>}
     */
    const closePool = async () => {
        try {
            await pool.close();
            pool = null;
        } catch(err) {
            pool = null;
            console.log(err);
        }
    };

    /**
     * Retrieves an active SQL connection pool. If the pool does not exist, it will create a new one.
     * The connection pool is set to handle errors by logging the error and closing the pool.
     *
     * @async
     * @private
     * @returns {Promise<Object|null>} A promise that resolves to the active SQL connection pool,
     * or null if the connection could not be established.
     */
    const getConnection = async () => {
        try {
            if(pool) {
                return pool;
            }
            pool = await sql.connect(config);
            pool.on("error", async err => {
                console.log(err);
                await closePool();
            });
            return pool;
        } catch(err) {
            console.log(err);
            pool=null;
        }
    };

    return {
        events: await events.register({sql, getConnection}),
        habits: await habits.register({sql, getConnection}),
        settings: await settings.register({sql, getConnection}),
        stats: await stats.register({sql, getConnection})
    };
};

module.exports = client;
