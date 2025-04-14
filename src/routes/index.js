"use strict";

const api = require("./api");
const auth = require("./auth");
const path = require('path');

/**
 * @fileoverview This module registers the routes for the application.
 * It integrates API and authentication modules, and configures Hapi routes for various
 * GET endpoints including the base route, several HTML page routes, and a catch-all directory
 * route for static assets.
 */

/**
 * Registers application routes with the provided server instance.
 *
 * <p>This asynchronous function registers API and authentication routes using external
 * modules (./api and ./auth) and then defines multiple GET routes for rendering views.
 * The base route checks the user’s authentication status and redirects to the login page if the user
 * is not authenticated (triggering the Okta auth flow) or renders the index view for authenticated users.
 * Additional routes render other static HTML pages and a directory route serves static files from the public folder.</p>
 *
 * @async
 * @function register
 * @param {object} server - The Hapi server instance to which the routes will be added.
 * @returns {Promise<void>} A promise that resolves when all routes have been successfully registered.
 */
module.exports.register = async server => {

    await api.register(server);
    await auth.register(server);
    
    server.route([
        {
            method: "GET",
            path: "/",
            /**
             * Handler for the root path.
             *
             * <p>If the request is not authenticated, the handler redirects to the login page,
             * thereby initiating the Okta authentication flow. Otherwise, it renders the "index" view.</p>
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} A redirection response or a view rendered as "index".
             */
            handler: async (request, h) => {
                if (!request.auth.isAuthenticated) {
                    return h.redirect("/login"); // this will start the Okta auth flow
                } else {
                    return h.view("index", {});
                }
            },
            options: {
                auth: {
                    mode: "try"
                }
            }
        },
        {
            method: "GET",
            path: "/Journal.html",
           /**
             * Handler for rendering the Journal page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered Journal.html view.
             */
            handler: async (request, h) => {
                return h.view("Journal.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/pomodoro.html",

            /**
             * Handler for rendering the Pomodoro page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered pomodoro.html view.
             */
            handler: async (request, h) => {
                return h.view("pomodoro.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/settings.html",
            /**
             * Handler for rendering the Settings page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered settings.html view.
             */
            handler: async (request, h) => {
                return h.view("settings.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/signup.html",

            /**
             * Handler for rendering the Signup page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered signup.html view.
             */
            handler: async (request, h) => {
                return h.view("signup.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/shop.html",
            /**
             * Handler for rendering the Shop page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered shop.html view.
             */
            handler: async (request, h) => {
                return h.view("shop.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/movie.html",
            /**
             * Handler for rendering the Movie page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered movie.html view.
             */
            handler: async (request, h) => {
                return h.view("movie.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/weather.html",
            /**
             * Handler for rendering the Weather page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered weather.html view.
             */
            handler: async (request, h) => {
                return h.view("weather.html", {});
            },
            options: {
                auth: false
            }
        },
        {
            method: "GET",
            path: "/stock.html",
            /**
             * Handler for rendering the Stock page.
             *
             * @param {object} request - The incoming request object.
             * @param {object} h - The Hapi response toolkit.
             * @returns {object} The rendered stock.html view.
             */
            handler: async (request, h) => {
                return h.view("stock.html", {});
            },
            options: {
                auth: false
            }
        }
        
    ]);

    // Register a catch-all route that serves static files from the public directory.
    server.route( {
        method: "GET",
        path: "/{param*}",
        /**
         * Handler for serving static files.
         *
         * <p>This route handles all GET requests not matched by previous routes and serves
         * static content from the public directory. If no index is found, it does not serve a default
         * index file and redirects to a URL with a trailing slash.</p>
         *
         * @property {object} directory - Configuration for serving directory content.
         * @property {string} directory.path - The file system path to the public directory.
         * @property {boolean} directory.index - Whether to serve an index file (set to false).
         * @property {boolean} directory.redirectToSlash - Whether to redirect to a slash-ended URL.
         */
        handler: {
            directory: {
                path: path.join(__dirname, "../../public"),
                index: false,
                redirectToSlash: true
            }
        },
        options: {
            auth: {
                mode: "try"
            }
        }
    });

    
};
