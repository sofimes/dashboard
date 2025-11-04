const { fetchProductByASIN } = require("../services/amazonService");
const Product = require("../models/Product");
const syncProduct = async (req, res) => {
  console.log("request body", req.body);

  const asin = req.body.asin || req.query?.asin || req.params?.asin;

  if (!asin) return res.status(400).json({ error: "ASIN required" });

  try {
    const product = await fetchProductByASIN(asin);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const q = req.query.q ? req.query.q.trim() : "";
    const offset = (page - 1) * limit;

    const where = {};
    // simple text filter on title or asin if q provided
    if (q) {
      // Sequelize where with iLike requires Sequelize object; use raw query-friendly approach:
      const { Op } = require("sequelize");
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { asin: { [Op.iLike]: `%${q}%` } },
        { brand: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const rows = await Product.findAll({
      where,
      limit,
      offset,
      order: [["updated_at", "DESC"]],
    });

    return res.json(rows);
  } catch (err) {
    console.error("listProducts error:", err);
    return res.status(500).json({ error: "Server error listing products" });
  }
};
const getProductByASIN = async (req, res) => {
  try {
    const asin = req.params.asin;
    const p = await Product.findOne({ where: { asin } });
    if (!p) return res.status(404).json({ error: "Not found" });
    return res.json(p);
  } catch (err) {
    console.error("getProductByASIN error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { syncProduct, listProducts, getProductByASIN };
