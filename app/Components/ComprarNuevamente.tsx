'use client';
import '../page.css';
import Productos from '../Components/Productos';
import { ProductoFields } from "../lib/contentful";
import { Entry } from "contentful";
import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { Button } from '../Elements/Elements';
import { ArrowLeft } from 'lucide-react';
import Link  from 'next/link';
import { PedidoItem, HomePageProps } from '../Elements/interface';




const ComprarNuevamente  = ({ productos }: HomePageProps)=>{
    const {user, URL} = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState<Entry<ProductoFields>[]>([]);
    
    
    let todosLosIds;

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

    useEffect(()=>{
    console.log("producos: ", productos);
        
        // 1. Aplanar los arrays y extraer solo los contentful_product_id
        todosLosIds = pedidos.flat().map((item: PedidoItem) => item.contentful_product_id);

        // 2. Crear un Set para búsqueda rápida
        const idsSet = new Set(todosLosIds);

        // 3. Filtrar productos de Contentful
        const filteredProductos = productos?.filter(producto => idsSet.has(producto.sys.id)) || [];
        setFiltered(filteredProductos);
    }, [pedidos, productos])

    return(
        <div>
            <Button type='backButton' style={{color:"#666", top:"90px"}}><Link href='/Profile'><ArrowLeft size={28}/></Link></Button>
            <h3 style={{textAlign:"center"}}>Comprar de Nuevo</h3>
            <Productos productos={filtered}/>
        </div>
    )
}

export default ComprarNuevamente;