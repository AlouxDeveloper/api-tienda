const Sale = require("../models/Sale");
const Store = require("../models/Store");
const Product = require("../models/Product");

const self = module.exports;

self.create = async (req, res) => {
    try {
        const { products, _store } = req.body;

        const storeExist = await Store.findById(_store);
        if (!storeExist) {
            return res.status(404).send({
                error: "El ID de la tienda proporcionada no existe",
            });
        }

        let totalSale = 0;
        let totalItems = 0;
        let productsToSave = [];

        // function
        for (let i = 0; i < products.length; i ++) {
            const item = products[i];

            const itemExist = await Product.findById(item._product);
            if (!itemExist) {
                return res.status(404).send({
                    error: `El ID del producto ${i} no existe en la tienda`,
                });
            }

            if (itemExist._store.toString() !== _store.toString()) {
                return res.status(403).send({
                    error: `La tienda no tiene el producto '${itemExist.name}' en su stock`
                });
            }

            const subTotal = itemExist.amount * item.quantity;
            totalSale += subTotal;
            totalItems += item.quantity;

            productsToSave.push({
                _product: itemExist._id,
                quantity: item.quantity,
                total: subTotal
            });
        }

        const newSale = new Sale({
            total: totalSale,
            quantity: totalItems,
            _products: productsToSave,
            _store: _store,
            createAt: new Date().getTime()
        });

        const response = await newSale.save();
        res.status(201).send(response);

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).send({ error: "El ID de la tienda o no existe" });
        }

        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.retrieve = async (req, res) => {
    try {
        const response = await Sale.find();
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.update = async (req, res) => {
    try {
        const _id = req.params.SALE_ID;
        const { total, quantity, _products } = req.body;

        if (total === undefined && quantity === undefined && !_products) {
            return res.status(400).send({ error: "Se necesita total, quantity o _products" });
        }

        const updateData = {
            lastUpdate: new Date().getTime()
        };

        if (total !== undefined) updateData.total = total;
        if (quantity !== undefined) updateData.quantity = quantity;
        if (_products) updateData._products = _products;

        const response = await Sale.findByIdAndUpdate(
            _id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!response) {
            return res.status(404).send({ error: "Venta no encontrada." });
        }

        res.status(200).send(response);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

self.detail = async (req, res) => {
    try {
        const _id = req.params.SALE_ID;

        const response = await Sale.findById(_id)
            .populate({ 
                path: "_store", 
                select: "name" 
            })
            .populate({
                path: "_products._products",
                select: "name amount"
            });

        if (!response) {
            return res.status(404).send({ error: "Venta no encontrada." });
        }

        res.status(200).send(response);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).send({ error: "ID de venta no válido." });
        }
        console.error(error);
        res.status(400).send({ error: error.message });
    }
};

self.delete = async (req, res) => {
    try {
        const _id = req.params.SALE_ID;

        const response = await Sale.deleteOne({ _id });

        if (response.deletedCount === 0) {
            return res.status(404).send({ error: "La compra no existe" });
        }

        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

