const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const config = require("../../data/config");

module.exports = class ClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      group: "moderation",
      memberName: "clear",
      description: "Clear the current channel of maximum 100 messages.",
      args: [
        {
          key: "count",
          prompt: "Please provide how many message you want to delete. (Max: 100)",
          error: "You have provided an invalid number of messages to delete. (Max: 100)",
          max: 100,
          min: 1,
          type: "integer"
        }
      ]
    });
  }

  async run(msg, { count }) {
    try {
      const messages = await msg.channel.messages.fetch({ limit: count })
      .then(messages => { 
        const fetchedMsgs = messages.filter(messages => !messages.pinned)
        msg.channel.bulkDelete(fetchedMsgs, true).then(msgs => {
           let embed = new MessageEmbed()
           .setColor(config.successColor)
           .setDescription(config.success + " Cleared " + msgs.size + " messages.");
           msg.channel.send(embed).then(embed => {embed.delete({timeout: 5000})
          })
        })      
      })
    } catch (err) {
      return msg.reply(
        "There are no messages younger than two weeks that can be deleted."
      );
    }
  }
};
