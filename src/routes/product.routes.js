import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await ProductManager.getProductById(pid);
    if (!product) {
      res.status(404).json({ error: "No se encontró el producto" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = await ProductManager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedProduct = await ProductManager.updateProduct(pid, req.body);
    if (!updatedProduct) {
      res.status(404).json({ error: "No se encontró el producto" });
    } else {
      res.json({ message: "Producto actualizado correctamente" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const deletedProduct = await ProductManager.deleteProduct(pid);
    if (!deletedProduct) {
      res.status(404).json({ error: "No se encontró el producto" });
    } else {
      res.json({ message: "Producto eliminado correctamente" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
