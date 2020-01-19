const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config.json')

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			group: 'misc',
			memberName: 'invite',
			description: 'Sends a bot invite link.',
		});
	}

	async run(msg, args) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
    let embed = new MessageEmbed()
    .setColor(config.defaultColor)
    .setDescription('[Invite](https://discordapp.com/oauth2/authorize?client_id=(ID)&scope=bot&permissions=8)');
    msg.embed(embed);
  }
}