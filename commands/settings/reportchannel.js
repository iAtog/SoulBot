const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config.json')

module.exports = class WelcomeChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reportchannel',
			group: 'settings',
			memberName: 'reportchannel',
			description: 'Set the reports channel.',
      userPermissions: ['ADMINISTRATOR'],
      args: [
         {
           key: "channel",
           type: "text-channel",
           prompt: "What channel would you like reports to be sent to?"
         }
      ]
		});
	}

hasPermission(msg) {
        if (!this.client.isOwner(msg.author) && (msg.guild || {}).ownerID != msg.author.id) return 'Only the bot or server owner(s) may use this command.';
        return true;
}

	async run(msg, {channel}) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
    msg.guild.settings.set("reportChannel", channel.id)
    let embed = new MessageEmbed()
       .setDescription(`${config.success} Reports channel has been set to ${channel}.`)
       .setColor(config.successColor)
       .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
       .setTimestamp(Date.now());  
    msg.embed(embed)
  }
}