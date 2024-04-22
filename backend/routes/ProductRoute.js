import express from "express";
import {
    getProduts,
    getProdutsById,
    createProduts,
    updateProduts,
    deleteProduts
} from "../controllers/Products.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router()

router.get('/products', verifyUser,getProduts);
router.get('/products/:id', verifyUser,getProdutsById);
router.post('/products', verifyUser,createProduts);
router.patch('/products/:id', verifyUser,updateProduts);
router.delete('/products/:id', verifyUser,deleteProduts);

export default router;