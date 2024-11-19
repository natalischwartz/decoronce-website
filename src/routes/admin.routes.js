import { Router } from 'express'
import {getProducts,getProduct,itemForm, createProduct, updateProduct, deleteProduct } from '../controllers/admin.controller.js'
const router = Router()



//Leer
router.get('/products', getProducts)
//Crear
router.get('/products/create', itemForm)
router.post('/products/create',  createProduct)
//Actualizar
router.get('/products/edit/:id',getProduct)
router.post('/products/edit/:id',updateProduct)
//Eliminar. Ademas de products vas a pasarme el ID como un parametro. ejemplo /products/10
router.get('/products/delete/:id', deleteProduct)



export default router