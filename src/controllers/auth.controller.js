import User from '../models/User.model.js';
import { userRepository } from '../middlewares/user-repository.js';
import { SECRET_JWT_KEY } from '../config/config.js';
import jwt from 'jsonwebtoken';


export const registerView = (req,res) =>{

    const {user} = req.session

    if(!user) return res.status(403).send("Access not authorized")


    res.render('pages/admin/register',{
        mensaje:"Bienvenido"
    })
}

//logica: consultamos la bbdd para ver si existe el usuario. si ya existe e usuario , entonces no lo creamos, pero si no existe si. desde req body vamos a estar recibiendo los datos
export const signUp =async (req,res) =>{
        const {name,email,password} = req.body;

    try {
        const user = await userRepository.register({name,email,password})

        return res.redirect('/login')
    
    } catch (error) {
        return res.status(500).json({
            message: error.message
    })
}

}

export const loginView = (req,res) =>{
    res.render('pages/admin/login',{
        mensaje:"Completa tus datos"
    })
}

export const logIn = async (req,res) =>{
    try {
        /*el usuario nos da en el login un email y password.vamos a buscar si el email existe en nuestra bbdd. el findOne me va a devolver un objeto. 
    */
        const {email,password} = req.body
        // Busca al usuario por su email

        const user = await userRepository.login({email,password})
        // res.send({user})

        //vamos a crear un TOKEN para la sesion de usuario

        const token = jwt.sign({_id: user._id, email: user.email}, SECRET_JWT_KEY,{
            expiresIn:'1h'})

        res
            .cookie('access-token',token,{
                httpOnly: true, //la cookie solo se puede acceder en el server
                secure: process.env.NODE_ENV === 'production', //la cookie solo se puede acceder en https
                sameSite: 'strict', //la cookie solo se puede acceder en el mismo dominio
                maxAge: 1000*60*60 // la cookie tiene validez por 1 hora
            })

            .redirect("/products")

        


    
}catch (error) {
     // Redirigimos a la página de inicio con un mensaje de error
     res.redirect('/?mensaje=' + encodeURIComponent(error.message));
    }
}



export const logOut = (req,res) =>{
    res
        .clearCookie('access-token')
        
        .redirect('/')

}








