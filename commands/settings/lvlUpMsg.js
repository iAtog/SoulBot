const {Command} = require('discord.js-commando');
const moment = require('moment');
const SoulUtils = require('../../lib/SoulUtils');
const { MessageEmbed } = require('discord.js')
const config = require ('../../data/config.json')

module.exports = class MessageCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lvlupmsg',
            group: 'settings',
            memberName: 'lvlupmsg',
            userPermissions: ['ADMINISTRATOR'],
            description: 'Enables or disables the levelup message.',
            examples: ['message true', 'message false'],
            args: [
                {
                    key: 'enabled',
                    prompt: 'Do you want to enable (true) or disable (false) the message?',
                    type: 'boolean'
                }
            ]
        });
    }

    hasPermission(msg) {
        if (!this.client.isOwner(msg.author) && (msg.guild || {}).ownerID != msg.author.id) return 'Only the bot or server owner(s) may use this command.';
        return true;
    }

    async run(msg, {enabled}) {
            if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
            msg.guild.settings.set('message', enabled);
              let embed = new MessageEmbed()
              .setDescription(`${config.success} Set level up message to ${enabled}.`)
              .setColor(config.successColor)
              .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
              .setTimestamp(Date.now());  
            msg.embed(embed)
    }
}
