const { stripIndents } = require('common-tags');
const { Command } = require('discord.js-commando');
const config = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class ListGroupsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'groups',
			aliases: ['list-groups', 'show-groups'],
			group: 'util',
			memberName: 'groups',
			description: 'Lists all command groups.',
			details: 'Only administrators may use this command.',
			guarded: true
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg) {
        let embed = new MessageEmbed()
        .setDescription(`${this.client.registry.groups.map(grp => `« ${grp.isEnabledIn(msg.guild) ? config.success : config.error} »   ${grp.name}`).join('\n')}`)
        .setColor(config.defaultColor)
        return msg.embed(embed)
	}
};