import Product from '../models/product.model.js' 
import { uploadImageFromBuffer, deleteImage } from '../utils/cloudinary.js'





export const getProducts = async (req,res) => {

    /*si tenemos sesion del usuario, tiene permiso y puede ingresar a esta ruta protected
    tenemos que verificar que realmente esta esa cookie 
    */
    

    const {user} = req.session

    if(!user) return res.status(403).send("Access not authorized")

    // y si existe el usuario , buscamos los productos

     // utilizamos el modelo Product con su metodo find , para consultar productos desde la base de datos. es asincrono porque se esta comunicando con la BBDD ( await). el metodo find viene de mongoose
    const products = await Product.find()    
        res.render("pages/admin/admin",{
            data: products,
            mensaje: req.query.mensaje || "",
            user:user //pasamos el usuario a la vista
        })

    }

//Mostrar el formulario de productos

export const itemForm = async (req,res) => {

    const {user} = req.session

    if(!user) return res.status(403).send("Access not authorized")


    try {
        res.render("pages/admin/create",{
            user:user
        })
    }
    catch (error) {
    return res.status(500).json({
        message: error.message
        })
    }
}    



export const createProduct = async (req,res)=>{
    try {
        
        const {name,description,width,price,provider,category} = req.body

        //antes de que crees el producto, quiero q me muestres por consola un objeto nuevo que se llam files que nos da express-fileupload
        // console.log(req.files) // por consola aparece esto: [Object: null prototype] {
        //     image: {
        //       name: 'Captura1.PNG',// nombre del archivo
        //       data: <Buffer >,
        //       size: 661595,
        //       encoding: '7bit',
        //       tempFilePath: 'uploads\\tmp-2-1720278721447', // dónde esta subido el archivo
        //       truncated: false,
        //       mimetype: 'image/png',
        //       md5: 'ee817279fd779087853b19dea8db06ce',
        //       mv: [Function: mv]
        //     }
        //   }

        console.log(name, description,width,price,provider,category);
        //me van a enviar a traves de un req body estos datos 
        //    console.log(req.body)(se ve el cuerpo de los datos) // si el cliente me esta enviando datos puedo verlo por mi consola de backend y si llega retorno un mensaje q sea recibido. el req body es un objeto entonces vamos a desestructurar las propiedades que vienen de ese objeto. Espero q me envie una propiedad name , decription, price
    
    //voy a crear un nuevo producto con el modelo Product
    const product = new Product({
        name,
        description,
        width,
        price,
        provider,
        category
    })

    //si recibes req.files. puede que no tenga nada adentro, pero si tiene y tiene la propiedad image entonces vamos a subir esto a CLOUDINARY

    if(req.files?.image){
        const imageBuffer =req.files.image.data;
        const uploadResult = await uploadImageFromBuffer(imageBuffer)

        console.log(uploadResult)// va await porque el proceso es asincrono. me va a mostrar por consola los datos de como lo subio a cloudinary. me devuelve por consola el objeto que esta subido a cloudinary
        product.image ={
            public_id: uploadResult.public_id,
            secure_url : uploadResult.secure_url
        }
    } 
      // el nuevo producto creado se guarda en la base de datos
        await product.save()
        res.redirect("/products")
        
} //termina el try 
    catch (error) {
        res.status(500).json({ message: 'Image upload failed', error });
    }

    

}
// lógica: cuando ejecute el eliminaR voy a tratar de recibir un ID. De todos los productos que yo tengo en mi BBDD, muchos podrían tener datos en común. Podrian tener una description igual o incluso un nombre. La forma de diferenciarlos es a traves del ID.
export const deleteProduct = async (req,res)=>{


    const {user} = req.session

    if(!user) return res.status(403).send("Access not authorized")

    try {
        const product = await Product.findByIdAndDelete(req.params.id, user)

        if(!product) return res.status(404).json({
            message:"Product does not exists"
        })

        

        //si el producto lo encontraste vas a ejecutar la funcion deleteImage que viene desde cloudinary , para que se borre la foto ahi tambien
        await deleteImage(product.image.public_id)

        // return res.json(product) // retorna al cliente este producto que has encontrado. me devuelve un objeto. yo no quiero obtener como valor un objeto. quiero q lo encuentre y lo elimine. entonces el metodo seria findByIdAndDelete. me muestra el que elimino y cuando hacemos un get de productos no deberia estar.

        res.redirect("/products" + "?mensaje=Item Borrado" )

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
    // cómo accedo al ID a traves de código?
    // console.log(req.params) // aca se ve la URL. Por consola se ve porque puse /products/10 { id: '10}. El req params es un objeto que tiene la propiedad id y los parametros son un string '10'
    // console.log(req.params.id) // aca en consola solo muestra 10.
    // voy a hacer una consulta con el modelo 
    
    // console.log(product)


}

// en vez que me traiga todos los productos q me devuelva solo uno
export const getProduct = async (req,res)=>{

    const {user} = req.session

    if(!user) return res.status(403).send("Access not authorized")


    try {
        const product = await Product.findById(req.params.id)
    //si ese id no existe devolveme no se encuentra enla BBDD.con page not found
    if(!product) return res.status(404).json({
        message:"Product does not exists"
    })

    res.render("pages/admin/edit", {
        data : product
    })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
    
}



// lógica: el update va a necesitar un req params para recibir un id (para que busque el producto que quiere actualizar) , como un req body (para pasarle los datos q quiero actualizar)
export const updateProduct = async (req,res)=>{
    try {
        // extraemos el id de req.params
    const {id} =req.params;
    const productUpdated = await Product.findByIdAndUpdate(id, req.body,{
        new:true
    })

    // console.log(id) //6679edf94706791b4ad81c30
    // console.log(req.body)//{ name: 'monitor', description: 'lg monitor', price: 1300 }
    if(productUpdated){
        res.redirect('/products')
    }
    await productUpdated.save();

    
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
    
}

//ERROR HANDLERS
// /products/1 . el 1 no es un objeto de mongo db válido. el servidor falla y la idea es que siempre se le pueda responder algo al cliente. Para validar esto vamos a colocar todas nuestras consultas dentro de try y catch para devolver siempre algo al cliente. si el usuario hace una consulta con un id q no existe en la base de datos , le devuelve este tipo de error y no falla el servidor. "Cast to ObjectId failed for value \"80\" (type string) at path \"_id\" for model \"Product\indica que se ha intentado asignar el valor "80" al campo "_id" de un documento en la colección "Product" en una base de datos MongoDB, pero dicho valor no es un ObjectId válido.
