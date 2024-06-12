import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";

const router = Router();

let products = productManager.getProducts();

// Vista de productos /products
router.get('/products', (req, res) => {
    res.render('index', { products, style: 'index.css' });
});

// Vista de productos en tiempo real /realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products, style: 'realTimeProducts.css' });
});

export default router





