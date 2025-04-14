"use strict";

const boom = require("@hapi/boom");

/**
 * Login route configuration.
 *
 * Handles user login by returning a failure message if the user is not authenticated.
 *
 * **Endpoint:** GET /login
 *
 * @type {Object}
 * @property {string} method - The HTTP method (GET).
 * @property {string} path - The URL path (/login).
 * @property {Function} handler - The request handler.
 * @property {Function} handler - The function to handle the login request.
 * It returns a string with the authentication error message if authentication fails.
 */
const login = {
    method: "GET",
    path: "/login",
    handler: request => {
        if(!request.auth.isAuthenticated) {
            return `Authentication failed due to ${request.auth.error.message}`
        }
    }
};

/**
 * OAuth callback route configuration.
 *
 * Handles the OAuth callback after external authentication.
 * On successful authentication, it sets the cookieAuth credentials and redirects to the homepage.
 *
 * **Endpoint:** GET /authorization-code/callback
 *
 * @type {Object}
 * @property {string} method - The HTTP method (GET).
 * @property {string} path - The URL path (/authorization-code/callback).
 * @property {Function} handler - The request handler function.
 * @property {Object} options - Route options.
 * @property {string} options.auth - The authentication strategy to be used ("okta").
 *
 * @throws {Boom} Throws an unauthorized error if authentication fails.
 */
const oAuthCallback = {
    method: "GET",
    path: "/authorization-code/callback",
    handler: (request, h) => {
        if (!request.auth.isAuthenticated) {
            throw boom.unauthorized(`Authentication failed: ${request.auth.error.message}`)
        }
        request.cookieAuth.set(request.auth.credentials);
        return h.redirect("/");
    },
    options: {
        auth: "okta"
    }
};

/**
 * Logout route configuration.
 *
 * Handles user logout by clearing the cookie authentication if the user is authenticated,
 * then redirects the user to the homepage.
 *
 * **Endpoint:** GET /logout
 *
 * @type {Object}
 * @property {string} method - The HTTP method (GET).
 * @property {string} path - The URL path (/logout).
 * @property {Function} handler - The request handler function.
 * @property {Object} options - Route options.
 * @property {Object} options.auth - Authentication options.
 * @property {string} options.auth.mode - The authentication mode ("try").
 */
const logout = {
    method: "GET",
    path: "/logout",
    handler: (request, h) => {
        try {
            if(request.auth.isAuthenticated) {
                request.cookieAuth.clear();
            }
            return h.redirect("/");
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        auth: {
            mode: "try"
        }
    }
};

/**
 * Registers the authentication routes on the provided Hapi server instance.
 *
 * This function registers three routes: login, OAuth callback, and logout.
 *
 * @async
 * @function register
 * @param {Object} server - The Hapi server instance used for route registration.
 */
module.exports.register = async server => {
    server.route([login, oAuthCallback, logout]);
};
