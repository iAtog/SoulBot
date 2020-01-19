const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');


module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roles',
            group: 'dev',
            ownerOnly: true,
            memberName: 'roles',
            description: 'List all the roles in the server.'
        });
    }

    async run(msg) {
    try {
      if (await msg.guild.settings.get('delete-cmd', false))
        await msg.delete()
        let embed = new MessageEmbed()
        .setDescription(msg.guild.roles.map((role) => `${role.name} | ${role.id}`).join('\n'))
        .setColor(config.defaultColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace(".webp", ".png"))
        .setTimestamp()
        msg.embed(embed)
    } catch (err) {
        let embed = new MessageEmbed()
            .setDescription(`${msg.author}, I have encountered an error: \`${err.message}\``)
            .setColor(config.errorColor)
            .setTimestamp(Date.now());
        msg.embed(embed)};
    }
}