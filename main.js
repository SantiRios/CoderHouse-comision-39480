
class Sistema{
    constructor(){
        this.lstProductos = [];
        this.carrito = [];
    }
    async cargarProductosYMostrarEnDOM(){
        const resp = await fetch("../api/productos.json")
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
            //notificacion
            Toastify({

                text: "Producto agregado",
                
                duration: 3000,
                position: 'right'
                }).showToast();
            });
        });
        contenedorProductos.append(contenedor);
    };
    cargarCarrito(){
        const verCarrito = document.getElementById("verCarrito");
        verCarrito.addEventListener("click", ()=>{this.pintarCarrito()});
    }
    pintarCarrito(){
        const carritoContenedor = document.getElementById("carritoContenedor");
        carritoContenedor.innerHTML = " ";
        carritoContenedor.style.display = "grid";
        const carritoHeader = document.createElement("div");
        carritoHeader.classList.add("carritoHeader");
        carritoHeader.innerHTML = ` 
        <h2>Carrito</h2>
        `;
        let closeBtn = document.createElement("button");
        closeBtn.innerText = "X";
        closeBtn.classList.add("carritoHeaderButton");
        closeBtn.addEventListener("click", () => {
        carritoContenedor.style.display = "none";
        });
        carritoHeader.append(closeBtn);
        carritoContenedor.append(carritoHeader);
        JSON.parse(localStorage.getItem("carrito")).forEach((e) => {
            const carritoBody = document.createElement("div");
            carritoBody.classList.add("carritoBody");
            carritoBody.innerHTML = `
            <img src="${e.imagen}">
            <h3 class="nombreProd">${e.nombre}</h3>
            <h5>${e.total}</h5>
            <div class = "carritoCantidadCont">
                <h4>Cantidad: ${e.cantidad}</h4>
                <button class = "deleteProd">X</button>
            </div>
            
        `;
            carritoContenedor.append(carritoBody);
            //borrar producto
            let eliminar = carritoContenedor.querySelector(".deleteProd");
            eliminar.addEventListener("click", () => {
                this.eliminarProducto(e.id);
            });
        });
        const carritoTotal = document.createElement("div");
        carritoTotal.classList.add("carritoTotal");
        const total = JSON.parse(localStorage.getItem("carrito")).reduce((acc, el) => acc + el.total, 0);
        carritoTotal.innerHTML = `<h2>Total a pagar: ${total}</h2>`;
        let pagar = document.createElement("button");
        pagar.innerText = "Pagar";
        pagar.setAttribute("id","checkoutBtn")
        carritoContenedor.append(carritoTotal);
        carritoTotal.append(pagar);
        pagar.addEventListener("click", () => {
            this.pagarProductos();
            carritoContenedor.innerHTML = " ";
        });
    };
    pagarProductos(){
        let checkout = document.getElementById("checkoutCont");
        checkout.innerHTML=" ";
        checkout.style.display = "grid";
        const checkoutHeader = document.createElement("div");
        checkoutHeader.classList.add("checkoutHeader");
        checkoutHeader.innerHTML = `
        <h2>Checkout</h2>
        `;
        checkout.append(checkoutHeader);
        let closeBtn = document.createElement("button");
        closeBtn.innerText = "X";
        closeBtn.classList.add("carritoHeaderButton");
        closeBtn.addEventListener("click", () => {
            checkout.style.display = "none";
        });
        checkoutHeader.append(closeBtn);
            const checkoutBody = document.createElement("div");
            checkoutBody.classList.add("checkoutBody");
            checkoutBody.innerHTML = `
            <form action="" id="form">
                <div class="formContenedor">
                    <ul>
                        <div>
                            <li>
                                <label for="inumtc">Numero tarjeta</label>
                                <input type="text" id="inumtc" name="userTCNumber">
                            </li>
                        </div>
                        <div>
                            <li>
                                <label for="ivenc">Vencimiento</label>
                                <input type="text" id="ivenc" name="userTCVenc">
                            </li>
                        </div>
                        <div>
                            <li>
                                <label for="iPsw">Codigo seguridad:</label>
                                <input type="text" id="iPsw" name="userTCPsw">
                            </li>
                        </div>
                        <div>
                            <li>
                                <input type="submit" class="formBtnEnviar">
                            </li>
                        </div>
                    </ul>
                </div>
            </form>
            `;
            checkout.append(checkoutBody);
            const checkoutInput = document.querySelector(".formBtnEnviar");
            checkoutInput.addEventListener("click", () => {
                checkout.innerHTML = " ";
                const successAlert = document.createElement("div");
                successAlert.classList.add("successAlert");
                successAlert.innerHTML = `
                <div class="successAlertContenedor">
                <h1>Tu compra se realizo con exito</h1>
                <p>Tu compra fue procesada con exito</p>
                <a href="./productos.html" class="btn btn-success">Continuar comprando</a>
                </div>
                `;
                checkout.append(successAlert);
                localStorage.removeItem("carrito");
            });
    };
    eliminarProducto(id){
        const foundId = JSON.parse(localStorage.getItem("carrito")).find((e)=>e.id ===id);
        console.log(foundId);
        let auxCarrito = JSON.parse(localStorage.getItem("carrito")).filter((p)=>{
            return p.id !== foundId.id;
        });
        this.carrito=auxCarrito;
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.cargarCarrito();
    };
    buscarProducto(){
        const inputLabel = document.getElementById("busquedaLabel");
        const input = document.getElementById("busqueda");
        const productosColection = document.querySelector(".productosItem");
        inputLabel.addEventListener("click", ()=>{
            let lstProductosFilter = this.lstProductos.filter(e => e.nombre.toLowerCase().includes(input.value.toLowerCase()));
            this.busquedaEnDOM(lstProductosFilter);
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
