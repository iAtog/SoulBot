const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config.json')

module.exports = class WelcomeChannelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'autorole',
			group: 'settings',
			memberName: 'autorole',
      userPermissions: ['ADMINISTRATOR'],
			description: 'Set the role that will be assigned to a user when they join.',
      args: [
         {
           key: "role",
           type: "role",
           prompt: "What role would you like to be sent assigned when a member joins? (none/@role)",
           oneOf: [arg => arg.type == "role", "none"]
         }
      ]
		});
	}
  
  hasPermission(msg) {
        if (!this.client.isOwner(msg.author) && (msg.guild || {}).ownerID != msg.author.id) return 'Only the bot or server owner(s) may use this command.';
        return true;
  }

	async run(msg, {role}) {
    if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
    var response = ""
    if(role == "none"){
      msg.guild.settings.remove("autoRole")
      response = `${config.success} Auto-Role has been disabled.`
    } else {
      msg.guild.settings.set("autoRole", role.id)
      response = `${config.success} Auto-Role has been set to ${role}`
    }
    let embed = new MessageEmbed()
       .setDescription(response)
       .setColor(config.successColor)
       .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
       .setTimestamp(Date.now());  
    msg.embed(embed)
  }
}