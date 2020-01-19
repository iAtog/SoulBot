const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');

module.exports = class helpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'command-list'],
      group: 'misc',
      memberName: 'help',
      description: 'Displays a list of available commands, or detailed information for a specific command.',
      guarded: true,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'command',
          default: ''
        }
      ]
    })
  }
  async run (msg, { command }) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
    msg.react('618565216237518858')
    if (!command) {
      const embed = new MessageEmbed()
        .setTitle('Commands')
        .setColor(config.defaultColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL(). replace('.webp', '.png'))
        .setTimestamp(Date.now());
      for (const group of this.client.registry.groups.values()) {
        function categoryEmoji(category) {
          const emoji = {
            General: "📜",
            Moderation: "🔨",
            Images: "📷",
            Miscellaneous: "❔",
            Levels: "<:up:643249191631454248>",
            Music: "🔊",
            Developer: "♦️",
            Settings: "⚙️",
            Commands: "📝",
            Utility: "🛠️"
          }
          return emoji[category]
        }
        embed.addField(
          await categoryEmoji(group.name) + ` ${group.name}`,
          group.commands.map(cmd => `${cmd.name}`).join(", ") || 'None'
        )
      }
      try {
        const msgs = []
        msgs.push(await msg.direct({ embed }))
        return msgs
      } catch (err) {
        let embed = new MessageEmbed()
        .setDescription(`${config.error} Failed to send DM. You probably have DMs disabled.`)
        .setColor(config.errorColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace('.webp', '.png'))
        .setTimestamp(Date.now());
        return msg.embed(embed)
      }
    }
    const embed = new MessageEmbed()
      .setTitle(`Command **${command.name}**${command.guildOnly ? ' (Usable only in servers)' : ''}`)
      .setColor(config.defaultColor)
      .addField('Description', `${command.description}`)
      .addField('Format', `${msg.anyUsage(`${command.name} ${command.format || ''}`)}`)
      .addField('Aliases', `${command.aliases.join(', ') || 'None'}`)
      .addField('Group', `${command.group.name}`)
      .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace('.webp', '.png'))
      .setTimestamp(Date.now());
     const msgs = []
     msgs.push(await msg.direct({ embed }).catch(err => {
     let embed = new MessageEmbed()
        .setDescription(`${config.error} Failed to send DM. You probably have DMs disabled.`)
        .setColor(config.errorColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace('.webp', '.png'))
        .setTimestamp(Date.now());
     return msg.embed(embed)
    }))
  }
}