import Product from '../models/product.model.js' 

//Home del shop 



export const getProducts = async (req,res) => {

    try {
        // Consulta a la base de datos sin ordenar
        let products = await Product.find().lean(); // Usamos lean() para obtener datos planos

         // Convertir `price` de cadena a número
        products.forEach(product => {
        product.price =Number(product.price.replace(/[^0-9.-]+/g,"")) ;
        });

        // Verifica si hay un parámetro de orden en la query
        let order = req.query.order || 'default';
        let sortOption = {};

        console.log("Orden recibido:", order);

         // Ordenar manualmente después de convertir los precios
        if (order === 'pr-mintomax') {
        products = products.sort((a, b) => a.price - b.price); // Menor a Mayor
        } else if (order === 'pr-maxtomin') {
        products = products.sort((a, b) => b.price - a.price); // Mayor a Menor
        }

        // Renderizar la página con los productos ordenados
        res.render('pages/shop/shop', {
        data: products,
        mensaje: req.query.mensaje || ""
        });

        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }

}

export const getProduct = async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
    //si ese id no existe devolveme no se encuentra enla BBDD.con page not found
    if(!product) return res.status(404).json({
        message:"Product does not exists"
    })

    // console.log(product.variants); // Verificar que variants contiene la imagen y el color correctamente

    // Renderizar la página con el producto y sus variantes
    res.render("pages/shop/item", {
        product // pasamos el producto completo
        

    });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
    
}

//filtro de búsqueda por palabra ingresada en el input

export const filterProducts= async (req,res)=>{

    try {
        const { search } = req.body;

        let products;

        // console.log(search);
        // const product = await Product.find({
        //     $text: { $search: search, $caseSensitive: false, $diacriticSensitive: false }
        // })
        // console.log(product[0]);

        // Si no se ingresó ningún término de búsqueda, devolver todos los productos
        if (!search || search.trim() === "") {
            products = await Product.find(); // Obtén todos los productos
        }else {
            // Si hay un término de  búsqueda, realiza una búsqueda de texto
            products = await Product.find({
                $text: {
                $search: search,
                $caseSensitive: false,
                $diacriticSensitive: false
            }
            });
        }

          // Si no se encontraron productos, mostrar el mensaje correspondiente
        //si ese wordFilter no existe devolveme
        if( products.length === 0){

            products = await Product.find(); // Obtener todos los productos de la base de datos

            res.render("pages/shop/shop", {
                data : products,
                mensaje: " No se encontraron productos con esa palabra"
        // Mostrar los productos encontrados o todos los productos si no hay búsqueda
        })}else{
                res.render("pages/shop/shop", {
                data : products,
                mensaje: search ? "Se encontraron productos" : null
            })}
        }catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// filtro de busqueda por categoría

export const filterProductsByCategory= async (req,res)=>{
    try {
        console.log(req.body)
        const { category } = req.body;

        const products = await Product.find({"category": category})
        
        res.render("pages/shop/shop", {
            data : products,
            mensaje: "Se encontraron productos"
        })

    }catch (error) {
        return res.status(500).json({
            message: error.message
        })
//     }
// }
}

}