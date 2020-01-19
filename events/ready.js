exports.ready = async function ready(client) {
  client.user.setPresence({activity: {name: `${client.guilds.size} servers | ${client.commandPrefix}help`, type: "WATCHING"},status: "dnd"});
  console.log(`[Soul] Logged on as ${client.user.tag}`);    
};
