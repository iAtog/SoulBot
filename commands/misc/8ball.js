const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config');

module.exports = class ballCommand extends Command {
    constructor(client) {
        super(client, {
            name:"8ball",
            group: 'misc',
            memberName: '8ball',
            description: 'Gives you a random answer to a question.',
            args: [
                {
                    type:"string",
                    prompt:"What do you want to ask?",
                    key:"question",
                }
            ]
        })
    }
    async run(msg, { question }) {
      if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
          var fortunes = [
                "Yes.",
                "Nope.",
                "Maybe.",
                "No idea."
          ];
          let math = (fortunes[Math.floor(Math.random() * fortunes.length)]);
          let embed = new MessageEmbed()
          .addField("❓ Question", (question))
          .addField("🎱 8ball", `${math}`)
          .setColor(config.defaultColor)
          .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
          .setTimestamp(Date.now());
          msg.embed(embed).catch(err => {
            let embed = new MessageEmbed()
            .setDescription(`${msg.author}, I have encountered an error: \`${err.message}\``)
            .setColor(config.errorColor)
            .setTimestamp(Date.now());
        msg.embed(embed)});
  }
}