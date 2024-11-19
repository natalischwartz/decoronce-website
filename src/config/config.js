// aca van las variables de entorno 

import { config } from 'dotenv'
config();

export const MONGODB_URI = process.env['MONGODB_URI']

export const CLOUDINARY_CLOUD_NAME = process.env['CLOUDINARY_CLOUD_NAME']
export const CLOUDINARY_API_KEY = process.env['CLOUDINARY_API_KEY']
export const CLOUDINARY_API_SECRET = process.env['CLOUDINARY_API_SECRET']

export const SECRET_JWT_KEY = 'this-is-an-awesome-secret-key'

