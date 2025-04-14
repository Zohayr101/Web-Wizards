"use strict";

const boom = require("@hapi/boom");

module.exports.register = async server => {
    server.route( {
        method: "GET",
        path: "/api.stats",
        options: {
            auth: {mode: "try"}
        },
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
