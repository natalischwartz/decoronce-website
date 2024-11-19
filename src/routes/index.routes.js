import { Router } from 'express'
const router = Router()
import {index} from '../controllers/index.controller.js'


//routes
router.get('/', index )

export default router