const mongoose = require('mongoose');

const levelsSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   guild: String,
   user: String,
   exp: Number
}, { collection: "levels" })

module.exports = mongoose.model("LevelsSchema", levelsSchema)