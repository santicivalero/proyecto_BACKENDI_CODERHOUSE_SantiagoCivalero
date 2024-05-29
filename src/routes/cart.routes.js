import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await CartManager.addCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = await CartManager.getProductsFromCart(cid);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "No se encontró el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.query.quantity;
    await CartManager.addProductToCart(cid, pid, quantity);
    res.status(201).json({ message: "Se agregó el producto al carrito correctamente" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "No se encontró el carrito" });
  }
});

export default router;