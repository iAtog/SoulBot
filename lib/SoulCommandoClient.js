const {CommandoClient, CommandoClientOptions} = require('discord.js-commando');
const SoulDatabase = require('./SoulDatabase');
const SoulLevels = require('./SoulLevels');
const SoulRewards = require('./SoulRewards');
const SoulReports = require('./SoulReports');

class SoulCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions());

        this.db = new SoulDatabase(this);
        this.levels = new SoulLevels(this);
        this.rewards = new SoulRewards(this);
        this.reports = new SoulReports(this);
    }
}

module.exports = SoulCommandoClient;