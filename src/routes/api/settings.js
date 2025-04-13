"use strict";

const boom = require("@hapi/boom");

module.exports.register = async server => {
    server.route( {
        method: "GET",
        path: "/api.settings",
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
