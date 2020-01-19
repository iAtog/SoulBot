const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   guild: String,
   settings: Object
}, {collection: "settings"})

module.exports = mongoose.model("settings", settingsSchema)