import {v2 as cloudinary} from 'cloudinary'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,  CLOUDINARY_API_SECRET } from '../config/config.js'
import streamifier from 'streamifier';

//Configurar cloudinary
cloudinary.config({
    cloud_name:CLOUDINARY_CLOUD_NAME,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET ,
    secure:true
})

// const url = cloudinary.url('replit/eef4ehkqrhgk6kylxbho', {
//   transformation: [
//     { overlay: 'watermark-textiles-removebg_g511g2',
//       gravity: 'center',// Coloca la marca de agua en el centro 
//       width: 900,// Redimensiona la marca de agua a un ancho de 900 píxeles
//       // opacity: 50 // Ajusta la opacidad de la marca de agua al 50% 
//       }, 
//   ]
// });

// console.log(url)

// Función para subir imagen desde un buffer usando async/await
 export async function uploadImageFromBuffer(buffer) {
   return new Promise((resolve, reject) => {
     const uploadStream = cloudinary.uploader.upload_stream(
       { folder: 'replit' },
       (error, result) => {
         if (error) {
           reject(error);
         } else {
           resolve(result);
         }
       }
     );
     streamifier.createReadStream(buffer).pipe(uploadStream);
   });
 }




//eliminar archivos de cloudinary si se borra de la base de datos 

export async function deleteImage(publicId){
  return await cloudinary.uploader.destroy(publicId)
}


