import { Router } from 'express';
import { cartManager } from '../managers/CartManager.js';
import CustomError from '../classes/CustomError.js';

const router = Router();

// Crear carrito /api/carts
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: "Se creó el carrito correctamente", cart: newCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Obtener todos los productos de un carrito /api/carts/:cid
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.getProductsFromCart(cid);
    res.json({ cart });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos del carrito" });
    }
  }
});

// Agregar producto a un carrito /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.query.quantity;
    const productId = await cartManager.addProductToCart(cid, pid, quantity);
    res.status(201).json({ message: "Se agregó el producto al carrito correctamente", productId: productId });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
  }
});

// Eliminar producto de un carrito /api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    await cartManager.removeProductFromCart(cid, pid);
    res.json({ message: "Se eliminó el producto del carrito correctamente" });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
  }
});

// Actualizar todos los productos de un carrito /api/carts/:cid
router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body.products;
    const updatedCart = await cartManager.updateCart(cid, products);
    res.json({ message: "Se actualizaron los productos del carrito correctamente", cart: updatedCart });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar los productos del carrito" });
    }
  }
});

// Actualizar cantidad de un producto en el carrito /api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json({ message: "Se actualizó la cantidad del producto en el carrito correctamente", cart: updatedCart });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
    }
  }
});

// Eliminar todos los productos de un carrito /api/carts/:cid
router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedCart = await cartManager.clearCart(cid);
    res.json({ message: "Se eliminaron todos los productos del carrito correctamente", cart: updatedCart });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al eliminar todos los productos del carrito" });
    }
  }
});

export default router;