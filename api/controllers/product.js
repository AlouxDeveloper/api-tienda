const Product = require("../models/Product");
const Store = require("../models/Store");

const self = module.exports;

self.create = async (req, res) => {
    try {
        const { name, amount, _store } = req.body;

        if (!name || amount === undefined, !_store) {
            return res.status(400).send({
                error: "Se requieren los campos name, amount y _store"
            });
        }

        if (typeof amount !== 'number' || amount < 0){
            return res.status(400).send({
                error: "Ingresa un precio numerico o mayor a 0 para amount"
            });
        }

        const storeExist = await Store.findById(_store);

        if (!storeExist) {
            return res.status(404).send({
                error: "El ID de la tienda proporcionada no existe",
            });
        }

        const newProduct = new Product({
            name,
            amount,
            _store,
            createAt: new Date().getTime()
        });

        const response = await newProduct.save();
        res.status(200).send(response);

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
        const response = await Product.find();
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.update = async (req, res) => {
    try {
        const _id = req.params.PRODUCT_ID;
        const { name, amount } = req.body;

        if (!name && amount === undefined) {
            return res.status(400).send({ error: "Se neecesita name o amount para actualizar" });
        }

        if (typeof amount !== 'number' || amount < 0){
            return res.status(400).send({
                error: "Ingresa un precio numerico o mayor a 0 para amount"
            });
        }

        const updateData = {
            lastUpdate: new Date().getTime()
        };

        if (name) updateData.name = name;
        if (amount !== undefined) updateData.amount = amount;

        const response = await Product.findByIdAndUpdate(
            _id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        );

        if (!response) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        res.status(200).send(response);

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.detail = async (req, res) => {
    try {
        const _id = req.params.PRODUCT_ID;

        const response = await Product.findById(_id)
            .populate({ 
                path: "_store", 
                select: { name: true, createAt: true } 
            });

        if (!response) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        res.status(200).send(response);
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).send({ error: "El ID del producto no es válido." });
        }
        
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.delete = async (req, res) => {
    try {
        const _id = req.params.PRODUCT_ID;

        const response = await Product.deleteOne({ _id });

        if (response.deletedCount === 0) {
            return res.status(404).send({ error: "El producto no existe" });
        }
        
        res.status(200).send(response);

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

