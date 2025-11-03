const express = require("express");
require("dotenv").config();
const sequelize = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("databse synced");
    app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
  })
  .catch((err) => console.log("Database sync error:", err));
