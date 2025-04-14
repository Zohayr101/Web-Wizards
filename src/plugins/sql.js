"use strict";

const dataClient = require("../data");

/**
 * SQL Plugin
 *
 * This plugin integrates SQL database functionality into the Hapi server. It uses the `dataClient` module
 * to create a SQL client based on the configuration provided in `server.app.config.sql`, and exposes the client
 * for use by other parts of the application.
 *
 * @module sql
 * @version 1.0.0
 */
module.exports = {
    name: "sql",
    version: "1.0.0",

    /**
     * Registers the SQL client with the Hapi server.
     *
     * Retrieves the SQL configuration from the server's application settings, initializes the SQL client using
     * the `dataClient` function, and exposes it on the server instance so it can be accessed by other plugins.
     *
     * @async
     * @param {Object} server - The Hapi server instance.
     * @returns {Promise<void>} A promise that resolves once the SQL client has been registered and exposed.
     */
    register: async server => {
        const config = server.app.config.sql;
        const client = await dataClient(server, config);
        server.expose("client", client);
    }
}
;