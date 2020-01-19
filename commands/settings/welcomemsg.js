const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config.json')

module.exports = class WelcomeChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'welcomemsg',
			group: 'settings',
			memberName: 'welcomemsg',
			description: 'Set the welcoming msg.',
      userPermissions: ['ADMINISTRATOR'],
      args: [
         {
           key: "text",
           type: "string",
           prompt: `What would you like welcome messages to be ? ("$\{user}" = User's tag)`
         }
      ]
		});
	}

hasPermission(msg) {
        if (!this.client.isOwner(msg.author) && (msg.guild || {}).ownerID != msg.author.id) return 'Only the bot or server owner(s) may use this command.';
        return true;
}

	async run(msg, {text}) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
    msg.guild.settings.set("welcomeMsg", text)
    let embed = new MessageEmbed()
       .setDescription(`${config.success} Welcoming message has been set to "**${text}**".`)
       .setColor(config.successColor)
       .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
       .setTimestamp(Date.now());  
    msg.embed(embed)
  }
}