class Producto{
    constructor(id, nombre, cantidad, precio, imagen, totalProductos){
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
        this.imagen = imagen;
    }
    setCantidad(cantidad){
        this.cantidad = this.cantidad + 1 ;
    }
    getId(){
        return this.id;
    }
}
class Sistema{
    constructor(){
        this.lstProductos = [];
        this.carrito = [];
    }
    cargarProductos(){
        this.lstProductos = [new Producto(1, "Bolso 01S", 1, 2400, "../img/14.jpg"),
        new Producto(2, "Bolso 02", 1, 2050, "../img/12.jpg"),
        new Producto(3, "Bolso 022", 1, 1900, "../img/13.jpg"),
        new Producto(4, "Mochila 1020", 1, 1750, "../img/5.jpg"),
        new Producto(5, "Mochila 1012", 1, 2200, "../img/6.jpg"),
        new Producto(6, "Mochila 1016", 1, 2200, "../img/4.jpg"),
        new Producto(7, "Morral 407", 1, 1900, "../img/8.jpg"),
        new Producto(8, "Morral 408", 1, 2000, "../img/9.jpg"),
        new Producto(9, "Morral 409", 1, 2100, "../img/10.jpg")
    ];
    localStorage.setItem("lstProductos", JSON.stringify(this.lstProductos));
    };
    cargarEnDOM(){
        const contenedorProductos = document.getElementById(
            "contenedorPagProductos"
        );
        let contenedor = document.createElement("div");
        contenedor.className += "productosContenedor";
        JSON.parse(localStorage.getItem("lstProductos")).forEach((e) => {
            let producto = document.createElement("div");
            producto.className += "productosItem";
            producto.innerHTML = `
        <img src="${e.imagen}">
        <h5>${e.nombre}</h5>
        <h6>$ ${e.precio}</h6>
        `;
            contenedor.append(producto);
            let comprar = document.createElement("button");
            comprar.innerText = "Comprar";
            producto.append(comprar);

            comprar.addEventListener("click", () => {
                let flag = false;
                this.carrito.forEach((p) =>{
                    if(p.id == e.id){
                        flag = true;
                        p.cantidad = p.cantidad + 1;
                        p.total = p.precio * p.cantidad;
                    }
                })
                if(!flag){
                    this.carrito.push({
                        id : e.id,
                        imagen: e.imagen,
                        nombre: e.nombre,
                        cantidad: e.cantidad,
                        precio: e.precio,
                        total : e.precio * e.cantidad
                    });
                }
            localStorage.setItem("carrito", JSON.stringify(this.carrito));
            });
        });
        contenedorProductos.append(contenedor);
    };
    cargarCarrito(){
        const carritoContenedor = document.getElementById("carritoContenedor");

        const verCarrito = document.getElementById("verCarrito");

        verCarrito.addEventListener("click", () => {
        carritoContenedor.style.display = "grid";
        carritoContenedor.innerHTML = " ";
        const carritoHeader = document.createElement("div");
        carritoHeader.classList.add("carritoHeader");
        carritoHeader.innerHTML = ` 
        <h2>Carrito</h2>
        <h4 id ="carritoHeaderButton">X</h4>
        `;
        carritoContenedor.append(carritoHeader);
        JSON.parse(localStorage.getItem("carrito")).forEach((e) => {
            const carritoBody = document.createElement("div");
            carritoBody.classList.add("carritoBody");
            carritoBody.innerHTML = `
            <img src="${e.imagen}">
            <h3>${e.nombre}</h3>
            <h4>Cantidad: ${e.cantidad}</h4>
            <h5>${e.total}</h5>
        `;
            carritoContenedor.append(carritoBody);
            const carritoHeaderButton = document.getElementById(
            "carritoHeaderButton"
            );
            carritoHeaderButton.addEventListener("click", () => {
            carritoContenedor.style.display = "none";
            });
        });

        const carritoTotal = document.createElement("div");
        carritoTotal.classList.add("carritoTotal");
        const total = JSON.parse(localStorage.getItem("carrito")).reduce((acc, el) => acc + el.total, 0);
        carritoTotal.innerHTML = `<h2>Total a pagar: ${total}</h2>`;
        carritoContenedor.append(carritoTotal);
        });
    };
}
/*Iniciar Sistema*/
const sistema = new Sistema();
/*Cargar productos a sistema*/
sistema.cargarProductos();
/*Cargar en el DOM*/
sistema.cargarEnDOM();
/*Carrito*/
sistema.cargarCarrito();