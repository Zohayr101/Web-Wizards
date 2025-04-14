"use strict";



const config = require("./config");
const server = require("./server");

/**
 * @fileoverview This module serves as the entry point for starting the server.
 * It loads the application configuration and server instance, then starts the server.
 */

/**
 * Starts the server application.
 *
 * <p>This asynchronous function initializes the server using the application configuration.
 * It waits for the server instance to be created and started. If the server starts successfully,
 * it logs a message indicating the host and port on which the server is running. In case of an error
 * during startup, the error is caught and logged to the console.</p>
 *
 * @async
 * @function startServer
 * @returns {Promise<void>} A promise that resolves when the server has been started or logs an error if startup fails.
 */
const startServer = async () => {
    try {
        const app = await server(config);
        await app.start();

        console.log(`Server running at http://${config.HOST}:${config.port}`);
    } 
    catch (err) {
        console.log("startup error: ", err);
    }
};

startServer();
