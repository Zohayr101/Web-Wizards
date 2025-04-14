"use strict";

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const {
    PORT,
    HOST,
    HOST_URL,
    COOKIE_ENCRYPT_PWD,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD,
    OKTA_ORG_URL,
    OKTA_CLIENT_ID,
    OKTA_CLIENT_SECRET
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPT === 'true';

// Use defaults if necessary
const port = process.env.PORT || 8080;

const host = process.env.HOST || "0.0.0.0";

/**
 * @file config.js
 * @module config
 * @description Module to set up and export configuration options for the application
 * based on environment variables. If NODE_ENV is not production, environment variables are
 * loaded from a .env file.
 *
 * Environment Variables:
 * - **NODE_ENV**: The node environment (production/development)
 * - **PORT**: Port number to run the server (default: 8080)
 * - **HOST**: Host name or IP address to bind the server (default: "0.0.0.0")
 * - **HOST_URL**: Full URL of the server; if not provided, it is constructed using HOST and PORT
 * - **COOKIE_ENCRYPT_PWD**: Password to encrypt cookies
 * - **SQL_SERVER**: SQL server name/address
 * - **SQL_DATABASE**: Name of the SQL database
 * - **SQL_USER**: Username for SQL database authentication
 * - **SQL_PASSWORD**: Password for SQL database authentication
 * - **SQL_ENCRYPT**: Determines if SQL connection encryption is enabled (should be 'true' to enable)
 * - **OKTA_ORG_URL**: URL of the Okta organization for authentication
 * - **OKTA_CLIENT_ID**: Client ID for Okta integration
 * - **OKTA_CLIENT_SECRET**: Client secret for Okta integration
 */
/**
 * @typedef {Object} SqlOptions
 * @property {boolean} encrypt - Flag indicating if SQL encryption is enabled.
 * @property {boolean} enableArithAbort - Enables arithmetic abort option.
 */

/**
 * @typedef {Object} SqlConfig
 * @property {string} server - The SQL server address.
 * @property {string} database - The SQL database name.
 * @property {string} user - The SQL user name.
 * @property {string} password - The SQL user password.
 * @property {SqlOptions} options - Additional options for the SQL connection.
 */

/**
 * @typedef {Object} OktaConfig
 * @property {string} url - The Okta organization URL.
 * @property {string} clientId - The Okta client ID.
 * @property {string} clientSecret - The Okta client secret.
 */

/**
 * @typedef {Object} Config
 * @property {number|string} port - The port number on which the server runs.
 * @property {string} HOST - The host address for the server.
 * @property {string} url - The full URL of the server.
 * @property {string} cookiePwd - The password used for encrypting cookies.
 * @property {SqlConfig} sql - SQL configuration settings.
 * @property {OktaConfig} okta - Okta configuration settings for authentication.
 */

/**
 * The configuration object for the application.
 * @type {Config}
 */
module.exports = {
    port,
    HOST: host,
    url: HOST_URL || `http://${host}:${port}`, 
    cookiePwd: COOKIE_ENCRYPT_PWD,
    sql: {
        server: SQL_SERVER,
        database: SQL_DATABASE,
        user: SQL_USER,
        password: SQL_PASSWORD,
        options: {
            encrypt: sqlEncrypt,
            enableArithAbort: true
        }
    },
    okta: {
        url: OKTA_ORG_URL,
        clientId: OKTA_CLIENT_ID,
        clientSecret: OKTA_CLIENT_SECRET
    }
};