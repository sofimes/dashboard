// backend/src/models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    asin: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    title: { type: DataTypes.TEXT },
    brand: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2) },
    currency: { type: DataTypes.STRING(10) },
    image_url: { type: DataTypes.TEXT },
    product_url: { type: DataTypes.TEXT },
    rating: { type: DataTypes.DECIMAL(3, 2) },
    review_count: { type: DataTypes.INTEGER },
    sales_rank: { type: DataTypes.BIGINT },
    price_history: { type: DataTypes.JSONB },
    metadata: { type: DataTypes.JSONB },
  },
  {
    tableName: "products",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Product;
