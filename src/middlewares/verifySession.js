import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from '../config/config.js'


//chequeo del token
export const verifySession= (req,res,next)=>{
    //recuperamos primero el token 
    const token = req.cookies['access-token']

    req.session = {user: null}

    if(token){
        try {
          //de este token va a extraer los datos. se supone que en data deberiamos tener
           //el id y name del payload
            const data = jwt.verify(token,SECRET_JWT_KEY)
            req.session.user = data
            console.log(req.path)
            console.log(data)
        } catch (error){
            console.error("Token verification failed:", error);
        }
    
    }
    next();
}

