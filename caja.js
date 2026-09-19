let pedidos=[];
let totalAcumulado=0;
export function agregarPedido(nombreCliente,productosPedido)
{
    let total=0;
    productosPedido.forEach(producto => {
        total+=producto.precio;
    });
    const pedido={
        id:pedidos.length+1,
        cliente:nombreCliente,
        productos:productosPedido,
        total:total
    }
    pedidos.push(pedido);
    totalAcumulado+=total;
    console.log('Pedido#${pedido.id} agregado. Total del pedido: $${total}. ');

}
export function listarPedidos()
{
    console.log('=== Pedidos ===');
    pedidos.forEach(pedido => {
    console.log('Pedido#${pedido.id} - Cliente: ${pedido.cliente} - Total: $${pedido.total}');
    });
}

export function mostrarTotalAcumulado()
{
    console.log('=== Caja ===');
    console.log('Total acumulado: $${totalAcumulado}');
}
