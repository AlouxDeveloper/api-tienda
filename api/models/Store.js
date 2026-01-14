const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  name: { type: String, maxlength: 50, required: true },
  createAt: { type: Number, required: true },
  lastUpdate: { type: Number },
});

const Store = mongoose.model("Stores", storeSchema);
module.exports = Store;