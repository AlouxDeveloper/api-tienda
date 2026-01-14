const { ObjectID } = require("mongodb");
const mongoose = require("mongoose");

const saleSchema = mongoose.Schema({
  total: { type: Number, required: true },
  quantity: { type: Number, required: true },
  _products: [
    {
      _products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
      quantity: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  _store: { type: mongoose.Schema.Types.ObjectId, requied: true, ref: "Stores"},
  createAt: { type: Number, required: true },
  lastUpdate: { type: Number },
});

const Sale = mongoose.model("Sales", saleSchema);
module.exports = Sale;
