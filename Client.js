import readline from "node:readline/promises";
import { cocina } from "./cocina.js";
import { agregarPedido, mostrarTotalAcumulado, listarPedidos } from "./caja.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function opciones() {
    return `
 . ══════════════════════ Hola ${nombreUsuario} ══════════════════════ .

                . ════  Ingrese una opcion ════ .


  [ 1 ]  Mostrar productos
  [ 2 ]  Crear Pedido
  [ 3 ]  Mostrar pedidos
  [ 4 ]  Mostrar total de caja
  [ 5 ]  Pagar
  [ 6 ]  Salir


`;
}

let totalPedido = 0;

async function pagar() {

    console.clear();

    if (totalPedido === 0) {
        console.log("No hay un pedido para pagar.");
        await rl.question("\nPresiona ENTER para continuar...");
        return;
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

            totalPedido = 0;
            
        }
    }



    await rl.question("\nPresiona ENTER para continuar...");
}

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

            console.log(cocina.listarProductos());

            await rl.question("\nPresiona ENTER para continuar...");

            break;


        case 2:

            console.clear();

            console.log("═══ CREAR PEDIDO ═══\n");

            console.log(cocina.listarProductos());

            let productosPedido = [];

            while (true) {

                let id = await rl.question(
                    "\nIngrese el ID del producto (0 para terminar): "
                );

                id = Number(id);

                if (id === 0) {
                    break;
                }

                let producto = cocina.buscarProducto(id);

                if (!producto) {
                    console.log("Producto no encontrado");
                    continue;
                }

                productosPedido.push(producto);

                console.log(
                    `"${producto.nombre}" agregado al pedido`
                );
            }

            if (productosPedido.length === 0) {

                console.log("\nNo se agregaron productos");

            } else {

                totalPedido = 0;

                productosPedido.forEach(producto => {
                    totalPedido += producto.precio;
                });

                agregarPedido(nombreUsuario, productosPedido);

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

            await pagar();

            break;


        case 6:

            ejecutando = false;

            break;


        default:

            console.log("Opcion no valida.");

            await rl.question("\nPresiona ENTER para continuar...");
    }
}

rl.close();

console.log("\nGracias por visitar CoffeeCode");