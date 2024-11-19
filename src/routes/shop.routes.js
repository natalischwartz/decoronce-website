import { Router } from 'express';
import {getProducts, getProduct, filterProducts, filterProductsByCategory } from '../controllers/shop.controller.js'
const router = Router()


//Leer
router.get('/shop', getProducts)

//Leer un solo item 
router.get('/shop/items/:id', getProduct );

//buscar un producto por texto
router.post('/shop/search', filterProducts ) 

//filtrar producto por categoria

router.post('/shop/filter', filterProductsByCategory);


export default router