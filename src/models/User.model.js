import {Schema, model} from 'mongoose'
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  
},{
  timestamps:true,
  versionKey:false,
},);

// cifrar la contraseña
UserSchema.statics.encryptPassword = async(password) =>{
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // método hash para cifrar el pass. el password es lo que el usuario está tipeando y le agrego el salt.
    return hashedPassword;
  } catch (err) {
    throw new Error('Error while encrypting password: ' + err.message);
  }
}

// comparePassword es un nombre que nosotros le damos. el password actual que el usuario tiene guardado, y el receivedPass es la contraseña que ingresa el usuario para poder comparar a ver si es correcto o falso
UserSchema.statics.comparePassword = async (password, receivedPassword) => {
   return await bcrypt.compare(password,receivedPassword) // si las contraseñas coinciden retorna un true , sino false
};



export default model('User', UserSchema);


