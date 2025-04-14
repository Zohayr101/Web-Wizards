"use strict";

const boom = require("@hapi/boom");

/**
 * Registers settings-related API routes on the Hapi server.
 *
 * This module defines endpoints for managing user settings:
 *
 * - **GET /api.settings**: Retrieves the settings for the authenticated user.
 * - **POST /api/settings**: Creates new settings for the authenticated user.
 * - **PUT /api/settings/{id}**: Updates settings for the authenticated user.
 * - **DELETE /api/settings/{id}**: Deletes settings for the authenticated user.
 *
 * Each route uses a "try" authentication mode. If the user is not authenticated, an unauthorized
 * error is returned.
 *
 * @async
 * @param {Object} server - The Hapi server instance.
 * @returns {Promise<void>} A promise that resolves when the routes have been successfully registered.
 */
module.exports.register = async server => {
    server.route( {
        method: "GET",
        path: "/api.settings",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for retrieving user settings.
         *
         * Checks if the request is authenticated. If authenticated, retrieves the settings
         * for the user from the SQL client's `getSettings` method.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {boolean} request.auth.isAuthenticated - Indicates if the user is authenticated.
         * @param {Object} request.auth.credentials - The credentials which contain user profile details.
         * @returns {Promise<Array<Object>>|Object} A promise that resolves to the retrieved settings recordset,
         * or an unauthorized error if the user is not authenticated.
         */
        handler: async request => {
            try {
                if(!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;

                const userId = request.auth.credentials.profile.id;
                const res = await db.settings.getSettings(userId);

                return res.recordset;
            } catch (err) {
                console.log(err);
            }
        }
    });

    server.route({
        method: "POST",
        path: "/api/settings",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for creating new settings.
         *
         * Validates the user's authentication and then uses the request payload to create a new settings
         * record. The payload is expected to contain:
         *   - `theme`: The selected theme.
         *   - `layout`: The chosen layout.
         *   - `quotes`: The quotes configuration.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {Object} request.payload - The settings data payload.
         * @param {string} request.payload.theme - The theme selection.
         * @param {string} request.payload.layout - The layout configuration.
         * @param {string} request.payload.quotes - The quotes configuration.
         * @returns {Promise<Object>|Object} A promise that resolves to the newly created settings record,
         * or an unauthorized error if the user is not authenticated.
         */
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const {theme, layout, quotes} = request.payload;
                const res = await db.settings.addSetting({userId, theme, layout, quotes});
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route({
        method: "PUT",
        path: "/api/settings/{id}",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for updating existing settings.
         *
         * Validates the user's authentication and then updates the settings record identified by the
         * route parameter `id` using the data provided in the payload. Expected payload properties:
         *   - `theme`: The updated theme.
         *   - `layout`: The updated layout.
         *   - `quotes`: The updated quotes configuration.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {Object} request.params - The route parameters.
         * @param {string} request.params.id - The ID of the settings record to update.
         * @param {Object} request.payload - The updated settings data.
         * @param {string} request.payload.theme - The updated theme selection.
         * @param {string} request.payload.layout - The updated layout configuration.
         * @param {string} request.payload.quotes - The updated quotes configuration.
         * @returns {Promise<Object>|Object} A promise that resolves to the updated settings record,
         * or an unauthorized error if the user is not authenticated.
         */
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const {id} = request.params;
                const {theme, layout, quotes} = request.payload;

                const res = await db.settings.updateSetting({id, userId, theme, layout, quotes});
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route( {
        method: "DELETE",
        path: "/api/settings/{id}",
        options: {
            auth: {mode: "try"}
        },

        /**
         * Handler for deleting settings.
         *
         * Validates the user's authentication and then deletes the settings record specified by the
         * route parameter `id`. Returns a 204 (No Content) status if the deletion was successful,
         * or a not found error if no matching record exists.
         *
         * @async
         * @param {Object} request - The Hapi request object.
         * @param {Object} request.auth - The authentication object.
         * @param {Object} request.params - The route parameters.
         * @param {string} request.params.id - The ID of the settings record to delete.
         * @param {Object} h - The Hapi response toolkit.
         * @returns {Promise<Object>|Object} A promise that resolves to an empty response with a 204 status code
         * if deletion is successful, or an error if not.
         */
        handler: async (request, h) => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }   
                const id = request.params.id;
                const userId = request.auth.credentials.profile.id;
                const db = request.server.plugins.sql.client;
                const res = await db.settings.deleteSetting({id, userId});
                    
                return res.rowsAffected[0] === 1 ? h.response().code(204) : boom.notFound();
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

};
