import express from "express";
import indexRoutes from "./routes/index.js";

const app = express();

const PORT = 8080;

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Implementación de las rutas
app.use("/api", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server running on Port http://localhost:${PORT}`);
});
