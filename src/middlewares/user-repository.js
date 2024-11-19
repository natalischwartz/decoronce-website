
import Validation from './verifySignup.js'
import User from '../models/User.model.js'


export class userRepository{
    static async register({name,email,password}){
        //1. Validaciones de los 3 parametros
        Validation.name(name)
        Validation.email(email);
        Validation.password(password);


        //2.Asegurar que el username no existe

        const user = await User.findOne({name})
        
        if(user) throw new Error("Username already exists");

        //si no existe el user , lo creamos 

        const newUser = new User({
            name,
            email,
            password: await User.encryptPassword(password)// va a tomar el pass que el usuario esta tipeando. se va a guardar la contraseña cifrada
        })

        const nuevoUsuario = await newUser.save();
        console.log(nuevoUsuario);

    }

    static async login({email,password}){
        Validation.email(email);
        Validation.password(password);

        //1. Validar si ese mail existe en la base de datos 

        const userFound = await User.findOne({email:email})
        // console.log(userFound);

        if(!userFound) throw new Error("Email does not exist")
            // return res.redirect('/login')

        //2. si existe el usuario comparar el password. nos devuelve true or false
        const matchPassword = await User.comparePassword(password,userFound.password)

        if(!matchPassword) throw new Error("Password is invalid")

        // le quitamos al objeto userFound la propiedad password, para que no se muestre

        const {password: _, ...publicUser} = userFound


        // y si matchea el password 
        return publicUser;

    }
}