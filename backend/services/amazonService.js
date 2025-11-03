const axios = require("axios");
const Product = require("../models/Product");
require("dotenv").config();

const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;

async function fetchProductByASIN(asin) {
  try {
    const response = await axios.get(`https://api.rainforestapi.com/request`, {
      params: {
        api_key: RAINFOREST_API_KEY,
        type: "product",
        amazon_domain: "amazon.com",
        asin,
      },
    });

    const data = response.data.product;

    const [product, created] = await Product.upsert(
      {
        asin: data.asin,
        title: data.title || "",
        brand: data.brand || "",
        category: data.categories_flat || "",
        price: data.buybox_price?.value || 0,
        currency: data.buybox_price?.currency || "USD",
        image_url: data.main_image?.link || "",
        product_url: data.link || "",
        rating: data.rating || 0,
        review_count: data.reviews_total || 0,
        sales_rank: data.sales_rank || null,
        metadata: data,
      },
      { returning: true }
    );
    return product;
  } catch (error) {
    console.error("Error fetching product", error.message);
    throw error;
  }
}

module.exports = { fetchProductByASIN };
