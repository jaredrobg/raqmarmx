'use client';
import './adminPage.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
// import { Button } from '../Elements/Elements';

type Orden = {
    estatus_pedido: string;
    user_id: number;
    name: string;
    lastname: string;
    modelo: string;
    marca: string;
    nombre_producto: string;
    precio: number;
    pedido_id: string;
    nombre_envio: string;
    calle_envio: string;
    colonia: string;
    codigo_postal: string;
    municipio: string;
    estado: string;
    entrecalle_1: string;
    entrecalle_2: string;
    numero_telefono: string;
    fecha_compra: string;
    instrucciones_entrega: string;
    email: string;
}

const AdminPage = ()=>{
    const {user} = useAuth();
    const [seccionVisible, setSeccionVisible] = useState("Pedidos");

    

    useEffect(()=>{
    },[user]);

    if(!user) return null;
    if(user.level < 2 ) return null;

    return(
        <div className='AdminPage'>
            <div className='opciones'>
                <div className='opcion' onClick={()=>setSeccionVisible("Pedidos")}>Pedidos</div>
                <div className='opcion' onClick={()=>setSeccionVisible('Entregados')}>Entregados</div>
            </div>
            {seccionVisible === 'Pedidos' && <PedidosList />}
            {seccionVisible === 'Entregados' && <EntregadosList />}
        </div>
    )
}
export default AdminPage;
    

const PedidosList = ()=>{
    const {user, URL} = useAuth();
    const [ordenes, setOrdenes] = useState([]);
    const [selector, setSelector] = useState("");
    const [actualizado, setActualizado] = useState(false);
    
    useEffect(()=>{
        
        const obtenerOrdenes = async()=>{
            if(!user) return;
            try{
                const response = await fetch(`${URL}/obtener_ordenes_raqmar.php`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                        user_id: user.internal_id
                        }),
                    });
                    // const text = await response.text();x
                    // console.log("Respuesta del servidor:", text);

                    const data = await response.json();
                    if(data.success){
                        console.log("Ordenes obtenidas: ", data.pedidos);
                        setOrdenes(data.pedidos);
                    } else{
                        console.log("Error obteniendo ordenes: " + data.message);
                    }
            }catch(err){
                console.log("Error de red: " + err);
            }
        }
        obtenerOrdenes();

    },[actualizado]);

    const enviarCorreo = async(userEmail:string, userName: string, estatus: string)=>{

        let mensaje = '';
        switch(estatus){
            case 'EN PROCESO DE ENVIO':
                mensaje = `
                <h1>Hola ${userName}! Tu pedido  se encuentra ${estatus.toLowerCase()} </h1>
                <p>Te recordamos que el tiempo estimado de entrega de tus productos es de 5 a 10 dias habiles a partir de tu compra. Te estaremos informando de los avances de tu pedido por este medio</p>
                </br>
                <p>Cualquier duda o aclaracion contactanos por Whatsapp al +523327652904 o directamente respondiendo este correo</p>
                </br>
                <b>RAQMAR   </br>TE QUEDA BIEN</b>
                </br>
                </br>
                <p>Att. Departamento de Ventas Raqmar</p>
                `;
            break;
            case 'ENVIADO':
                mensaje=`
                <h1>Hola ${userName}! Tu pedido ha sido ${estatus.toLowerCase()}!</h1>
                <p>Pronto podras disfrutar de tu compra!</p>
                </br>
                <p>Cualquier duda o aclaracion contactanos por Whatsapp al +523327652904 o directamente respondiendo este correo</p>
                </br>
                <b>RAQMAR   </br>TE QUEDA BIEN</b>
                </br>
                </br>
                <p>Att. Departamento de Ventas Raqmar</p>
                `
            break;
            case 'ENTREGADO':
                mensaje=`
                <h1>Hola ${userName}! Tu pedido ha sido ${estatus.toLowerCase()}!</h1>
                <p>Esperamos vuelvas a elegirnos para compras futuras. Recuerda que en Raqmar siempre tenemos opciones para ti!</p>
                </br>
                <p>Cualquier duda o aclaracion contactanos por Whatsapp al +523327652904 o directamente respondiendo este correo</p>
                </br>
                <b>RAQMAR   </br>TE QUEDA BIEN</b>
                </br>
                <p>Att. Departamento de Ventas Raqmar</p>
                `
            break;
            case 'ERROR EN ENTREGA':
                mensaje=`
                <h1>Hola ${userName}! Error en entrega.</h1>
                <p>Puede que el proveedor de transporte haya tenido un problema con la entrega. Te contactaremos para resolver esta situación.</p>
                </br>
                <p>Cualquier duda o aclaracion contactanos por Whatsapp al +523327652904 o directamente respondiendo este correo</p>
                </br>
                <p>Att. Departamento de Ventas Raqmar</p>
                `
            break;
        }
        
        await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: userEmail,
                subject: "ESTATUS PEDIDO",
                html: mensaje,
            }),
            });

    }

    const updateEstatus = async (estatus: string, pedidoID: string, clientName: string, clientEmail: string) => {
        if (confirm("Seguro que desea actualizar el estatus de pedido?")) {
            setActualizado(false);
            try {
                const response = await fetch(`${URL}/actualizar_estatus_raqmar.php`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                        nuevo_estatus : estatus,
                        pedidoID 
                        }),
                    });
                    // const text = await response.text();
                    // console.log("Respuesta del servidor:", text);

                    const data = await response.json();
                    if(data.success){
                        console.log("Estatus actualizado correctamente")
                        enviarCorreo(clientEmail, clientName, estatus);

                        setSelector("");
                        setActualizado(true);
                    } else{
                        console.log("Error obteniendo ordenes: " + data.message);
                    }
            } catch (e) {
                console.error(e);
            }
        }
    }



    return(
        <div className='PedidosList_container'>
            <div className='PedidosList'>
                <div className='columna'>ESTATUS DE PEDIDO</div>
                <div className='columna'>ID PEDIDO</div>
                <div className='columna'>NO. CUENTA</div>
                <div className='columna'>NOMBRE DE CUENTA</div>
                <div className='columna'>MODELO ARTICULO</div>
                <div className='columna'>ARTICULO</div>
                <div className='columna'>PRECIO</div>
                <div className='columna'>FECHA DE COMPRA</div>
                <div className='columna'>DESTINATARIO</div>
                <div className='columna'>DIRECCION DE ENVIO</div>
                <div className='columna'>ENTRE CALLES</div>
                <div className='columna'>TELEFONO</div>
                <div className='columna'>INSTRUCCIONES DE ENTREGA</div>
                {ordenes && ordenes.map((orden : Orden, index)=>
                    <>
                    <div key={`estatus-${index}`} className='celda'
                    style={{fontSize:"9px", color: orden.estatus_pedido !== 'ENVIADO'? orden.estatus_pedido === 'ERROR EN ENTREGA' ? "#db0a0a": "#02a" : "#0a2",}}>
                        {orden.estatus_pedido}
                        <button onClick={()=>{
                            if(selector === `estatus-${index}`) setSelector("");
                            else setSelector(`estatus-${index}`)
                        }}>Actualizar Estatus</button>
                        {selector === `estatus-${index}` && 
                        <div style={{marginTop: "5px"}}>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("EN PROCESO DE ENVIO", orden.pedido_id, orden.name, orden.email)}>EN PROCESO DE ENVIO</p>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("ENVIADO", orden.pedido_id, orden.name, orden.email)}>ENVIADO</p>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("ENTREGADO", orden.pedido_id, orden.name, orden.email)}>ENTREGADO</p>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("ERROR EN ENTREGA", orden.pedido_id, orden.name, orden.email)} style={{color:"#860303"}}>ERROR EN ENTREGA</p>
                        </div>}
                    </div>
                    <div key={`pedido-${index}`} className='celda'>{orden.pedido_id}</div>
                    <div key={`cuenta-${index}`} className='celda'>{orden.user_id}</div>
                    <div key={`nombre-${index}`} className='celda'>{orden.name} {orden.lastname}</div>
                    <div key={`modelo-${index}`} className='celda'>{orden.modelo}</div>
                    <div key={`articulo-${index}`} className='celda'>{orden.nombre_producto}</div>
                    <div key={`precio-${index}`} className='celda'>{Number(orden.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                    <div key={`fecha-${index}`} className='celda'>{orden.fecha_compra}</div>
                    <div key={`destinatario-${index}`} className='celda'>{orden.nombre_envio}</div>
                    <div key={`direccion-${index}`} className='celda'>{orden.calle_envio}, {orden.colonia}, {orden.codigo_postal}, {orden.municipio}, {orden.estado}</div>
                    <div key={`entre-calles-${index}`} className='celda'>{orden.entrecalle_1} y {orden.entrecalle_2}</div>
                    <div key={`telefono-${index}`} className='celda'>{orden.numero_telefono}</div>
                    <div key={`instrucciones-${index}`} className='celda'>{orden.instrucciones_entrega}</div>
                    </>
                )}
            </div>
        </div>
    )
}

const EntregadosList = ()=>{
    const {user, URL} = useAuth();
    const [entregados, setEntregados] = useState([]);

    useEffect(()=>{
        const obtenerEntregados = async()=>{
            if(!user) return;
            try{
                const response = await fetch(`${URL}/obtener_entregados_raqmar.php`, {
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
                        setEntregados(data.pedidos);
                    } else{
                        console.log("Error obteniendo ordenes: " + data.message);
                    }
            }catch(err){
                console.log("Error de red: " + err);
            }
        }
        obtenerEntregados();
    },[]);

    return(
         <div className='PedidosList_container'>
            <div className='PedidosList'>
                <div className='columna'>ESTATUS DE PEDIDO</div>
                <div className='columna'>ID PEDIDO</div>
                <div className='columna'>NO. CUENTA</div>
                <div className='columna'>NOMBRE DE CUENTA</div>
                <div className='columna'>MODELO ARTICULO</div>
                <div className='columna'>ARTICULO</div>
                <div className='columna'>PRECIO</div>
                <div className='columna'>FECHA DE COMPRA</div>
                <div className='columna'>DESTINATARIO</div>
                <div className='columna'>DIRECCION DE ENVIO</div>
                <div className='columna'>ENTRE CALLES</div>
                <div className='columna'>TELEFONO</div>
                <div className='columna'>INSTRUCCIONES DE ENTREGA</div>
                {entregados && entregados.map((orden : Orden, index)=>
                    <>
                    <div key={`estatus-${index}`} className='celda'
                    style={{fontSize:"9px", color: orden.estatus_pedido !== 'ENTREGADO'? "#02a" : "#0a2",}}>
                        {orden.estatus_pedido}
                        {/* <button onClick={()=>{
                            if(selector === `estatus-${index}`) setSelector("");
                            else setSelector(`estatus-${index}`)
                        }}>Actualizar Estatus</button>
                        {selector === `estatus-${index}` && 
                        <div style={{marginTop: "5px"}}>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("EN PROCESO DE ENVIO", orden.pedido_id)}>EN PROCESO DE ENVIO</p>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("ENVIADO", orden.pedido_id)}>ENVIADO</p>
                            <p className='estatus_opcion' onClick={()=>updateEstatus("ENTREGADO", orden.pedido_id)}>ENTREGADO</p>
                        </div>} */}
                    </div>
                    <div key={`pedido-${index}`} className='celda'>{orden.pedido_id}</div>
                    <div key={`cuenta-${index}`} className='celda'>{orden.user_id}</div>
                    <div key={`nombre-${index}`} className='celda'>{orden.name} {orden.lastname}</div>
                    <div key={`modelo-${index}`} className='celda'>{orden.modelo}</div>
                    <div key={`articulo-${index}`} className='celda'>{orden.nombre_producto}</div>
                    <div key={`precio-${index}`} className='celda'>{Number(orden.precio).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                    <div key={`fecha-${index}`} className='celda'>{orden.fecha_compra}</div>
                    <div key={`destinatario-${index}`} className='celda'>{orden.nombre_envio}</div>
                    <div key={`direccion-${index}`} className='celda'>{orden.calle_envio}, {orden.colonia}, {orden.codigo_postal}, {orden.municipio}, {orden.estado}</div>
                    <div key={`entre-calles-${index}`} className='celda'>{orden.entrecalle_1} y {orden.entrecalle_2}</div>
                    <div key={`telefono-${index}`} className='celda'>{orden.numero_telefono}</div>
                    <div key={`instrucciones-${index}`} className='celda'>{orden.instrucciones_entrega}</div>
                    </>
                )}
            </div>
        </div>
    )
}