const { Command, util } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config'),
      moment = require('moment'),
      SoulUtils = require('../../lib/SoulUtils');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reports',
            group: 'moderation',
            memberName: 'reports',
            aliases: ['reports'],
            description: 'Displays reports of the tagged user',
            examples: ['reports @user'],
            args: [
              {
                key: "member",
                type: "member",
                prompt: "Please tag the member you want to view reports for"
              },
              {
                key:"page",
                type:"integer",
                prompt:"What page would you like to view?",
                default: '1'
              }
            ],
            throttling: {
                usages: 1,
                duration: 1800
            }
        });
    }

    async run(msg, {member, page}) {
        const get = await msg.client.reports.getReports(member);
        const reports = get.reverse()
        const paginated = util.paginate(reports, page, 5)
      
        if(!reports.length) return msg.channel.send(`No reports for ${member.user.tag}`)
    
        let embed = new MessageEmbed()
        .addField(`Reports (${member.user.tag}) (Page ${paginated.page}/${paginated.maxPage})`, paginated.items.map(report => `**Reported By:** <@${report.userReporting}>\n**Reason:** ${report.reason}\n**Reported at:** ${report.time.toUTCString()}`).join('\n\n'))
        .setColor(config.defaultColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
        .setTimestamp(Date.now());
        let message = await msg.channel.send(embed);
    }
}
