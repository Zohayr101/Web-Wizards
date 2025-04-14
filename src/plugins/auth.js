"use strict";

const bell = require("@hapi/bell");
const cookie = require("@hapi/cookie");

/**
 * Indicates if the authentication cookies should be marked as secure.
 * Will be true only if NODE_ENV is "production".
 * @type {boolean}
 */
const isSecure = process.env.NODE_ENV === "production";

/**
 * Hapi authentication plugin.
 *
 * This plugin registers authentication strategies for session management using cookies
 * and for OAuth authentication with Okta using bell. It sets the default authentication
 * strategy to "session" and extends the server response context with user auth information
 * for views.
 *
 * @module auth
 * @version 1.0.0
 */
module.exports = {
    name: "auth",
    version: "1.0.0",

    /**
     * Registers the authentication plugin with the Hapi server.
     *
     * The plugin registers two authentication strategies:
     *  - "session": Uses the cookie scheme for session management.
     *  - "okta": Uses the bell scheme for Okta OAuth.
     *
     * It sets the default authentication strategy to "session" and extends the response
     * with authentication context for any view responses.
     *
     * @async
     * @param {Object} server - The Hapi server instance.
     * @returns {Promise<void>} A promise that resolves once registration and configuration are complete.
     */
    register: async server => {
        // Register bell and cookie authentication plugins
        await server.register([bell, cookie]);
        const config = server.app.config;

        // Configure the "session" authentication strategy using cookies
        server.auth.strategy("session", "cookie", {
            cookie: {
                name: "okta-oath",
                path: "/",
                password: config.cookiePwd,
                isSecure
            },
            redirectTo: "/authorization-code/callback"
        });

        // Configure the "okta" authentication strategy using bell
        server.auth.strategy("okta", "bell", {
            provider: "okta",
            config: {uri: config.okta.url},
            password: config.cookiePwd,
            isSecure,
            location: config.url,
            clientId: config.okta.clientId,
            clientSecret: config.okta.clientSecret
        });

        server.auth.default("session");

        // Extend response for view rendering by injecting auth context
        server.ext("onPreResponse", (request, h) => {
            if(request.response.variety === "view") {

                /**
                 * Builds the auth context for views.
                 *
                 * If the request is authenticated, it adds the user's email, first and last name.
                 * Otherwise, it provides empty strings and flags the user as anonymous.
                 *
                 * @type {Object}
                 */
                const auth = request.auth.isAuthenticated ? {
                    isAuthenticated: true,
                    isAnonymous: false,
                    email: request.auth.artifacts.profile.email,
                    firstName: request.auth.artifacts.profile.firstName,
                    lastName: request.auth.artifacts.profile.lastName
                } : {
                    isAuthenticated: false,
                    isAnonymous: true,
                    email: "",
                    firstName: "",
                    lastName: "",
                };
                request.response.source.context.auth = auth;
            }
            return h.continue;
        });
    }
};
