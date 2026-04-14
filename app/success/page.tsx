'use client';
import '../page.css';
import { Button } from '../Elements/Elements';
import { useShoppingBag } from '../Context/ShoppingBagContext';
import Image from 'next/image';
import { useAuth } from '../Context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PedidoItem } from '../Elements/interface';



export default function SuccessPage() {
    const { clearShoppingBag, cartList, totalCarrito } = useShoppingBag();
    const { user, direccionEnv, URL } = useAuth();
    const [fecha, setFecha] = useState("");
    const [pedidoRealizado, setPedidoRealizado] = useState([] as PedidoItem[]);

    
    console.log("Carrito en success: ", cartList);
    console.log("Direccion en success: ", direccionEnv);

    useEffect(()=>{
        setFecha(new Date().toLocaleString('es-ES'));
    },[]);

    function generarPedidoId(): string {
        // Fecha en formato YYYYMMDD
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");

        // Número random de 4 dígitos
        const random = Math.floor(1000 + Math.random() * 9000);

        return `PED-${year}${month}${day}-${random}`;
    }

    useEffect(()=>{
        if(!user) return;
        if(totalCarrito.totalPrecio < 200) return;
        const enviarCorreo = async(userEmail:string, userName: string, total: number)=>{
            await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: userEmail,
                    subject: "¡Compra Exitosa!",
                    html: `
                    <h1>¡Gracias por tu compra ${userName}!</h1>
                    <p>Tu compra ha sido realizada con exito Por un total de ${total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} Puedes consultar los detalles de tu pedido entrando a la seccion de Mis Pedidos en tu pagina de Perfil de raqmarmx.com</p>
                    <p>Te recordamos que el tiempo estimado de entrega de tus productos es de 5 a 10 dias habiles. Te estaremos informando de los avances de tu envio por este medio</p>
                    </br>
                    <p>Cualquier duda o aclaracion contactanos por Whatsapp al +523327652904 o directamente respondiendo este correo</p>
                    </br>
                    </br>
                    <p>Att. Departamento de Ventas Raqmar</p>
                    `,
                }),
                });

        }
        enviarCorreo(user.email, user.name, Number(totalCarrito.totalPrecio));

    },[user])



    

    useEffect(()=>{
        if(!fecha) return;
        if(!user) return;

        const pedidoId = generarPedidoId();  

        const DatosPedido = cartList.map((item)=>(
            {
                ...item,
                order_date: fecha,
                estatus_pedido: "PEDIDO REALIZADO",
            }
        ))
        console.log("Datos de Pedido: ", DatosPedido);

        const actualizarContentful = async () => {
            if (!user) return;

            try {
                await Promise.all(
                cartList.map(async (item) => {
                    const response = await fetch(`/api/update_contentful_product`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        entryId: item.contentful_product_id, 
                        cantidad: item.quantity 
                    }),
                    });

                    const data = await response.json();
                    if (data.success) {
                    } else {
                    console.error("Error Contentful:", data.message);
                    }
                })
                );

                console.log("Todos los productos fueron actualizados en Contentful");
            } catch (err) {
                console.error("Error general:", err);
            }
        };


        const RegistrarPedido = async()=>{
            if(!user) return;


            

            try{
                const response = await fetch(`${URL}/registrar_pedido_raqmar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_id: user.internal_id, 
                    direccion: direccionEnv,
                    pedido: DatosPedido,
                    pedido_id: pedidoId,
                }),
                });

                // const text= await response.text();
                // console.log(text);

                const data = await response.json();
                if(data.success){
                    clearShoppingBag();
                    actualizarContentful();
                    setPedidoRealizado(DatosPedido);
                    
                }
                if (!data.success) console.log("Error Pedido:", data.message);

            } catch (err) {
                console.error(err);
            }
        }
        RegistrarPedido();
    },[fecha, user, cartList, pedidoRealizado])

    
    useEffect(()=>{
        console.log("Pedido Realizado: ", pedidoRealizado)
    },[pedidoRealizado]);

    if(pedidoRealizado.length===0) return null;

    return(
        <div className='success_page'>
            <div className='pedidos_succes_content'>
                <h3 style={{textAlign:"center"}}>Articulos Pedidos</h3>
                {pedidoRealizado.map(( item: PedidoItem, index)=>(

                    <div key={index} className="ShoppingBagModule_card">
                    
                        <div className="ShoppingBagModule_card-image">
                            <Image 
                                src={ item.image_URL ? `https:${item.image_URL}`: '/Image/logo.png'}
                                alt={item.nombreProducto || "Imagen no disponible"}
                                fill
                                style={{objectFit: "cover", borderRadius:"7px"}}
                            />
                        </div>    
                        <div className="ShoppingBagModule_card-content pedidos_success_card_content">
                            <h3>{item.nombreProducto}</h3>
                            <p style={{marginTop:"-3px", marginBottom:"5px", textAlign:"center"}}>{item.modelo}</p>
                            <p style={{marginBottom:"5px", textAlign:"center"}}>{Number(item.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                            <p><b>Cantidad:</b> {item.quantity}</p>
                            <p><b>Estatus:</b> {item.estatus_pedido}</p>
                        </div>
                    </div>
                ))}
                <div className='success_page_direccion'>
                    <h4 style={{textAlign:"center"}}>Seran enviados a:</h4>
                    <p>{direccionEnv.calle_num}, {direccionEnv.colonia}, {direccionEnv.codigo_postal} </p>
                </div>
            </div>
            <p style={{textAlign:"center", fontSize:"12px"}}>
                Para mas informacion visitar la pagina de <Link href='/Pedidos' style={{color:"#23f"}}>Pedidos</Link>
            </p>
            <Link href='/HomePage'>
            <Button type='primary' style={{margin:"auto"}}>Acetpar</Button>
            </Link>
        </div>
    )
}