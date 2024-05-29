import express from "express";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

const PORT = 5000;

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implementación de las rutas
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);


app.listen(PORT, () => {
  console.log(`Server running on Port http://localhost:${PORT}`);
});
