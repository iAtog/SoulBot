const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config'),
      moment = require('moment');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name:"userinfo",
            group: 'misc',
            memberName: 'userinfo',
            description: 'Gathers information about a user.',
            args: [
                {
                    type:"member",
                    prompt:"Please provide a user.",
                    key:"member",
                    default: msg => msg.member
                }
            ]
        })
    }
    
    async run(msg, {member}) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
    if(msg.channel.type === 'dm') {
            let user = msg.author;
            let createdTime = new Date(msg.author.createdTimestamp).toUTCString();
            let embed = new MessageEmbed()
                .setThumbnail(msg.author.avatarURL().replace('.webp', '.png'))
                .addField('🚶 __**User Info**__', `• Username: ${user.username}#${user.discriminator}\n• Created At: ${createdTime}\n• ID: ${user.id}\n• ${user.bot ? 'Account Type: Bot' : 'Account Type: User'}`)
                .setColor(config.defaultColor)
                .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace('.webp', '.png'))
                .setTimestamp(Date.now());
            msg.embed(embed);
    } else {
            let user = member.user;
            let createdTime = new Date(user.createdTimestamp).toUTCString();
            let joinedTime = new Date(member.joinedAt).toUTCString();
            let embed = new MessageEmbed()
                .setThumbnail(user.avatarURL().replace('.webp', '.png'))
                .addField('🛡️ __**Guild-based Info**__', `• Nickname: ${member.nickname ? member.nickname : 'No nickname'}\n• Roles: ${member.roles.map(roles => `\`${roles.name}\``).join(', ')}\n• Joined at: ${joinedTime}\n• Last Message: ${user.lastMessage}`)
                .addField('🚶 __**User Info**__', `• Username: ${user.username}#${user.discriminator}\n• Created At: ${createdTime}\n• ID: ${user.id}\n• ${user.bot ? 'Account Type: Bot' : 'Account Type: User'}`)
                .setColor(config.defaultColor)
                .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace('.webp', '.png'))
                .setTimestamp(Date.now());
            msg.embed(embed);
        }
    }
}
