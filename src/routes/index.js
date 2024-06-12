import { Router } from "express";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import viewsRoutes from "./views.routes.js";

const router = Router();

router.use("/api/products", productRoutes);
router.use("/api/carts", cartRoutes);
router.use("/", viewsRoutes);

export default router;