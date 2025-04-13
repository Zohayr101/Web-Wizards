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

                return res.recordset;
            } catch (err) {
                console.log(err);
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
                const res = await db.stats.addStat({userId, goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak, stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten});
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

                const res = await db.stats.updateStat({id, userId, goldAmount, goldEarned, goldSpent, pomoCompleted, pomoTimeSpentMinutes, tasksCompleted, habitsCompleted, longestHabitStreak, stocksChecked, weatherChecks, movieLikes, settingsChanged, journalEntriesWritten, notesWritten});
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
                const res = await db.stats.deleteStat({id, userId});
                    
                return res.rowsAffected[0] === 1 ? h.response().code(204) : boom.notFound();
            } catch (err) {
                console.log(err);
                return boom.boomify(err);
            }
        }
    });

};
