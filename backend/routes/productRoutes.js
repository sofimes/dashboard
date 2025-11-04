const express = require("express");
const router = express.Router();
const {
  syncProduct,
  listProducts,
  getProductByASIN,
} = require("../controllers/ProductController");

router.post("/sync", syncProduct);

router.get("/", listProducts);

router.get("/:asin", getProductByASIN);

module.exports = router;
