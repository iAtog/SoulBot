const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');

const humanLevels = {
	0: 'None',
	1: 'Low',
	2: 'Medium',
	3: '(╯°□°）╯︵ ┻━┻',
	4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

module.exports = class ServerInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'serverinfo',
			aliases: ['server'],
			group: 'misc',
			memberName: 'server',
			description: 'Get info on the server.',
			details: `Get detailed information on the server.`,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
		let embed = new MessageEmbed()
			.setColor(`${config.defaultColor}`)
      .addField('🔒 __**Channels**__', `• ${msg.guild.channels.filter(ch => ch.type === 'text').size} Text, ${msg.guild.channels.filter(ch => ch.type === 'voice').size} Voice\n• AFK: ${msg.guild.afkChannelID ? `<#${msg.guild.afkChannelID}> after ${msg.guild.afkTimeout / 60}min` : 'None.'}`)
      .addField('🚶 __**Member Info**__', `• Members: ${msg.guild.memberCount}\n• Owner: ${msg.guild.owner.user.tag}`, true)
			.addField('❓ __**Other**__', `• Roles: ${msg.guild.roles.size}\n• Region: ${msg.guild.region}\n• Created at: ${msg.guild.createdAt.toUTCString()}\n• Verification Level: ${humanLevels[msg.guild.verificationLevel]}`)
			.setThumbnail(msg.guild.iconURL() .replace('.webp', '.png'))
			.setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
      .setTimestamp(Date.now());
    msg.embed(embed);
	}
}
