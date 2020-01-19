const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'report',
            group: 'moderation',
            memberName: 'report',
            description: 'Report a user.',
            examples: ['report @User'],
            args: [
                {
                    key: 'member',
                    prompt: 'Please mention who you want to report.',
                    error: "That is not a valid user, please try again (ex:@User).",
                    type: 'member'
                },
                {
                    key: "reason",
                    prompt: "Please provide a reason.",
                    type: "string"
                }
            ]  
        });
    }

    async run(msg, {member, reason}) {
      const channel = member.guild.settings.get("reportChannel");
      const reportChannel = member.guild.channels.get(channel);
      if(!channel || !reportChannel) {
        let embed = new MessageEmbed()
        .setTitle(`${config.error} A reports channel hasn't been set yet.`)
        .setDescription(`An admin can set one using **$reportchannel <channel>**`)
        .setColor(config.errorColor)
        return msg.embed(embed);
      } else {
      let embed = new MessageEmbed()
      .setTitle("New Report")
      .addField(`Reported User`, `${member} | ID: ${member.id}`)
      .addField(`Reported By`, `${msg.author} | ID: ${msg.author.id}`)
      .addField(`Report Reason`, `${reason}\n\n[Jump To Message](${msg.url})`)
      .setThumbnail(member.user.displayAvatarURL().replace('.webp', '.png'))
      .setColor(config.defaultColor)
      await reportChannel.send(embed).then(async() => {
        await msg.client.reports.submitReport(msg.guild, msg.author, member, reason)
        let successEmbed = new MessageEmbed()
        .setTitle(`${config.success} Report sent.`)
        .setColor(config.successColor)
        await msg.channel.send(successEmbed);
      }).catch(err => msg.channel.send(`I have encountered an error while trying to send the report to the reports channel. \`${err}\``))
    }
  }
}