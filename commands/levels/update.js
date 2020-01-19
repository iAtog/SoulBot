const {Command} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config.json')

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'levels',
            memberName: 'update',
            description: 'Updates all user reward roles on this server. Fixes missing roles.',
            examples: ['update'],
            userPermissions: ['ADMINISTRATOR']
        });
    }

    async run(msg, args) {
        if (await msg.guild.settings.get('delete-cmd', false))
            await msg.delete()
        const members = msg.guild.members;
        members.forEach(member => {
            msg.client.levels.updateUserRoles(member, msg, true);
        })
    }
};