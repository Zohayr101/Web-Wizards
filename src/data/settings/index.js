//settings
"use strict"

const utils = require("../utils");

const register = async ({sql, getConnection}) => {
    const sqlQueries = await utils.loadSqlQueries("settings");

    const getSettings = async userId => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.VarChar(50), userId);
        return await request.query( sqlQueries.getSettings);
    };

    const addSetting = async ({userId, theme, layout, quotes}) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("userId", sql.VarChar(50), userId);
        request.input("theme", sql.NVarChar(200), theme);
        request.input("layout", sql.NVarChar(200), layout);
        request.input("quotes", sql.NVarChar(200), quotes);

        return await request.query(sqlQueries.addSetting);
    };

    const updateSetting = async ({id, userId, theme, layout, quotes}) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("id", sql.Int, id);
        request.input("userId", sql.VarChar(50), userId);
        request.input("theme", sql.NVarChar(200), theme);
        request.input("layout", sql.NVarChar(200), layout);
        request.input("quotes", sql.NVarChar(200), quotes);

        return await request.query(sqlQueries.addSetting);
    };

    const deleteSetting = async ({id,userId}) => {
        const cnx = await getConnection();
        const request = await cnx.request();
        request.input("id", sql.Int, id);
        request.input("userId", sql.VarChar(50), userId);
        return request.query(sqlQueries.deleteSetting);
    };

    return {
        addSetting,
        deleteSetting,
        getSettings,
        updateSetting
    };
};

module.exports = {register};
