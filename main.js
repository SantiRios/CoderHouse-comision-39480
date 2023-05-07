class Sistema{
    constructor(){
        this.lstProductos = [];
        this.carrito = [];
    }
    async cargarProductosYMostrarEnDOM(){
        const resp = await fetch("/api/productos.json")
        this.lstProductos = await resp.json()
        this.cargarPagProdEnDOM();
        this.buscarProducto();
    };
    cargarPagProdEnDOM(){
        const contenedorProductos = document.getElementById(
            "contenedorPagProductos"
        );
        let contenedor = document.createElement("div");
        contenedor.className += "productosContenedor";
        this.lstProductos.forEach((e) => {
            let producto = document.createElement("div");
            producto.className += "productosItem";
            producto.innerHTML = `
        <img src="${e.imagen}">
        <h5 class="nombreProductosItem">${e.nombre}</h5>
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
            <h5>${e.total}</h5>
            <h4>Cantidad: ${e.cantidad}</h4>
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
        let pagar = document.createElement("button");
        pagar.innerText = "Pagar";
        pagar.setAttribute("id","checkoutBtn")
        carritoContenedor.append(pagar);
        carritoContenedor.append(carritoTotal);
        });
    };
    async buscarProducto(){
        const resp = await fetch("/api/productos.json")
        let lstProductos = await resp.json()

        const inputLabel = document.getElementById("busquedaLabel");
        const input = document.getElementById("busqueda");
        const productosColection = document.querySelector(".productosItem");
        console.log(productosColection);
        inputLabel.addEventListener("click", ()=>{
            console.log(input.value);
            let lstProductosFilter = lstProductos.filter(e => e.nombre.includes(input.value));
            this.busquedaEnDOM(lstProductosFilter);
            console.log(lstProductosFilter);
        })
    };
    busquedaEnDOM(lstFiltrada){
        const contenedorProductos = document.getElementById(
            "contenedorPagProductos"
        );
        contenedorProductos.innerHTML = " ";
        let contenedor = document.createElement("div");
        contenedor.className += "productosContenedor";
        lstFiltrada.forEach((e) => {
            let producto = document.createElement("div");
            producto.className += "productosItem";
            producto.innerHTML = `
        <img src="${e.imagen}">
        <h5 class="nombreProductosItem">${e.nombre}</h5>
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
};
/*Iniciar Sistema*/
const sistema = new Sistema();
/*Cargar productos a sistema*/
sistema.cargarProductosYMostrarEnDOM();
/*Carrito*/
sistema.cargarCarrito();
