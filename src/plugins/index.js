"use strict";

//const ejs = require( "ejs" );
const handlebars = require('handlebars');
const inert = require( "@hapi/inert" );
const vision = require( "@hapi/vision" );

const auth = require( "./auth" );
const sql = require( "./sql" );

/**
 * Registers plugins and configures view templates for the Hapi server.
 *
 * This function registers the following plugins:
 * - Authentication plugin (./auth)
 * - Static file serving plugin (inert)
 * - Template rendering plugin (vision)
 * - SQL plugin (./sql)
 *
 * It then configures the server's view manager to use the Handlebars templating engine,
 * specifying the relative path to the templates directory and a default layout.
 *
 * @async
 * @param {Object} server - The Hapi server instance.
 * @returns {Promise<void>} A promise that resolves when registration is complete.
 */
module.exports.register = async server => {
	await server.register( [ auth, inert, vision, sql ] );

	server.views( {
		engines: { html: handlebars },
		relativeTo: __dirname,
		path: "../templates",
		layout: "layout"
	} );
};