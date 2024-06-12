import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import indexRoutes from "./routes/index.js";
import __dirname from "./dirname.js";
import path from "path";
import { productManager } from "./managers/ProductManager.js";

const app = express();

const PORT = 8080;

// Configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// Configuración de handlebars
app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
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

  // Escuchar eventos de creación de productos
  socket.on('createProduct', async (product) => {
      try {
          await productManager.addProduct(product);
          io.emit('updateProducts', productManager.getProducts());
      } catch (error) {
          socket.emit('productError', error.message);
      }
  });

  // Escuchar eventos de eliminación de productos
  socket.on('deleteProduct', async (productId) => {
      try {
          await productManager.deleteProduct(productId);
          io.emit('updateProducts', productManager.getProducts());
      } catch (error) {
          socket.emit('productError', error.message);
      }
  });

  socket.on('disconnect', () => {
      console.log('Cliente desconectado');
  });
});
