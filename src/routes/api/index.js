"use strict";

const events = require("./events");
const habits = require("./habits");
const settings = require("./settings");
const stats = require("./stats");

/**
 * Registers the application modules with the Hapi server.
 *
 * This function sequentially registers the following modules on the provided Hapi server:
 * - Events module
 * - Habits module
 * - Settings module
 * - Stats module
 *
 * Each module is expected to have its own `register` method that configures routes or functionality
 * on the Hapi server instance.
 *
 * @async
 * @param {Object} server - The Hapi server instance.
 * @returns {Promise<void>} A promise that resolves once all modules have been successfully registered.
 */
module.exports.register = async server => {
    await events.register(server);
    await habits.register(server);
    await settings.register(server);
    await stats.register(server);
};
