import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";
import CustomError from "../classes/CustomError.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    const products = productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;
  try {
    const product = productManager.getProductById(pid);

    res.json({ message: "Producto solicitado:", product: product });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al obtener el producto" });
    }
  }
});

router.post("/", async (req, res) => {
    try {
      const newProduct = await productManager.addProduct(req.body);

      res.status(201).json({ message: "Se agregó el producto correctamente:", product: newProduct });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        console.log(error);
        res.status(500).json({ error: "Error al agregar el producto" });
      }
  }
});

router.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const updatedProduct = await productManager.updateProduct(pid, req.body);
  
    res.json({ message: "Producto actualizado correctamente:", product: updatedProduct });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar el producto" });
    }
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const deletedProduct = await productManager.deleteProduct(pid);

    res.json({ message: "Producto eliminado correctamente:", productId: deletedProduct });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.log(error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }
});

export default router;
