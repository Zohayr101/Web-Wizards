"use strict";

const events = require("./events");
const habits = require("./habits");
const settings = require("./settings");
const stats = require("./stats");

module.exports.register = async server => {
    await events.register(server);
    await habits.register(server);
    await settings.register(server);
    await stats.register(server);
};
