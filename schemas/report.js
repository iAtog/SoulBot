const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   guild: String, 
   userReporting: String, 
   reportedUser: String, 
   reason: String,
   time: Date
}, {collection: "reports"})

module.exports = mongoose.model("Report", reportSchema)