let pedidos=[];
let totalAcumulado=0;
let siguienteId=1;
export function agregarPedido(nombreCliente,productosPedido)
{
    const subtotal=productosPedido.reduce((acc,producto)=>acc+producto.precio,0);
    const IVA=subtotal*0.16;
    const total=subtotal+IVA;
    const pedido={
        
        id:siguienteId++,
        cliente:nombreCliente,
        productos:productosPedido,
        subtotal:subtotal,
        iva:IVA,
        total:total,
        pagado:false
    };
    pedidos.push(pedido);
    totalAcumulado+=total;
    console.log(`
        ===================================
        Pedido#${pedido.id}
        ===================================
        Cliente: ${pedido.cliente}
        Productos: `);
        productosPedido.forEach(producto=>{
            console.log(`- ${producto.nombre} - $${producto.precio}`);
        });
        console.log(`===================================
            Subtotal: $${pedido.subtotal}
            IVA: $${pedido.iva}
            Total: $${pedido.total}
            ===================================`); 
            return pedido;



}

export function listarPedidos()
{
    console.log('============= Pedidos =============');
    if(pedidos.length===0)
    {
        console.log('No hay pedidos registrados');
        return;
    }
    pedidos.forEach(pedido => {

        const{
            id,
            cliente,
            subtotal,
            iva,
            total,
            pagado
        }=pedido;
        
    console.log(`===================================
        Pedido#${pedido.id}
        ===================================
        Cliente: ${pedido.cliente}
        Subtotal: $${pedido.subtotal}
        IVA: $${pedido.iva}
        Total: $${pedido.total}
        Estado: ${pedido.pagado?'Pagado':'Pendiente'}
        ===================================
        `);
    });

}
export function listarPedidosPendientes()
{
    console.log('============= Pedidos Pendientes =============');
    const pendientes=pedidos.filter(pedido=>!pedido.pagado);
    if(pendientes.length===0)
    {
        console.log('No hay pedidos pendientes');
        return;
    }
    pendientes.forEach(pedido => {
        const{
            id,
            cliente,
            subtotal,
            iva,
            total
        }=pedido;
        console.log(`
            ===================================
            Pedido#${pedido.id}
            ===================================
            Cliente: ${pedido.cliente}
            Subtotal: $${pedido.subtotal}
            IVA: $${pedido.iva}
            Total: $${pedido.total}
            ===================================
        `);
    });
}
export function obtenerPedidoPorId(id)
{
    return pedidos.find(pedido=>pedido.id===id);
}
export function marcarPedidoComoPagado(id)
{
    const pedido=obtenerPedidoPorId(id);
    if(!pedido)
    {
        return null;
    }
    pedido.pagado=true;
    return pedido;
}

export function mostrarTotalAcumulado()
//HHSHSHS
{
    console.log('============= Caja ==============');
   
    console.log(`Total Acumulado: $${totalAcumulado*1.16}`);

}
