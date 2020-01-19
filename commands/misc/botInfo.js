const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');

module.exports = class BotInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name:"botinfo",
            group: 'misc',
            memberName: 'botinfo',
            description: 'Returns bot information.',
        })
    }
        async run(msg) {
            if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
            let createdTime = new Date(this.client.user.createdTimestamp).toUTCString();
            let embed = new MessageEmbed()
                .setColor(config.defaultColor)
                .setThumbnail(this.client.user.avatarURL({size: 2048}).replace('.webp', '.png'))
                .addField("🤖 General", `• Created On: ${createdTime}\n• Default Prefix: $\n• Website: (On you hosted)`)
                .addField("📄 Support", `• Bot Owner: Atog.#0001\n• Support: [Discord Server](https://discord.gg/pka6Kn2)`)
                .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
                .setTimestamp(Date.now());
            msg.embed(embed)
        }
}
