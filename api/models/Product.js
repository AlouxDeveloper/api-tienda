const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, maxlength: 100, required: true },
  amount: { type: Number, required: true },
  _store: { type: mongoose.Schema.Types.ObjectId, ref: "Stores" },
  createAt: { type: Number, required: true },
  lastUpdate: { type: Number },
});

const Product = mongoose.model("Products", productSchema);
module.exports = Product;
