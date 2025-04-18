"use strict";

const boom = require("@hapi/boom");

/**
 * Registers habit-related API routes on the Hapi server.
 *
 * This module defines endpoints for managing habits:
 *
 * - **GET /api.habits**: Retrieve a list of habits for the authenticated user.
 * - **POST /api/habits**: Create a new habit for the authenticated user.
 * - **PUT /api/habits/{id}**: Update an existing habit for the authenticated user.
 * - **DELETE /api/habits/{id}**: Delete an existing habit for the authenticated user.
 *
 * Each route uses a "try" authentication mode. If the user is not authenticated,
 * an unauthorized error is returned.
 *
 * @async
 * @param {Object} server - The Hapi server instance.
 * @returns {Promise<void>} A promise that resolves when the routes are registered.
 */
module.exports.register = async server => {
    server.route( {
        method: "GET",
        path: "/api.habits",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for retrieving habits.
         *
         * Checks if the request is authenticated. If so, retrieves habits for the user from the SQL client.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {boolean} request.auth.isAuthenticated - Indicates if the user is authenticated.
         * @param {Object} request.auth.credentials - The credentials containing user profile details.
         * @returns {Promise<Array<Object>>|Object} A promise that resolves to an array of habit objects or an unauthorized error.
         */
        handler: async request => {
            try {
                if(!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;

                const userId = request.auth.credentials.profile.id;
                const res = await db.habits.getHabits(userId);

                return res.recordset;
            } catch (err) {
                console.log(err);
            }
        }
    });

    server.route({
        method: "POST",
        path: "/api/habits",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for creating a new habit.
         *
         * Validates user authentication and uses the request payload to create a new habit.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {Object} request.payload - The habit data payload.
         * @param {string} request.payload.title - The title of the habit.
         * @param {boolean} request.payload.complete - The completion status of the habit.
         * @param {number} request.payload.daysComplete - The number of days the habit has been completed.
         * @param {number} request.payload.maxDays - The maximum number of days for habit tracking.
         * @param {number} request.payload.frequency - The frequency the habit is to be performed.
         * @returns {Promise<Object>|Object} A promise that resolves to the newly created habit record or an unauthorized error.
         */
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const {title, complete, daysComplete, maxDays, frequency, lastCompleted} = request.payload;
                const res = await db.habits.addHabit({userId, title, complete, daysComplete, maxDays, frequency, lastCompleted});
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route({
        method: "PUT",
        path: "/api/habits/{id}",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for updating an existing habit.
         *
         * Validates user authentication, then updates the habit specified by the route parameter `id`
         * with the data provided in the payload.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {Object} request.params - The route parameters.
         * @param {string} request.params.id - The ID of the habit to update.
         * @param {Object} request.payload - The updated habit data.
         * @param {string} request.payload.title - The updated title of the habit.
         * @param {boolean} request.payload.complete - The updated completion status of the habit.
         * @param {number} request.payload.daysComplete - The updated count of days the habit has been completed.
         * @param {number} request.payload.maxDays - The updated maximum number of days for habit tracking.
         * @param {number} request.payload.frequency - The updated frequency of the habit.
         * @returns {Promise<Object>|Object} A promise that resolves to the updated habit record or an error.
         */
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const {id} = request.params;
                const {title, complete, daysComplete, maxDays, frequency, lastCompleted} = request.payload;

                const res = await db.habits.updateHabit({id, userId, title, complete, daysComplete, maxDays, frequency, lastCompleted});
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    /*
    server.route({
        method: "PATCH",
        path: "/api/habits/{id}",
        options: { auth: { mode: "try" } },
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const { id } = request.params;
                // Extract the fields sent in the payload for partial update
                const patchData = request.payload;
                
                // Ensure your database layer can handle partial updates
                const res = await db.habits.patchHabit({ id, userId, ...patchData });
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });
    */

    server.route( {
        method: "DELETE",
        path: "/api/habits/{id}",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for deleting a habit.
         *
         * Validates user authentication, deletes the habit with the provided `id`, and returns an HTTP 204 status
         * if deletion is successful. Otherwise, returns a not found error.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {Object} request.params - The route parameters.
         * @param {string} request.params.id - The ID of the habit to delete.
         * @param {Object} h - The Hapi response toolkit.
         * @returns {Promise<Object>|Object} A promise that resolves to an empty response with a 204 status code or an error.
         */
        handler: async (request, h) => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }   
                const id = request.params.id;
                const userId = request.auth.credentials.profile.id;
                const db = request.server.plugins.sql.client;
                const res = await db.habits.deleteHabit({id, userId});
                    
                return res.rowsAffected[0] === 1 ? h.response().code(204) : boom.notFound();
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

};
