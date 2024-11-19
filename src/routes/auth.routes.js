import { Router } from 'express'
const router = Router()
import * as authCtrl from '../controllers/auth.controller.js'

// import {checkDuplicateUsernameOrEmail} from '../middlewares/verifySignup.js'



router.get('/register' , authCtrl.registerView)

router.post('/register', authCtrl.signUp)


router.get('/login',authCtrl.loginView)


router.post('/login',authCtrl.logIn)

router.get('/logout', authCtrl.logOut  )


export default router