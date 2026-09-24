import readline from "node:readline/promises";
import {cocina} from "./cocina.js";
import {agregarPedido,mostrarTotalAcumulado,listarPedidos,marcarPedidoComoPagado} from "./caja.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mostrarPromociones() {
    const promociones = cocina.inventario.slice(0, 2).map(producto => {
        return {
            ...producto,
            precio: producto.precio * 0.50
        };
    }); 

    return promociones;
}

function mostrarListaProductos(productos) {
    return productos.map(producto =>
        `[${producto.id}] ${producto.nombre} - $${producto.precio}`
    ).join("\n");
}

function productoDisponible(producto) {
    if (producto.stock <= 0) {
        console.log(`${producto.nombre} no esta disponible`);
        return false;
    }

    return true;
}

function opciones() {
    return `
 . ══════════════════════ Hola ${nombreUsuario} ══════════════════════ .

                . ════  Ingrese una opcion ════ .


  [ 1 ]  Mostrar productos
  [ 2 ]  Crear Pedido
  [ 3 ]  Mostrar pedidos
  [ 4 ]  Mostrar total de caja
  [ 5 ]  Pagar
  [ 6 ]  Promociones
  [ 7 ]  Ver productos baratos (<= $80)
  [ 8 ]  Ver productos caros (> $80)
  [ 9 ]  Buscar por palabra clave
    [ 10 ] Agregar producto
    [ 11 ] Editar producto
    [ 12 ] Eliminar producto
    [ 13 ] Buscar producto por ID
    [ 14 ] Salir


`;
}

let totalPedido = 0;
let pedidoActual = null;


console.clear();

console.log(" . ══════════════════════ Bienvenido a CoffeeCode ══════════════════════ . \n");

let nombreUsuario = await rl.question(
    "                      . ════ Ingrese su nombre ════ .             \n\nNombre: "
);

let ejecutando = true;

while (ejecutando) {

    console.clear();

    let opcion = await rl.question(opciones());

    switch (Number(opcion)) {

        case 1:

            console.clear();

            console.log("═══ PRODUCTOS ═══\n");

            console.table(cocina.listarProductos());

            await rl.question("\nPresiona ENTER para continuar...");

            break;


        case 2:

            console.clear();

            console.log("═══ CREAR PEDIDO ═══\n");

            console.log(mostrarListaProductos(cocina.inventario));

            const productosPedido = [];

            while (true) {
                let id = await rl.question(
                    "\nIngrese el ID del producto (0 para terminar): "
                );

                id = Number(id);

                if (id === 0) {
                    break;
                }

                const producto = cocina.buscarProducto(id);

                if (!producto) {
                    console.log("Producto no encontrado");
                    continue;
                }

                if (!productoDisponible(producto)) {
                    continue;
                }

                productosPedido.push(producto);

                console.log(`"${producto.nombre}" agregado al pedido`);
            }

            if (productosPedido.length === 0) {

                console.log("\nNo se agregaron productos");

            } else {

                totalPedido = 0;

                productosPedido.forEach(producto => {
                    totalPedido += producto.precio;
                });

                totalPedido *= 1.16;

                pedidoActual = agregarPedido(nombreUsuario, productosPedido);

            }

            await rl.question("\nPresiona ENTER para continuar...");

            break;


        case 3:
            console.clear();

            listarPedidos();

            await rl.question("\nPresiona ENTER para continuar...");

            break;


        case 4:

            console.clear();

            mostrarTotalAcumulado();

            await rl.question("\nPresiona ENTER para continuar...");

            break;


        case 5:
            {
                console.clear();

                if (totalPedido === 0) {
                    console.log("No hay un pedido para pagar.");
                    await rl.question("\nPresiona ENTER para continuar...");
                    break;
                }

                console.log("══════════════════════ PAGAR ══════════════════════\n");
                console.log(`Total a pagar: $${totalPedido}`);

                let dinero = await rl.question("\nIngrese cantidad: $");
                dinero = Number(dinero);

                let cantidadSuficiente = false;

                while (cantidadSuficiente != true) {
                    if (dinero < totalPedido) {

                        console.log("\nCantidad insuficiente\n");
                        console.log("══════════════════════ PAGAR ══════════════════════\n");
                        console.log(`Total a pagar: $${totalPedido}`);

                        dinero = await rl.question("\nIngrese cantidad: $");
                        dinero = Number(dinero);

                    } else {
                        cantidadSuficiente = true;
                        let cambio = dinero - totalPedido;

                        console.log("\nPago realizado");
                        console.log(`Total: $${totalPedido}`);
                        console.log(`Recibido: $${dinero}`);
                        console.log(`Cambio: $${cambio}`);

                        marcarPedidoComoPagado(pedidoActual.id);
                        totalPedido = 0;
                        pedidoActual = null;

                    }
                }



                await rl.question("\nPresiona ENTER para continuar...");

            }
            break;

        case 6:
            console.clear();
            const promociones = mostrarPromociones();

            console.log("═══ PRODUCTOS EN PROMOCION ═══\n");
            console.log(mostrarListaProductos(promociones));

            const productosPromocion = [];

            while (true) {
                let id = await rl.question(
                    "\nIngrese el ID del producto (0 para terminar): "
                );

                id = Number(id);

                if (id === 0) {
                    break;
                }

                const productoOriginal = cocina.buscarProducto(id);
                const producto = promociones.find(producto => producto.id === id);

                if (!productoOriginal || !producto) {
                    console.log("Producto no encontrado");
                    continue;
                }

                if (!productoDisponible(productoOriginal)) {
                    continue;
                }

                productosPromocion.push(producto);

                console.log(`"${producto.nombre}" agregado al pedido`);
            }

            if (productosPromocion.length === 0) {
                console.log("\nNo se agregaron productos");
            } else {
                totalPedido = productosPromocion.reduce(
                    (total, producto) => total + producto.precio,
                    0
                );

                totalPedido *= 1.16;

                pedidoActual = agregarPedido(nombreUsuario, productosPromocion);
            }

            await rl.question("\nPresiona ENTER para continuar...");

            break;

        case 7:
            console.clear();
            console.log("═══ PRODUCTOS BARATOS (<= $80) ═══\n");
            console.table(cocina.obtenerProductosBaratos(80));
            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 8:
            console.clear();
            console.log("═══ PRODUCTOS CAROS (> $80) ═══\n");
            console.table(cocina.obtenerProductosCaros(80));
            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 9:
            console.clear();
            console.log("═══ BUSCAR PRODUCTOS ═══\n");
            let palabra = await rl.question("Ingrese la palabra a buscar (ej: cafe, alimento): ");
            
            const resultados = cocina.buscarPorPalabraClave(palabra);
            
            if (resultados.length === 0) {
                console.log("\nNo se encontraron coincidencias.");
            } else {
                console.table(resultados);
            }
            
            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 10:
            console.clear();
            console.log("═══ AGREGAR PRODUCTO ═══\n");

            let nuevoId = Number(await rl.question("ID: "));
            let nuevoNombre = await rl.question("Nombre: ");
            let nuevaCategoria = await rl.question("Categoria: ");
            let nuevoPrecio = Number(await rl.question("Precio: "));
            let nuevoStock = Number(await rl.question("Stock: "));

            console.log(cocina.agregarProducto(
                nuevoId,
                nuevoNombre,
                nuevaCategoria,
                nuevoPrecio,
                nuevoStock
            ));

            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 11:
            console.clear();
            console.log("═══ EDITAR PRODUCTO ═══\n");

            let idEditar = Number(await rl.question("Ingrese el ID del producto: "));
            let productoEditar = cocina.buscarProducto(idEditar);

            if (!productoEditar) {
                console.log(`No se encontró ningún producto con el ID ${idEditar}.`);
            } else {
                let nombreEditar = await rl.question(`Nombre (${productoEditar.nombre}): `);
                let categoriaEditar = await rl.question(`Categoria (${productoEditar.categoria}): `);
                let precioEditar = await rl.question(`Precio (${productoEditar.precio}): `);
                let stockEditar = await rl.question(`Stock (${productoEditar.stock}): `);

                console.log(cocina.editarProducto(idEditar, {
                    nombre: nombreEditar || productoEditar.nombre,
                    categoria: categoriaEditar || productoEditar.categoria,
                    precio: precioEditar === "" ? productoEditar.precio : Number(precioEditar),
                    stock: stockEditar === "" ? productoEditar.stock : Number(stockEditar)
                }));
            }

            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 12:
            console.clear();
            console.log("═══ ELIMINAR PRODUCTO ═══\n");

            let idEliminar = Number(await rl.question("Ingrese el ID del producto: "));
            console.log(cocina.eliminarProducto(idEliminar));

            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 13:
            console.clear();
            console.log("═══ BUSCAR PRODUCTO POR ID ═══\n");

            let idBuscar = Number(await rl.question("Ingrese el ID del producto: "));
            let productoEncontrado = cocina.buscarProducto(idBuscar);

            if (productoEncontrado) {
                console.table([productoEncontrado]);
            } else {
                console.log(`No se encontró ningún producto con el ID ${idBuscar}.`);
            }

            await rl.question("\nPresiona ENTER para continuar...");
            break;

        case 14:

            ejecutando = false;

            break;


        default:

            console.log("Opcion no valida.");

            await rl.question("\nPresiona ENTER para continuar...");
    }
}

rl.close();

console.log("\nGracias por visitar CoffeeCode");