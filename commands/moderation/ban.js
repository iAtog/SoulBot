const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const config = require("../../data/config");

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      group: "moderation",
      memberName: "ban",
      userPermissions: ['BAN_MEMBERS'],
      clientPermissions: ['BAN_MEMBERS'],
      description: "Ban a user.",
      examples: ["ban @User"],
      aliases: ["ban", "seeya", "b"],
      args: [
        {
          key: "user",
          prompt: "Please mention who you want to ban.",
          error: "That is not a valid user, please try again (ex:@User).",
          type: "user"
        },
        {
          key: "reason",
          prompt: "Please provide a reason.",
          type: "string"
        }
      ]
    });
  }

  async run(msg, { user, reason }) {
    try {
      if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
      msg.guild.members.fetch(user).then(member => {
        member.ban({reason: `${reason} | Issuer: ${msg.author.username}#${msg.author.discriminator}`}).then(member => {
            let embed = new MessageEmbed()
              .setColor(config.successColor)
              .setDescription(`${config.success} ${member.user} has been banned.`)
              .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace(".webp", ".png"))
              .setTimestamp(Date.now());
            msg.say(embed);
          });
      });
    } catch (err) {
      let embed = new MessageEmbed()
        .setDescription(`${msg.author}, I have encountered an error: \`${err.message}\``)
        .setColor(config.errorColor)
        .setTimestamp(Date.now());
      msg.embed(embed);
    }
  }
};
