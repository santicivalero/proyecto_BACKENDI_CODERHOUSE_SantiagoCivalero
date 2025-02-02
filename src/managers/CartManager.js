import mongoose from 'mongoose';
import { cartModel as Cart } from '../models/cart.model.js';
import { productModel as Product } from '../models/product.model.js';
import CustomError from '../classes/CustomError.js';

class CartManager {
  // Crear carrito
  async createCart() {
    const newCart = new Cart({ products: [] });

    try {
      await newCart.save();
      console.log("Se creó el carrito correctamente");
      return newCart;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Añadir producto a un carrito
  async addProductToCart(cid, pid, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      console.log("El id debe ser un ObjectId válido");
      throw new CustomError("El id debe ser un ObjectId válido", 400);
    }

    if (quantity === null || quantity === undefined) {
      quantity = 1;
    }
    quantity = Number(quantity);

    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new CustomError("No se encontró el carrito", 404);
      }

      const product = await Product.findById(pid);
      if (!product) {
        throw new CustomError("No existe el producto", 404);
      }

      const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);

      if (productIndex === -1) {
        cart.products.push({ product: pid, quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      await cart.save();
      console.log("Se agregó el producto al carrito correctamente");
      return product.id;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Obtener todos los productos de un carrito
  async getProductsFromCart(cartId) {
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      console.log("El id debe ser un ObjectId válido");
      throw new CustomError("El id debe ser un ObjectId válido", 400);
    }

    try {
      const cart = await Cart.findById(cartId).populate('products.product');
      if (!cart) {
        throw new CustomError("No se encontró el carrito", 404);
      }

      return cart.products;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Eliminar producto de un carrito
  async removeProductFromCart(cid, pid) {
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      console.log("El id debe ser un ObjectId válido");
      throw new CustomError("El id debe ser un ObjectId válido", 400);
    }
    
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new CustomError("No se encontró el carrito", 404);
      }

      cart.products = cart.products.filter(p => p.product.toString() !== pid);

      await cart.save();
      console.log("Se eliminó el producto del carrito correctamente");
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Actualizar todos los productos del carrito
  async updateCart(cid, products) {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      console.log("El id debe ser un ObjectId válido");
      throw new CustomError("El id debe ser un ObjectId válido", 400);
    }

    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new CustomError("No se encontró el carrito", 404);
      }

      cart.products = products;

      await cart.save();
      console.log("Se actualizaron los productos del carrito correctamente");
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Actualizar cantidad de un producto en el carrito
  async updateProductQuantity(cid, pid, quantity) {
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      console.log("El id debe ser un ObjectId válido");
      throw new CustomError("El id debe ser un ObjectId válido", 400);
    }

    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new CustomError("No se encontró el carrito", 404);
      }

      const productIndex = cart.products.findIndex((p) => p.product.toString() === pid);

      if (productIndex === -1) {
        throw new CustomError("No existe el producto en el carrito", 404);
      }

      cart.products[productIndex].quantity = quantity;

      await cart.save();
      console.log("Se actualizó la cantidad del producto en el carrito correctamente");
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Eliminar todos los productos del carrito
  async clearCart(cid) {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      console.log("El id debe ser un ObjectId válido");
      throw new CustomError("El id debe ser un ObjectId válido", 400);
    }

    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        console.log("No se encontró el carrito");
        throw new CustomError("No se encontró el carrito", 404);
      }

      cart.products = [];

      await cart.save();
      console.log("Se eliminaron todos los productos del carrito correctamente");
      return cart;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const cartManager = new CartManager();


// Codigo con fs

// import fs from "fs";
// import __dirname from "../dirname.js";
// import path from "path";
// import Cart from "../classes/Cart.js";
// import { productManager } from "./ProductManager.js";
// import CustomError from "../classes/CustomError.js";

// class CartManager {
//   constructor(path) {
//     this.path = path;

//     if (fs.existsSync(this.path)) {
//       try {
//         this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
//       } catch (error) {
//         this.carts = [];
//       }
//     } else {
//       this.carts = [];
//     }
//   }

//   // Crear carrito
//   async createCart() {
//     const latestId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 1;
//     const newCart = new Cart(latestId + 1);

//     this.carts.push(newCart);

//     try {
//       this.writeToFile();
//       console.log("Se creó el carrito correctamente");
//       return newCart;
//     } catch (error) {
//       throw new Error(error);
//     }
//   }

//   // Añadir producto a un carrito
//   async addProductToCart(cid, pid, quantity) {
//     if (isNaN(Number(cid)) || isNaN(Number(pid))) {
//       console.log("El id debe ser un número");
//       throw new CustomError("El id debe ser un número", 400);
//     }

//     if (quantity === null || quantity === undefined) {
//       quantity = 1;
//     }
//     quantity = Number(quantity);

//     const cartIndex = this.carts.findIndex((cart) => cart.id === Number(cid));

//     if (cartIndex === -1) {
//       throw new CustomError("No se encontró el carrito", 404);
//     }

//     const product = await productManager.getProductById(pid);
//     if (!product) {
//       throw new CustomError("No existe el producto", 404);
//     }

//     const productIndex = this.carts[cartIndex].products.findIndex(
//       (product) => product.id === Number(pid)
//     );

//     console.log(cartIndex)
//     console.log(productIndex)
    
//     if (productIndex === -1) {
//       this.carts[cartIndex].products.push({
//         id: Number(pid),
//         quantity,
//       });
//     } else {
//       this.carts[cartIndex].products[productIndex].quantity += quantity;
//     }

//     try {
//       this.writeToFile();
//       console.log("Se agregó el producto al carrito correctamente");
//       return product.id
//     } catch (error) {
//       throw new Error(error);
//     }
//   }

//   // Obtener todos los productos de un carrito
//   async getProductsFromCart(cartId) {
//     if (isNaN(Number(cartId))) {
//       console.log("El id debe ser un número");
//       throw new CustomError("El id debe ser un número", 400);
//     }

//     const cartIndex = this.carts.findIndex((cart) => cart.id === Number(cartId));

//     if (cartIndex === -1) {
//       throw new CustomError("No se encontró el carrito", 404);
//     }

//     return this.carts[cartIndex].products;
//   }

//   // Escribir en el archivo
//   async writeToFile() {
//     try {
//       await fs.promises.writeFile(
//         this.path,
//         JSON.stringify(this.carts, null, "\t")
//       );
//       console.log("Los carritos se han escrito en el archivo correctamente.");
//     } catch (error) {
//       console.log("Error al escribir en el archivo:", error);
//     }
//   }
// }

// export const cartManager = new CartManager(path.resolve(__dirname, "./data/carts.json"));