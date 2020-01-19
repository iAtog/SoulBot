const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config.json')

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util',
			memberName: 'prefix',
      userPermissions: ['ADMINISTRATOR'],
			description: 'Shows or sets the command prefix.',
			format: '[prefix/"default"/"none"]',
			args: [
				{
					key: 'prefix',
					prompt: 'What would you like to set the bot\'s prefix to?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
		// Just output the prefix
		if(!args.prefix) {
            const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
            let embed = new MessageEmbed()
            .setDescription(`${prefix ? `The current prefix is "${prefix}". ${msg.anyUsage("prefix [prefix]")}` : `There is no command prefix. Set one by using ${msg.anyUsage("prefix [prefix]")}`}`)
            .setColor(config.defaultColor)
            .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
      .setTimestamp(Date.now());
			return msg.embed(embed);
		}
		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;
		if(lowercase === 'default') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `${this.client.commandPrefix}` : 'no prefix';
                response = `Set the command prefix to default (${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
			response = prefix ? `Set the command prefix to "${args.prefix}".` : `Removed the command prefix entirely. Use ${msg.anyUsage("command")} instead.`;
		}
        let embed = new MessageEmbed()
        .setDescription(`${config.success} ${response}`)
        .setColor(config.successColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
      .setTimestamp(Date.now());
		await msg.embed(embed);
		return null;
	}
};
