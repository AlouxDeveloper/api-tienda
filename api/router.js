const express = require("express");
const store = require("./controllers/store");
const product = require("./controllers/product");
const sale = require("./controllers/sale");

const router = express.Router();

router.post("/store", store.create);
router.get("/store", store.retrieve);
router.patch("/store/:STORE_ID", store.update);
router.get("/store/:STORE_ID", store.detail);
router.delete("/store/:STORE_ID", store.delete);

router.post("/product", product.create);
router.get("/product", product.retrieve);
router.patch("/product/:PRODUCT_ID", product.update);
router.get("/product/:PRODUCT_ID", product.detail);
router.delete("/product/:PRODUCT_ID", product.delete);

router.post("/sale", sale.create);
router.get("/sale", sale.retrieve);
router.patch("/sale/:SALE_ID", sale.update);
router.get("/sale/:SALE_ID", sale.detail);
router.delete("/sale/:SALE_ID", sale.delete);

module.exports = router;