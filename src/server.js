import express from "express";
import connectDB from './config/db.js';
import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { Server } from "socket.io";
import indexRoutes from "./routes/index.js";
import __dirname from "./dirname.js";
import path from "path";
import { productModel as Product } from './models/product.model.js';
import { productManager } from "./managers/ProductManager.js";

const app = express();

const PORT = 8080;

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Conexión a la base de datos
connectDB();

// Configuración de handlebars
app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

// Seteo del engine en express
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

// Implementación de las rutas
app.use("/", indexRoutes);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Configuración del Socket.io
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Emitir los productos al cliente que se conecta
  async function getProducts() {
    const products = await Product.find();
    socket.emit('updateProducts', products);
  }
  getProducts();

  // Escuchar eventos de creación de productos
  socket.on('createProduct', async (product) => {
      try {
          await productManager.addProduct(product);
          const products = await Product.find();
          io.emit('updateProducts', products);
      } catch (error) {
          socket.emit('productError', error.message);
      }
  });

  // Escuchar eventos de eliminación de productos
  socket.on('deleteProduct', async (productId) => {
      try {
          await productManager.deleteProduct(productId);
          const products = await Product.find();
          io.emit('updateProducts', products);
      } catch (error) {
          socket.emit('productError', error.message);
      }
  });

  socket.on('disconnect', () => {
      console.log('Cliente desconectado');
  });
});
