"use strict";

const boom = require("@hapi/boom");

/**
 * Registers the stats API endpoints on the provided Hapi server instance.
 *
 * This function sets up the following routes:
 *
 * - **GET `/api.stats`**: Retrieves the stats for an authenticated user.
 * - **POST `/api/stats`**: Inserts a new stats record for an authenticated user.
 * - **PUT `/api/stats/{id}`**: Updates an existing stats record identified by an ID.
 * - **DELETE `/api/stats/{id}`**: Deletes a stats record identified by an ID.
 *
 * All routes use "try" authentication mode. If a request is made by an unauthenticated user, the endpoints
 * return an unauthorized response.
 *
 * @async
 * @function register
 * @param {Object} server - The Hapi server instance used to register routes.
 */
module.exports.register = async server => {
    server.route( {
        method: "GET",
        path: "/api.stats",
        options: {
            auth: {mode: "try"}
        },

    /**
     * GET /api.stats route handler.
     *
     * Retrieves the stats for an authenticated user. If the user is not authenticated,
     * an unauthorized error is returned.
     *
     * @async
     * @function
     * @param {Object} request - The Hapi request object.
     * @param {Object} request.auth - Authentication details.
     * @param {boolean} request.auth.isAuthenticated - Indicates if the user is authenticated.
     * @param {Object} request.auth.credentials - The credentials object.
     * @param {Object} request.auth.credentials.profile - The user profile details.
     * @param {(number|string)} request.auth.credentials.profile.id - The unique user ID.
     * @returns {Promise<Object[]|Object>} An array of stats records if successful or a Boom unauthorized error.
     */
        handler: async request => {
            try {
                if(!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;

                const userId = request.auth.credentials.profile.id;
                const res = await db.stats.getStats(userId);

                console.log("Stats fetched from database:", res.recordset); // Debug log
                return res.recordset;
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route({
        method: "POST",
        path: "/api/stats",
        options: {
            auth: {mode: "try"}
        },

    /**
     * POST /api/stats route handler.
     *
     * Inserts a new stats record for an authenticated user. The stats record includes various properties
     * such as gold amounts, pomodoro metrics, task counts, etc.
     *
     * @async
     * @function
     * @param {Object} request - The Hapi request object.
     * @param {Object} request.auth - Authentication details.
     * @param {boolean} request.auth.isAuthenticated - Indicates if the user is authenticated.
     * @param {Object} request.auth.credentials - The credentials object.
     * @param {Object} request.auth.credentials.profile - The user profile details.
     * @param {(number|string)} request.auth.credentials.profile.id - The unique user ID.
     * @param {Object} request.payload - The payload object containing stats data.
     * @param {number} request.payload.goldAmount - Current gold amount.
     * @param {number} request.payload.goldEarned - Total gold earned.
     * @param {number} request.payload.goldSpent - Total gold spent.
     * @param {number} request.payload.pomoCompleted - Number of pomodoros completed.
     * @param {number} request.payload.pomoTimeSpentMinutes - Time spent on pomodoros (in minutes).
     * @param {number} request.payload.tasksCompleted - Number of tasks completed.
     * @param {number} request.payload.habitsCompleted - Number of habits completed.
     * @param {number} request.payload.longestHabitStreak - Longest streak of habit completion.
     * @param {number} request.payload.stocksChecked - Count of stock checks.
     * @param {number} request.payload.weatherChecks - Count of weather checks.
     * @param {number} request.payload.movieLikes - Count of movie likes.
     * @param {number} request.payload.settingsChanged - Count of settings changes.
     * @param {number} request.payload.journalEntriesWritten - Count of journal entries written.
     * @param {number} request.payload.notesWritten - Count of notes written.
     * @returns {Promise<Object>} The newly inserted stats record or a Boom error if the operation fails.
     */
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const {goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak, stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten} = request.payload;
                const res = await db.stats.addStats({userId, goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak, stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten});
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route({
        method: "PUT",
        path: "/api/stats/{id}",
        options: {
            auth: {mode: "try"}
        },

    /**
     * PUT /api/stats/{id} route handler.
     *
     * Updates an existing stats record for an authenticated user. This route expects the ID of the record to be updated
     * and the updated stats data in the payload.
     *
     * @async
     * @function
     * @param {Object} request - The Hapi request object.
     * @param {Object} request.auth - Authentication details.
     * @param {boolean} request.auth.isAuthenticated - Indicates if the user is authenticated.
     * @param {Object} request.auth.credentials - The credentials object.
     * @param {Object} request.auth.credentials.profile - The user profile details.
     * @param {(number|string)} request.auth.credentials.profile.id - The unique user ID.
     * @param {Object} request.params - URL parameters.
     * @param {(string|number)} request.params.id - The ID of the stats record to update.
     * @param {Object} request.payload - The payload object containing updated stats data.
     * @param {number} request.payload.goldAmount - Updated gold amount.
     * @param {number} request.payload.goldEarned - Updated total gold earned.
     * @param {number} request.payload.goldSpent - Updated total gold spent.
     * @param {number} request.payload.pomoCompleted - Updated number of pomodoros completed.
     * @param {number} request.payload.pomoTimeSpentMinutes - Updated pomodoro time (in minutes).
     * @param {number} request.payload.tasksCompleted - Updated number of tasks completed.
     * @param {number} request.payload.habitsCompleted - Updated number of habits completed.
     * @param {number} request.payload.longestHabitStreak - Updated longest habit streak.
     * @param {number} request.payload.stocksChecked - Updated count of stock checks.
     * @param {number} request.payload.weatherChecks - Updated count of weather checks.
     * @param {number} request.payload.movieLikes - Updated count of movie likes.
     * @param {number} request.payload.settingsChanged - Updated count of settings changes.
     * @param {number} request.payload.journalEntriesWritten - Updated count of journal entries written.
     * @param {number} request.payload.notesWritten - Updated count of notes written.
     * @returns {Promise<Object>} The updated stats record or a Boom error if the operation fails.
     */
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }
                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;
                const {id} = request.params;
                const {goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak, stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten} = request.payload;

                const res = await db.stats.updateStats({id, userId, goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak, stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten});
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route( {
        method: "DELETE",
        path: "/api/stats/{id}",
        options: {
            auth: {mode: "try"}
        },

    /**
     * DELETE /api/stats/{id} route handler.
     *
     * Deletes a stats record for an authenticated user. Returns a 204 No Content response if the deletion is successful.
     * If no record is found with the provided ID, a not-found error is returned.
     *
     * @async
     * @function
     * @param {Object} request - The Hapi request object.
     * @param {Object} request.auth - Authentication details.
     * @param {boolean} request.auth.isAuthenticated - Indicates if the user is authenticated.
     * @param {Object} request.auth.credentials - The credentials object.
     * @param {Object} request.auth.credentials.profile - The user profile details.
     * @param {(number|string)} request.auth.credentials.profile.id - The unique user ID.
     * @param {Object} request.params - URL parameters.
     * @param {(string|number)} request.params.id - The ID of the stats record to delete.
     * @param {Object} h - Hapi's response toolkit.
     * @returns {Promise<Object>} A 204 No Content response upon success, or a Boom error if the record is not found.
     */
        handler: async (request, h) => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }   
                const id = request.params.id;
                const userId = request.auth.credentials.profile.id;
                const db = request.server.plugins.sql.client;
                const res = await db.stats.deleteStats({id, userId});
                    
                return res.rowsAffected[0] === 1 ? h.response().code(204) : boom.notFound();
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

    server.route({
        method: "POST",
        path: "/api/stats/initialize",
        options: {
            auth: { mode: "try" }
        },
        handler: async request => {
            try {
                if (!request.auth.isAuthenticated) {
                    return boom.unauthorized();
                }

                const db = request.server.plugins.sql.client;
                const userId = request.auth.credentials.profile.id;

                // Initialize stats to 0
                const defaultStats = {
                    userId,
                    goldAmount: 0,
                    goldEarned: 0,
                    goldSpent: 0,
                    pomoCompleted: 0,
                    pomoTimeSpentMinutes: 0,
                    tasksCompleted: 0,
                    habitsCompleted: 0,
                    longestHabitStreak: 0,
                    stocksChecked: 0,
                    weatherChecks: 0,
                    movieLikes: 0,
                    settingsChanged: 0,
                    journalEntriesWritten: 0,
                    notesWritten: 0
                };

                console.log("Initializing stats with:", defaultStats); // Debug log

                // Insert default stats into the database
                const res = await db.stats.addStats(defaultStats);

                console.log("Stats initialized:", res.recordset); // Debug log
                return res.recordset[0];
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });
};
