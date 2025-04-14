"use strict";


//edit to try and run again
const Hapi = require("@hapi/hapi");
const plugins = require("./plugins");
const routes = require("./routes");

/**
 * Asynchronously creates and configures a Hapi server instance.
 *
 * <p>This function creates a new Hapi server using the provided configuration's host and port,
 * assigns the configuration to the server's app property, registers the application plugins and routes,
 * and returns the fully configured server instance.</p>
 *
 * @async
 * @function app
 * @param {Object} config - The configuration object for the server.
 * @param {string} config.host - The host address for the server.
 * @param {number} config.port - The port number on which the server should listen.
 * @returns {Promise<import('@hapi/hapi').Server>} A promise that resolves to the configured Hapi server instance.
 */
const app = async config => {
    const {host, port} = config;

    // Create a new Hapi server instance with the provided host and port.
    const server = Hapi.server({host, port});
    server.app.config = config;

    // Register plugins and routes with the server.
    await plugins.register(server);
    await routes.register(server);
    return server;
};

module.exports = app;
