const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const moment = require("moment");

class SoulUtils {
  static randomInt(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }
}

module.exports = SoulUtils;
