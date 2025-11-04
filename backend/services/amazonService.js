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
      // timeout: 15000,
    });

    const data = response.data.product;
    if (!data) {
      console.error("Product not found in Rainforest response:", response.data);
      throw new Error("Product not found");
    }
    let price = 0;
    let currency = "USD";

    if (data.buybox_price) {
      price = data.buybox_price.value;
      currency = data.buybox_price.currency || "USD";
    } else if (data.variants && data.variants.length > 0) {
      const currentVariant =
        data.variants.find((v) => v.is_current_product) || data.variants[0];
      if (currentVariant?.price) {
        price = currentVariant.price.value || 0;
        currency = currentVariant.price.currency || "USD";
      }
    }
    const [product, created] = await Product.upsert(
      {
        asin: data.asin,
        title: data.title || "",
        brand: data.brand || "",
        category: data.categories_flat || "",
        price,
        currency,
        image_url: data.main_image?.link || "",
        product_url: data.link || "",
        rating: data.rating || 0,
        review_count: data.reviews_total || 0,
        sales_rank: data.sales_rank || null,
        metadata: data,
        description: data.description || "",
      },
      { returning: true }
    );
    return product;
  } catch (error) {
    console.error("Error fetching product here", error.message);
    throw error;
  }
}

module.exports = { fetchProductByASIN };
