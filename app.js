import express from 'express';
// import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path'
import { fileURLToPath } from 'url';
import methodOverride from 'method-override'
import { config } from 'dotenv'
config();
import jwt from 'jsonwebtoken';
import { verifySession } from './src/middlewares/verifySession.js';



const PORT = process.env.PORT || 3000;
import { connectToDB } from './src/utils/mongoose.js';

try {
    await connectToDB();
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if there's a connection error
  }



  const app = express();

  app.use(cookieParser());



// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './src/routes/auth.routes.js'
import adminRoutes from './src/routes/admin.routes.js'
import indexRoutes from './src/routes/index.routes.js'
import shopRoutes from './src/routes/shop.routes.js'
import mainRoutes from './src/routes/main.routes.js'
import { SECRET_JWT_KEY } from './src/config/config.js';


// Mostrar la ruta generada por path.join(__dirname, 'public')
const publicPath = path.resolve(__dirname, 'public');
// console.log(`La ruta para archivos estáticos es: ${publicPath}`);

app.use(express.static(publicPath));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(verifySession);



// Middleware de express-fileupload
app.use(fileUpload({ // Ahora express va a poder recibir archivos. cuando yo envie un archivo va a poder recibirlo. por ejemplo con createProduct
    useTempFiles : false, //No usar archivos temporales, trabajar directamente con el buffer
    tempFileDir : './uploads' // dónde quiero q lo suban. Las imagenes que aparecen en la carpeta uploads ahora las puedo subir a CLOUDINARY (nube de imagenes) y despues las quito de esa carpeta
}));
//url encoded para que capture el cuerpo de la peticion. 
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


//Motor de plantilla
app.set("view engine" , "ejs")
app.set("views", path.resolve(__dirname, "src/views"));

app.use(authRoutes);
app.use(adminRoutes);
app.use(indexRoutes);
app.use(shopRoutes);
app.use(mainRoutes);



app.use((req, res) => {
  res
    .status(404)
    .render("pages/404", {
      title: "404",
    });
});

app.listen(PORT,()=> console.log(`http://localhost:${PORT}`));

export default app