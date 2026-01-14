const Store = require("../models/Store");
const Product = require("../models/Product");
const Sale = require("../models/Sale");

const self = module.exports;

self.create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({
                error: "El campo name es obligatorio"
            });
        }

        const newStore = new Store({
            name,
            createAt: new Date().getTime()
        });

        const response = await newStore.save();
        res.status(200).send(response);

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.retrieve = async (req, res) => {
    try {
        const response = await Store.find();
        res.status(200).send(response);
    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.update = async (req, res) => {
    try {
        const _id = req.params.STORE_ID;
        const { name } = req.body;

        if (!name) {
            return res.status(400).send({ 
                error: "Solo se permite actualizar el nombre (field 'name')." 
            });
        }

        const response = await Store.findByIdAndUpdate(
            _id, 
            { $set: {
                    name: name,
                    lastUpdate: new Date().getTime() 
                }
            }
        );

        if (!response) {
            return res.status(404).send({ error: "Tienda no encontrada." });
        }

        res.status(200).send(response);

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

self.detail = async (req, res) => {
    try {
        const _id = req.params.STORE_ID;

        let response = await Store.findById(_id).lean();

        if (!response) {
            return res.status(404).send({ error: "Tienda no encontrada." });
        }

        const listaProductos = await Product.find({ _store: _id })
            .select("name amount");
        
        const listaVentas = await Sale.find({ _store: _id })
            .select("total quantity createdAt");

        response._products = listaProductos;
        response._sales = listaVentas;

        res.status(200).send(response);

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
};

self.delete = async (req, res) => {
    try {
        const _id = req.params.STORE_ID;

        const response = await Store.deleteOne({ _id });

        if (response.deletedCount === 0) {
            return res.status(404).send({ error: "La tienda no existe" });
        }

        res.status(200).send(response);

    } catch (error) {
        console.error(error);
        res.status(400).send({ error: error.message });
    }
}

