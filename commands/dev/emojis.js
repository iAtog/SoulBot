const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');


module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emojis',
            group: 'dev',
            ownerOnly: true,
            memberName: 'emojis',
            description: 'List all the emojis in the server.',
            examples: ['emojis'],
            aliases: ['emojis']
        });
    }

    async run(msg) {
    try {
      if (await msg.guild.settings.get('delete-cmd', false))
        await msg.delete()
        let embed = new MessageEmbed()
        .setDescription(msg.guild.emojis.map((e, x) => `${e} ` + " | " + "ID: " + (e) + ' | ' + `\`:${e.name}:\``).join('\n'))
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