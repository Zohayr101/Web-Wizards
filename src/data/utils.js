"use strict";

const fs = require("fs-extra");
const {join} = require("path");

/**
 * Loads SQL query files from a specified folder.
 *
 * Constructs a file path based on the current working directory and the provided folder name,
 * reads all files with a `.sql` extension from that directory, and returns an object where each key 
 * is the file name (without the `.sql` extension) and the value is the content of the file as a string.
 *
 * @async
 * @param {string} folderName - The name of the folder containing the .sql files.
 * @returns {Promise<Object>} A promise that resolves to an object mapping query names to their SQL content.
 */
const loadSqlQueries = async folderName => {
    const filePath = join(process.cwd(), "src", "data", folderName);
    const files = await fs.readdir(filePath);
    const sqlFiles = files.filter(f => f.endsWith(".sql"));
    const queries = {};
    for(const sqlFile of sqlFiles) {
        const query = fs.readFileSync(join(filePath, sqlFile), {encoding: "UTF-8"});
        queries[sqlFile.replace(".sql", "")] = query;
    }
    return queries;
};

module.exports = {
    loadSqlQueries
};
