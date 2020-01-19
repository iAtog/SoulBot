const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config'),
      moment = require('moment'),
      SoulUtils = require('../../lib/SoulUtils');
      Report = require('../../schemas/report.js')

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clearreports',
            group: 'moderation',
            memberName: 'clearreports',
            aliases: ['clearreports'],
            description: 'Clears reports of the tagged user',
            examples: ['clearreports @user'],
            args: [
              {
                key: "member",
                type: "member",
                prompt: "Please tag the member you want to remove reports for"
              }
            ],
            throttling: {
                usages: 1,
                duration: 1800
            }
        });
    }

    async run(msg, {member}) {
        const reports = await msg.client.reports.getReports(member);
      
        if(!reports) return msg.channel.send(`No reports to delete for ${member.user.tag}`);

        await Report.deleteMany({reportedUser: member.id, guild: member.guild.id})
    
        let embed = new MessageEmbed()
        .setDescription(`${config.success} Cleared reports for ${member.user.tag}`)
        .setColor(config.successColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
        .setTimestamp(Date.now());
        msg.channel.send(embed);
    }
}
