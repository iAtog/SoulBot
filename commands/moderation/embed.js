const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config');
const { stripIndents } = require('common-tags')

module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'embed',
            group: 'moderation',  
            memberName: 'embed',
            description: 'Generate an embed with the text provided.',
            args: [
                {
                    key: 'container',
                    prompt: 'What do you want the embed to contain?',
                    type: 'string'
                }
            ]
        });
    }

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

    async run(msg, {container}) {
     try {
        await msg.delete()
       let embed = new MessageEmbed()
            .setColor(config.defaultColor)
            .setDescription(container)
        msg.channel.send(embed);
    } catch (err) {
        let embed = new MessageEmbed()
            .setDescription(`${msg.author}, I have encountered an error: \`${err.message}\``)
            .setColor(config.errorColor)
            .setTimestamp(Date.now());
        msg.embed(embed)};
    }
};