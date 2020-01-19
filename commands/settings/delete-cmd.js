const {Command} = require('discord.js-commando');
const moment = require('moment');
const SoulUtils = require('../../lib/SoulUtils');
const { MessageEmbed } = require('discord.js')
const config = require ('../../data/config.json')

module.exports = class MessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'delete-cmd',
            group: 'settings',
            memberName: 'delete-cmd',
            userPermissions: ['ADMINISTRATOR'],
            description: 'Enables or disables del  eting the command message once a command is ran.',
            examples: ['message true', 'message false'],
            args: [
                {
                    key: 'enabled',
                    prompt: 'Do you want to enable (true) or disable (false) deleting the command message?',
                    type: 'boolean'
                }
            ]
        });
    }

    async run(msg, {enabled}) {
            if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
            msg.guild.settings.set('delete-cmd', enabled);
              let embed = new MessageEmbed()
              .setDescription(`${config.success} Set command deletion to ${enabled}.`)
              .setColor(config.successColor)
              .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
              .setTimestamp(Date.now());  
            msg.embed(embed)
    }
}
