const express = require("express");
const router = express.Router();
const { syncProduct } = require("../controllers/ProductController");

router.post("/sync", syncProduct);
module.exports = router;
