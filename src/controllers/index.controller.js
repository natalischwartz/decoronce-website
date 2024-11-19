
import { getProducts } from '../controllers/admin.controller.js';



export const index = (req,res) =>{
    res.render("index" , {
        collections: getProducts
    });
}

