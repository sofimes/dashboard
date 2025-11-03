const { fetchProductByASIN } = require("../services/amazonService");

const syncProduct = async (req, res) => {
  console.log("request body", req.body);

  const asin = req.body?.asin || req.query?.asin || req.params?.asin;

  if (!asin) return res.status(400).json({ error: "ASIN required" });

  try {
    const product = await fetchProductByASIN(asin);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { syncProduct };
