import { Router } from 'express'
const router = Router()
import  contact  from '../controllers/main.controller.js'

router.get('/contact', contact);

export default router