"use strict";

const boom = require("@hapi/boom");

/**
 * Registers event API routes on the Hapi server.
 *
 * This plugin defines routes for managing events in the application. The following endpoints are added:
 *
 * - **GET /api.events**  
 *   Retrieves a list of events for the authenticated user.  
 *   *If the user is not authenticated, returns an unauthorized error.*
 *
 * - **POST /api/events**  
 *   Creates a new event for the authenticated user using details provided in the request payload.  
 *   Payload properties include:
 *     - `startDate`: The start date of the event.
 *     - `startTime`: The start time of the event.
 *     - `endDate`: The end date of the event.
 *     - `endTime`: The end time of the event.
 *     - `title`: The event title.
 *     - `description`: The event description.
 *     - `complete`: A flag indicating whether the event is complete.
 *   *If the user is not authenticated, returns an unauthorized error.*
 *
 * - **PUT /api/events/{id}**  
 *   Updates an existing event identified by `id` for the authenticated user.  
 *   Expects the same payload structure as the POST endpoint.  
 *   *If the user is not authenticated, returns an unauthorized error.*
 *
 * - **DELETE /api/events/{id}**  
 *   Deletes the event specified by `id` for the authenticated user.  
 *   Returns a 204 status code if the deletion is successful or a not found error if the event does not exist.  
 *   *If the user is not authenticated, returns an unauthorized error.*
 *
 * Each route uses "try" mode for authentication which attempts to authenticate the user; however, if authentication
 * fails, an appropriate error is returned.
 *
 * @async
 * @param {Object} server - The Hapi server instance.
 * @returns {Promise<void>} A promise that resolves when the routes have been registered.
 */
module.exports.register = async server => {
    server.route( {
        method: "GET",
        path: "/api.events",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for retrieving events.
         *
         * Checks if the request is authenticated. If not, returns an unauthorized error.
         * Otherwise, retrieves the events for the current user using the SQL client's `getEvents` method.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @returns {Object|Error} The recordset containing the events, or an unauthorized error.
         */
        handler: async request => {
            try {
                if(!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;

                const userId = request.auth.credentials.profile.id;
                const res = await db.events.getEvents(userId);

                return res.recordset;
            } catch (err) {
                console.log(err);
            }
        }
    });

    server.route({
		method: "POST",
		path: "/api/events",
		options: {
			auth: {mode: "try"}
		},

        /**
         * Handler for creating a new event.
         *
         * Validates the authentication status before attempting to add a new event.
         * Expects payload properties: `startDate`, `startTime`, `endDate`, `endTime`, `title`, `description`, `complete`.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @returns {Object|Error} The newly created event record, or an unauthorized error.
         */
		handler: async request => {
			try {
				if (!request.auth.isAuthenticated) {
					return boom.unauthorized();
				}
				const db = request.server.plugins.sql.client;
				const userId = request.auth.credentials.profile.id;
				const {startDate, startTime, endDate, endTime, title, description, complete, priority, category} = request.payload;
				const res = await db.events.addEvent({userId, startDate, startTime, endDate, endTime, title, description, complete, priority, category});
				return res.recordset[0];
			} catch (err) {
				console.log(err);
				return boom.boomify(err);
			}
		}
	});

    server.route({
		method: "PUT",
		path: "/api/events/{id}",
		options: {
			auth: {mode: "try"}
		},

        /**
         * Handler for updating an existing event.
         *
         * Validates the authentication status before updating the event identified by `id`.
         * Expects the same payload properties as for event creation.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @returns {Object|Error} The updated event record, or an unauthorized error.
         */
		handler: async request => {
			try {
				if (!request.auth.isAuthenticated) {
					return boom.unauthorized();
				}
				const db = request.server.plugins.sql.client;
				const userId = request.auth.credentials.profile.id;
				const {id} = request.params;
				const {startDate, startTime, endDate, endTime, title, description, complete, priority, category} = request.payload;

				const res = await db.events.updateEvent({id, userId, startDate, startTime, endDate, endTime, title, description, complete, priority, category});
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
        path: "/api/events/{id}",
        options: { auth: { mode: "try" } },
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const { id } = request.params;
                // Extract only the fields provided for partial update
                const patchData = request.payload;
                // Make sure the database layer method patchEvent can handle partial updates
                const res = await db.events.patchEvent({ id, userId, ...patchData });
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
		path: "/api/events/{id}",
		options: {
			auth: {mode: "try"}
		},

        /**
         * Handler for deleting an event.
         *
         * Validates the authentication status before deleting the event specified by `id`.
         * If deletion is successful, returns an HTTP 204 (No Content) status.
         * Otherwise, returns a not found error.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} h - The Hapi response toolkit.
         * @returns {Object|Error} An empty response with a 204 status code, a not found error, or an unauthorized error.
         */
		handler: async (request, h) => {
			try {
				if (!request.auth.isAuthenticated) {
					return boom.unauthorized();
				}   
				const id = request.params.id;
				const userId = request.auth.credentials.profile.id;
				const db = request.server.plugins.sql.client;
				const res = await db.events.deleteEvent({id, userId});

				return res.rowsAffected[0] === 1 ? h.response().code(204) : boom.notFound();
			} catch (err) {
				console.log(err);
				return boom.boomify(err);
			}
		}
	});

};
