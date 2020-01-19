const { oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const config = require('../../data/config.json');
const { MessageEmbed } = require('discord.js');

module.exports = class DisableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'cmd-off', 'command-off'],
			group: 'util',
			memberName: 'disable',
			description: 'Disables a command or command group.',
			details: oneLine`
				The argument must be the name/ID (partial or whole) of a command or command group.
				Only administrators may use this command.
			`,
			examples: ['disable util', 'disable Utility', 'disable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Which command or group would you like to disable?',
					type: 'group|command'
				}
			]
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(msg.author);
	}

	run(msg, args) {
        var response = ""
        var color = ""
		if(!args.cmdOrGrp.isEnabledIn(msg.guild, true)) {
            response = `${config.error} The ${args.cmdOrGrp.name} ${args.cmdOrGrp.group ? 'command' : 'group'} is already disabled.`
            color = config.errorColor
		} else if(args.cmdOrGrp.guarded) {
            response = `${config.error} You cannot disable the ${args.cmdOrGrp.name} ${args.cmdOrGrp.group ? 'command' : 'group'}.`
            color = config.errorColor
		} else {
            args.cmdOrGrp.setEnabledIn(msg.guild, false);
            response = (`${config.success} Disabled the ${args.cmdOrGrp.name} ${args.cmdOrGrp.group ? 'command' : 'group'}.`);
            color = config.successColor
        }
        let embed = new MessageEmbed()
        .setColor(color)
        .setDescription(response)
        return msg.embed(embed)
	}
};