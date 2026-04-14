'use client';
import '../page.css';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../Context/AuthContext';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../Elements/Elements';
import { ArrowLeft } from 'lucide-react';
import Link  from 'next/link';
import { useSearchParams } from "next/navigation";
import { PedidoDB } from '../Elements/interface';





function PedidosPageInner(){
    const searchParams = useSearchParams();
    const filtro = searchParams?.get("filter"); // string | null

    const {user, URL} = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [articuloAbierto, setArticuloAbierto] = useState<number | null>(null);



    useEffect(()=>{
        
        const obtenerPedidos = async()=>{
            if(!user) return;
            try{
                const response = await fetch(`${URL}/obtener_pedidos_raqmar.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    user_id: user.internal_id
                    }),
                });
                // const text = await response.text();
                // console.log("Respuesta del servidor:", text);

                const data = await response.json();
                if(data.success){
                    setPedidos(data.pedidos);
                    setLoading(false);
                    console.log("Pedidos obtenidos: ", data.pedidos);
                } else{
                    console.log("Error obteniendo pedidos: " + data.message);
                }
            }catch(err){
                console.log("Error de red: " + err);
                setLoading(false);
            }
        }
        obtenerPedidos();        

    },[user]);


     
    const pedidosEnviados = 
    filtro === "ENTREGADO" ?
    pedidos.filter((p:[PedidoDB] )=> p[0].estatus_pedido === filtro) :
    pedidos.filter((p:[PedidoDB] )=> p[0].estatus_pedido === filtro || p[0].estatus_pedido === "ERROR EN ENTREGA"); 

   


    return(
        <div className='PedidosPage'>
                <Button type='backButton' style={{color:"#666", top:"90px"}}><Link href='/Profile'><ArrowLeft size={28}/></Link></Button>
            <h3 style={{textAlign:"center"}}>Pedidos E{filtro?.slice(1).toLowerCase()}s</h3>
            {loading ? 
                <p className='direcciones_not_loaded'>Cargando...</p>
            : pedidosEnviados.length > 0 ?
                <div className='pedidos_container'>
                    <div className='pedidos_list'>
                        {pedidosEnviados.map((pedido: [PedidoDB])=>(
                            <div className='pedido_card' key={pedido[0].pedido_id}>
                                <p>Numero de Orden: {pedido[0].pedido_id}</p>
                                <p style={{textAlign:"left"}}>Articulos:</p>
                                {pedido.map((producto: PedidoDB)=>(
                                    <div key={producto.internal_id} className="articulo_card">
                                                        
                                        <div className='articulo_card_not_extended'>
                                            <div className="articulo_card-image">
                                                <Image 
                                                    src={ producto.image_url ? `https:${producto.image_url}`: '/Image/logo.png'}
                                                    alt={producto.nombre_producto || "Imagen no disponible"}
                                                    fill
                                                    sizes='max-width: 100% max-height: 100%'
                                                    style={{objectFit: "cover", borderRadius:"7px"}}
                                                />
                                            </div>    
                                            <div className="articulo_card_content">
                                                <h3>{producto.nombre_producto}</h3>
                                                <p style={{marginTop:"-3px", marginBottom:"5px", textAlign:"center"}}>{producto.modelo}</p>
                                                <p style={{marginBottom:"5px", textAlign:"center"}}>{Number(producto.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                                                <p><b>Cantidad:</b> {producto.quantity}</p>
                                                <p><b>Estatus:</b> <b style={{color: producto.estatus_pedido === "ERROR EN ENTREGA" ? "#f00" : "#282", fontWeight:"400"}}>{producto.estatus_pedido}</b></p>
                                            </div>
                                        </div>
                                        <div style={{color:"#777", marginTop:"2px"}}
                                            onClick={()=> setArticuloAbierto(
                                                articuloAbierto === producto.internal_id ? null : producto.internal_id
                                                )}
                                        >{articuloAbierto === producto.internal_id ? <ChevronUp /> : <ChevronDown />}</div>
                                        {articuloAbierto === producto.internal_id &&
                                        <div className='articulo_card_extended' >
                                            <p><b>Comprado el: </b> {producto.fecha_compra}</p>
                                            
                                            <p><b>Sera enviado a: </b> <br />
                                            {producto.calle_envio}, {producto.colonia}, {producto.codigo_postal}, {producto.municipio}, {producto.estado}
                                            </p>
                                            {/* <button className='bubble_button' 
                                            style={{marginBottom: "10px", opacity:producto.estatus_pedido != 'PEDIDO REALIZADO' ? "0.5": ""}}
                                            onClick={()=>{
                                                if(producto.estatus_pedido != 'PEDIDO REALIZADO'){
                                                    alert("No se puede cambiar la direccion si el pedido ya esta en proceso de envio");
                                                    return; 
                                                } 
                                                setDireccionesVisible(true);
                                                setPedidoID(producto.pedido_id);
                                            }}>
                                                Cambiar Direccion
                                            </button> */}
                                        </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        ))

                        }
                    </div>
                </div>
            :
                <p className='direcciones_not_loaded'>No hay pedidos {filtro?.toLowerCase()}s actualmente</p>
            }
        </div>
    )
}

export default function PedidosPage(){
    return (
    <Suspense fallback={<p>Cargando...</p>}>
      <PedidosPageInner />
    </Suspense>
  );
}