const {CommandoGuild} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const SoulUtils = require('./SoulUtils');
const config = require('../data/config.json')
const Report = require('../schemas/report.js')
const mongoose = require('mongoose')

class Reports {
    constructor(client) {
        this.client = client;
    }

    getReports(member) {
        return Report.find({guild: member.guild.id, reportedUser: member.id})
    }
  
    submitReport(guild, userReporting, reportedUser, reason) {
              let data = new Report({
                  _id: mongoose.Types.ObjectId(),
                  guild: guild.id, 
                  userReporting: userReporting.id, 
                  reportedUser: reportedUser.id, 
                  reason: reason,
                  time: Date.now()
              }, {collection: "reports"})
              data.save()
              .then(result => console.log(result))
              .catch(err => console.log(err))
              
  }
};

module.exports = Reports;