import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";

const router = Router();

let products = productManager.getProducts();

// Ruta para la vista de productos
router.get('/products', (req, res) => {
    res.render('index', { products, style: 'index.css' });
});

// Ruta para la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products, style: 'realTimeProducts.css' });
});

export default router





