
const addToCartButtons = document.querySelectorAll(".add-to-cart"); //me devuelve una nodelist, lo que significa que no puedo aplicar directamente el esuchador de eventos. entonces recorro cada button.
const asideMenu = document.querySelector(".aside-menu");
// console.log(asideMenu);
const verCarrito = document.querySelector("#verCarrito");

const modalContainer = document.getElementById("modal-container");



//Seleccionamos todos los botones de agregar, restar y los campos de cantidad
const addButtons = document.querySelectorAll('#add');
const substractButtons = document.querySelectorAll('#substract');
const quantities = document.querySelectorAll('#quantity');

const cantidadCarrito = document.getElementById("cantidadCarrito");

// Recorremos todos los productos para añadir eventos a cada conjunto de botones

addButtons.forEach((addButton, index) => {
    const quantity = quantities[index];
    
    addButton.addEventListener('click', () => {
        quantity.value = Number(quantity.value) + 1;
    });
});

substractButtons.forEach((substractButton, index) => {
    const quantity = quantities[index];

    substractButton.addEventListener('click', () => {
        if (Number(quantity.value) > 0) {
            quantity.value = Number(quantity.value) - 1;
        }
    });
});


// carrito ya no es mas un array vacio. ahora es lo que sea que este en el local storage.
//carrito es lo primero si hay algo guardado en el ls , sino soy un carrito vacio
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// dar funcionalidad al boton agregar

addToCartButtons.forEach((button) => {

    button.addEventListener('click',() => {
        
        // Obtener los datos del producto del botón
        const productId = button.getAttribute('data-id');
        // console.log(productId)
        const productName = button.getAttribute('data-name');
        // console.log(productName)
        const productImg = button.getAttribute('data-img');//ahora es dinamico

        const productPrice = button.getAttribute('data-price');

        const productColor = button.getAttribute('data-color');  // Captura el color seleccionado

        //capturar la cantidad ingresada por el usuario. obtener la cantidad del input
        const quantityInput = button.parentElement.querySelector('.item__input');
        

        // Verificar si es una página de detalles (item.ejs)
        const isItemPage = !!quantityInput;

        let productQuantity = 1;  // Cantidad por defecto para shop.ejs

        if(isItemPage){
            //página de item.ejs
            productQuantity = Number(quantityInput.value); 

        // Chequeo si no se ingresó una cantidad válida
        if(!productQuantity || productQuantity < 1){
            const toastMessage = 'Debes ingresar una cantidad';
        Toastify({
            text: toastMessage,
            duration: 3000,
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", // Sombra
                fontSize: "12px",     // Tamaño de la fuente
                padding: "10px 20px",  // Espaciado interno
                position: "fixed",  // Asegura que se quede fijo en la pantalla
                top: "10px",        // Coloca el toast en la parte superior de la ventana
                right: "10px",
                zIndex: 800,
                color:"white",
            }
        }).showToast();
        return; // Detener la ejecución si no hay cantidad válida
            }

    }
    //Añadimos el producto al carrito. manejo de cantidades: antes de pushear chequeame que si se esta repitiendo un producto , no me lo pushees , simplemente sumale uno a la cantidad que ya tiene antes.

    //detectamos si en el carrito ya existe ese producto y lo hacemos por id. El some me devuelve un true o false. si encuentra el mismo id me devuelve true

    const repeat = carrito.some((repeatProduct) => repeatProduct.id === productId && repeatProduct.color === productColor )
    // console.log(repeat);

    // si repeat es true vamos a recorrer el carrito con map , y si ese id se repite, sumale 1 a la cantidad
    if(repeat){
        // Si el producto y color ya existen, incrementa la cantidad
        carrito.map((product) => {
            if(product.id === productId  && product.color === productColor){
                product.quantity++; //es como +1
            }
        });
    }else{ // suma un producto nuevo que no esta en carrito
            carrito.push({
                id:productId,
                name:productName,
                image: productImg,
                price: productPrice,
                quantity: productQuantity,
                color:productColor, //añade el color seleccionado
            })

        }
        console.log(carrito); // Mostrar el carrito actualizado en la consola
        carritoCounter();
        saveLocal();
        pintarCarrito();
            
    });

});    
        


//mostramos el carrito en pantalla. lo vamos a mostrar en un modal. cuando el usuario de click en el icono del carrito

// Función para mostrar el carrito (desliza desde la derecha)
const mostrarCarrito = () => {
    modalContainer.classList.add("modal-visible")
    pintarCarrito();
    // asideMenu.classList.remove("aside-visible")
}

// Función para ocultar el carrito (desliza hacia afuera)
const ocultarCarrito = () => {
    modalContainer.classList.remove("modal-visible")
}




const pintarCarrito = () => {

    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    //quiero crear un modal 

    //creamos el header del modal 
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header"

    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito de compras </h1>
    ` 

    //tenemos que enchufar estoa nuestro div padre
    modalContainer.append(modalHeader);

    //creamos el boton de close 
    const modalButton = document.createElement("img")
    modalButton.src = "/Imagenes/iconos/MaterialSymbolsArrowLeftAlt.png"
    modalButton.className = "modal-header-icon";

    modalButton.addEventListener('click', ocultarCarrito)

    modalHeader.append(modalButton);

    /*el cuerpo del modal va a contener lo que sea que tenga el carrito. product hace referencia a cada uno de los productos que eligio el usuario
    buscamos que hay en el carrito , lo recorremos y le creamos un elemendo div para mostrar el contenido del carrito y despues se lo agregamos a un div padre.
    Cuando el usuario haga clic en "Agregar al carrito", estos datos pueden ser capturados y mostrados en el modal del carrito.
    */
    carrito.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className ="modal-content" // le asignamos clase para despues darle estilos css


        let carritoImg = document.createElement("div");
        carritoImg.className ="carrito-img"
        // carritoImg.src = productColor;
        carritoImg.innerHTML = `<img src="${product.image}" alt="${product.name}">`

        let itemText = document.createElement("div");
        itemText.className ="cart-item-text"
        itemText.innerHTML = `
        <h3 style="padding:0 15px"> ${product.name}  </h3>
        <p style="padding:0 15px"> Color: ${product.color}</p> <!-- Mostrar el color -->
        <p style="padding:0 15px"> Cant: ${product.quantity} x $ ${Number(product.price.replace(/[^0-9.-]+/g,""))} </p>
        <p style="padding:0 15px">Subtotal: $ ${product.quantity * Number(product.price.replace(/[^0-9.-]+/g,""))} </p>
        <img src="/Imagenes/iconos/OouiTrash.png" class="delete-product">
        `;

        
        carritoContent.append(carritoImg, itemText);
        modalContainer.append(carritoContent);

        console.log(carrito.length); // para ver la cantidad de objetos 


        let eliminar = carritoContent.querySelector(".delete-product");

        eliminar.addEventListener("click", () => {
            eliminarProducto(product.id);
        })

    });

    // el representa cada uno de los productos que esten en el carrito. el es cada objeto
    const total = carrito.reduce((acc,el) => acc + (el.quantity*(Number(el.price.replace(/[^0-9.-]+/g,"")))),0 );


    const totalBuying = document.createElement("div")
    totalBuying.className ="total-content"
    totalBuying.innerHTML = ` <h1> Total a pagar:$ ${total} </h1> `
    modalContainer.append(totalBuying);

    let btnEnviarPedido = document.createElement("input")
    btnEnviarPedido.type ="submit"
    btnEnviarPedido.value ="Enviar pedido"
    btnEnviarPedido.className ="btnEnviarPedido"

    let textoObs = document.createElement("p");
    textoObs.className = "texto-obs-carrito";
    textoObs.innerText = "Aclaración: Se confirmará stock y colores del género a través de Whatsapp";

    modalContainer.append(btnEnviarPedido, textoObs);

    // Llamada a la función cuando el usuario haga clic en un botón de "Enviar pedido"
    const btnEnviar = document.querySelector(".btnEnviarPedido")
    console.log(btnEnviar)

    btnEnviar.addEventListener("click", enviarMensajeWhatsApp);


}
//Eliminar un producto del carrito. Conviene tener verCarrito todo adentro de una funcion para manejarlo mejor.Una funcion que englobe todo lo que pasa en carrito
// verCarrito.addEventListener('click',()=>{
/* quiero que la funcion pintarCarrito se dispare cuando cuando el usuario aprete el icono de carrito. */ 

verCarrito. addEventListener("click", mostrarCarrito);

    



//creamos el boton eliminar y despues la funcion que se ejecute cuando el usuario aprete ese boton. dentro de esta funcion voy a usar el metodo find , para buscar cual es el id del producto que el usuario esta queriendo eliminar. el boton eliminar esta para cada uno de los productos , el boton va a estar asociado a un producto en concreto que tiene asociado un id. cuando  encuentre ese id voy a utilizar el metodo filter y filtrar todos los productos de ese carrito que no tengan ese id, y volvemos a pintar el carrito como antes pero sin ese producto eliminado

const eliminarProducto = (id) => {

    const foundId = carrito.find((element) => element.id === id);
    console.log(foundId)

    // carrito esta definido como una variable global arriba de todo , entonces ahora piso su valor. le doy un nuevo valor , con todos los productos que no tengan el id que encontro antes, que son los que el usuario quiere eliminar.
    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId //los que no contengan este id, los que sean distintos al id
    } );

    carritoCounter();
      //hay que avisarle al ls que le estamos eliminando un producto
    saveLocal();
    pintarCarrito();
    
}

//creamos una funcion que vaya pintando el carrito counter 

const carritoCounter = () => {
    cantidadCarrito.style.display ="flex";

    //el carrito.length lo guardamos en el ls. al tenerlo en una variable lo puedo guardar en ls
    const carritoLength = carrito.length;

    localStorage.setItem("carritoLength", JSON.stringify(carritoLength))


    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"));
}

carritoCounter();

//funcion para generar el mensaje por whatsapp 

const generarMensajeWhatsApp = () => {
    let mensaje = "¡Hola! Me gustaría hacer un pedido de los siguientes productos:\n\n";
    
    carrito.forEach((producto) => {
        mensaje += `Producto: ${producto.name}\n`;
        mensaje += `Color: ${producto.color}\n`; // Incluir el color en el mensaje
        mensaje += `Cantidad: ${producto.quantity}\n`;
        mensaje += `Precio: ${producto.price}\n\n`;
    });

    const total = carrito.reduce((acc,el) => acc + (el.quantity*(Number(el.price.replace(/[^0-9.-]+/g,"")))),0 );
    mensaje += `Total a pagar: $${total}`;
    
    return mensaje;
};

//enviar mensaje al whatsapp 

const enviarMensajeWhatsApp = () => {
    const mensaje = encodeURIComponent(generarMensajeWhatsApp()); 
    const numeroWhatsApp = "5491161622602";
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensaje}`;
    
    // Redirigir a la URL de WhatsApp
    window.open(url, '_blank');
};

//local storage 

//set item: para enviar,  guardar informacion en el local storage. setItem recibe 2 parametros: una palabra que represente lo que guardamos en ls. puede ser cualquier palabra. y el segundo es lo que vamos a guardar. al ls solo le podemos mandar strings

//voy a guardar el carrito en ls

const saveLocal = () => {
    localStorage.setItem("carrito",JSON.stringify(carrito));
}

//get item : obtenemos eso que guardamos. trabaja con JSON.parse. cuando recuperamos la info la tenemos que volver a parsear. no queremos que sea el string , queremos que sea el array de objetos de carrito.

