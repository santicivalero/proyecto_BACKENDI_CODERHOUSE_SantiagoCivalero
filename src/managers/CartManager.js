import fs from "fs";
import __dirname from "../dirname.js";
import path from "path";
import Cart from "../classes/Cart.js";
import { productManager } from "./ProductManager.js";
import CustomError from "../classes/CustomError.js";

class CartManager {
  constructor(path) {
    this.path = path;

    if (fs.existsSync(this.path)) {
      try {
        this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      } catch (error) {
        this.carts = [];
      }
    } else {
      this.carts = [];
    }
  }

  async createCart() {
    const latestId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 1;
    const newCart = new Cart(latestId);

    this.carts.push(newCart);

    try {
      this.writeToFile();
      console.log("Se creó el carrito correctamente");
      return newCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCart(cid, pid, quantity) {
    if (quantity === null || quantity === undefined) {
      quantity = 1;
    }
    quantity = Number(quantity);

    const cartIndex = this.carts.findIndex((cart) => cart.id === Number(cid));

    if (cartIndex === -1) {
      throw new CustomError("No se encontró el carrito", 404);
    }

    const product = await productManager.getProductById(pid);
    if (!product) {
      throw new CustomError("No existe el producto", 404);
    }

    const productIndex = this.carts[cartIndex].products.findIndex(
      (product) => product.id === Number(pid)
    );
    
    if (productIndex === -1) {
      this.carts[cartIndex].products.push({
        id: pid,
        quantity,
      });
    } else {
      this.carts[cartIndex].products[productIndex].quantity += quantity;
    }

    try {
      this.writeToFile();
      console.log("Se agregó el producto al carrito correctamente");
      return product.id
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductsFromCart(cartId) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === Number(cartId));

    if (cartIndex === -1) {
      throw new CustomError("No se encontró el carrito", 404);
    }

    return this.carts[cartIndex].products;
  }

  async writeToFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t")
      );
      console.log("Los carritos se han escrito en el archivo correctamente.");
    } catch (error) {
      console.log("Error al escribir en el archivo:", error);
    }
  }
}



//export default new CartManager("./src/data/carts.json");
export const cartManager = new CartManager(path.resolve(__dirname, "./data/carts.json"));