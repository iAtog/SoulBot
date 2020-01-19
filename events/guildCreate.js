exports.guildCreate = async function guildCreate(guild, client){
  client.user.setPresence({activity: {name: `${client.guilds.size} servers | ${client.commandPrefix}help`, type: "WATCHING"},status: "dnd"});
}