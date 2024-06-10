import { Router } from "express";
import { cartManager } from "../managers/CartManager.js";
import CustomError from "../classes/CustomError.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: "Se creó el carrito correctamente", cart: newCart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const products = await cartManager.getProductsFromCart(cid);
    res.json(products);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos del carrito" });
    }
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.query.quantity;
    const productId =await cartManager.addProductToCart(cid, pid, quantity);
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

export default router;