const mongoose = require("mongoose");
const config = require('../data/config.json')
const path = require("path");
const fs = require("fs");

class db {
  constructor(client) {
    this.client = client;

      mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }).then(db => {
        this.connection = db;
        console.log("[Soul] Database Loaded")
      }
    )
  }
}

module.exports = db;
