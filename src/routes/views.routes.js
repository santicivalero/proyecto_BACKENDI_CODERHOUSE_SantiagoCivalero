import { Router } from "express";
import { productManager } from "../managers/ProductManager.js";

const router = Router();

// let products = productManager.getProducts();
// console.log(products)
// // Vista de productos /products
// router.get('/products', (req, res) => {
//     res.render('index', { products, style: 'index.css' });
// });
router.get('/products', async (req, res) => {
    try {
        let { limit, page, sort, query } = req.query;
        
        // Convertir limit y page a números enteros si están presentes
        limit = limit ? parseInt(limit) : 10;  // Valor por defecto de 10 si limit no está definido
        page = page ? parseInt(page) : 1;      // Valor por defecto de 1 si page no está definido

        const result = await productManager.getProducts(limit, page, sort, query);
        
        // Verificar si hay datos de paginación
        const { payload, hasPrevPage, prevPage, nextPage } = result;

        // Renderizar la vista con los datos correctos
        res.render('index', { products: payload, hasPrevPage, prevPage, nextPage, limit, sort, query, style: 'index.css' });
    } catch (error) {
        console.log("Error al obtener los productos", error);
        res.status(500).send("Error al obtener los productos");
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('details', { product, style: 'details.css' });
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});


// Vista de productos en tiempo real /realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { style: 'realTimeProducts.css' });
});

export default router





